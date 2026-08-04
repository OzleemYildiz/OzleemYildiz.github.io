#!/usr/bin/env python3
"""Union subject masks taken from overlapping vertical strips of a photo.

Vision's foreground-instance request picks one dominant subject per image. The
windowsill photo has three separate plants spread across the frame, so a single
pass only finds the biggest one. Running the same request over overlapping
strips lets each plant be the dominant subject of its own strip, then the strip
masks get OR'd back into one full-frame mask.

    subject_mask_tiled.py input.jpg mask.png [strips]

Dev-time only. Nothing here ships to the browser.
"""

import sys
import subprocess
import tempfile
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SINGLE = os.path.join(HERE, "subject_mask.py")


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def main():
    if len(sys.argv) not in (3, 4):
        print("usage: subject_mask_tiled.py <input> <output.png> [strips]", file=sys.stderr)
        sys.exit(2)

    src, dst = sys.argv[1], sys.argv[2]
    strips = int(sys.argv[3]) if len(sys.argv) == 4 else 3

    w = int(run(["magick", "identify", "-format", "%w", src]).stdout)
    h = int(run(["magick", "identify", "-format", "%h", src]).stdout)

    # Overlap the strips by half a strip so a plant straddling a boundary still
    # lands whole inside at least one of them.
    step = w // (strips + 1)
    width = step * 2

    tmp = tempfile.mkdtemp(prefix="tiledmask_")
    pieces = []

    for i in range(strips + 1):
        x = min(i * step, max(0, w - width))
        crop = os.path.join(tmp, f"crop{i}.png")
        mask = os.path.join(tmp, f"mask{i}.png")
        run(["magick", src, "-auto-orient", "-crop", f"{width}x{h}+{x}+0", "+repage", crop])

        r = run([sys.executable, SINGLE, crop, mask])
        if r.returncode != 0:
            print(f"  strip {i}: {r.stderr.strip()}", file=sys.stderr)
            continue
        print(f"  strip {i} at x={x}: {r.stderr.strip()}", file=sys.stderr)

        # Paste the strip mask back into a full-frame black canvas at its offset.
        placed = os.path.join(tmp, f"placed{i}.png")
        run([
            "magick", "-size", f"{w}x{h}", "canvas:black",
            mask, "-geometry", f"+{x}+0", "-compose", "over", "-composite",
            placed,
        ])
        pieces.append(placed)

    if not pieces:
        print("no subject found in any strip", file=sys.stderr)
        sys.exit(1)

    # Lighten keeps the brighter (white = subject) pixel from each layer, which
    # is exactly a union of the masks.
    cmd = ["magick", pieces[0]]
    for p in pieces[1:]:
        cmd += [p, "-compose", "lighten", "-composite"]
    cmd += ["-colorspace", "gray", dst]
    run(cmd)

    # A strip whose dominant subject was background clutter (a parked car in the
    # window, say) contributes a small floating island. Drop any blob under 0.5%
    # of the frame; every real plant is far larger than that.
    min_area = int(w * h * 0.005)
    run([
        "magick", dst,
        "-threshold", "50%",
        "-define", "connected-components:verbose=false",
        "-define", f"connected-components:area-threshold={min_area}",
        "-define", "connected-components:mean-color=true",
        "-connected-components", "8",
        "-colorspace", "gray", dst,
    ])

    cov = run(["magick", dst, "-format", "%[fx:mean*100]", "info:"]).stdout
    print(f"ok: union of {len(pieces)} strip(s), coverage {float(cov):.1f}%", file=sys.stderr)


if __name__ == "__main__":
    main()
