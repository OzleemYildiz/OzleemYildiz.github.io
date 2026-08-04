#!/usr/bin/env bash
#
# build-images.sh - one-shot asset pipeline for the portfolio.
#
# Reads the original photos from the repo root, writes web-ready WebP + JPEG
# into img/. Run it once; the outputs are committed and the browser never sees
# any of this. Re-run only if a source photo changes.
#
#   ./tools/build-images.sh
#
# Requires ImageMagick, plus a Python with pyobjc-framework-Vision for the plant
# background blur. Point PYTHON at that interpreter:
#
#   PYTHON=/path/to/venv/bin/python ./tools/build-images.sh
#
# Without it the plant photos fall back to a depth-gradient blur, which needs no
# segmentation and produces no cutout artifacts. The script says which path each
# photo took.

set -euo pipefail

# BASH_SOURCE rather than $0 so this still resolves correctly when the script is
# sourced (". tools/build-images.sh") instead of executed.
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

BUILD=tools/.build
OUT=img
PYTHON="${PYTHON:-python3}"

mkdir -p "$BUILD" "$OUT"

# JPEG quality for photographic output, and the WebP equivalent.
JQ=82
WQ=80

# Working resolution cap. The sources are up to 5712x4284, and holding several
# clones of that in memory at once is enough to get the process OOM-killed. Every
# output is 1200px or smaller, so 2200px on the long edge is plenty of headroom.
WORK=2200

export MAGICK_MEMORY_LIMIT=1GiB
export MAGICK_MAP_LIMIT=2GiB

have_vision() {
    "$PYTHON" -c "import Vision" >/dev/null 2>&1
}

# normalize <src> <name>
# Bakes EXIF rotation into the pixels and strips all metadata, so nothing
# downstream has to reason about orientation and no GPS data ships to the web.
normalize() {
    local src="$1" name="$2"
    magick "$src" -auto-orient -strip -resize "${WORK}x${WORK}>" \
        -quality 96 "$BUILD/${name}_src.jpg"
    echo "  normalized $name -> $(magick identify -format '%wx%h' "$BUILD/${name}_src.jpg")"
}

# blur_background <name> <output-width> <output-height>
# Composites the sharp subject over a blurred, slightly darkened copy of itself.
# Falls back to a depth-gradient blur if Vision cannot find the subject.
blur_background() {
    local name="$1" w="$2" h="$3"
    local src="$BUILD/${name}_src.jpg"
    local mask="$BUILD/${name}_mask.png"
    local out="$BUILD/${name}_blurred.png"

    local strips="${4:-0}"
    local ok=1

    if have_vision; then
        if [ "$strips" -gt 0 ]; then
            "$PYTHON" tools/subject_mask_tiled.py "$src" "$mask" "$strips" 2>&1 | sed 's/^/    /' && ok=0 || ok=1
        else
            "$PYTHON" tools/subject_mask.py "$src" "$mask" 2>&1 | sed 's/^/    /' && ok=0 || ok=1
        fi
    fi

    # In a three-image -composite the mask selects the SECOND image where it is
    # white. The second image here is the blurred copy, and Vision returns white
    # for the subject, so the mask has to be negated or the plants are what gets
    # blurred.
    if [ "$ok" -eq 0 ] && [ -f "$mask" ]; then
        # Feather the mask edge so the cutout does not read as a cutout, then
        # lay the sharp original back over a blurred, slightly dimmed copy.
        magick "$src" \
            \( +clone -blur 0x24 -modulate 94,90 \) \
            \( "$mask" -blur 0x3 -negate -alpha off \) \
            -compose over -composite \
            "$out"
        echo "    -> subject cutout"
    else
        # No segmentation: sharp through the band the plants occupy, soft toward
        # the top where the distracting background lives. White at the top means
        # the blurred copy wins there. No cutout artifacts by construction.
        magick "$src" \
            \( +clone -blur 0x24 -modulate 94,90 \) \
            \( +clone -alpha off -sparse-color barycentric \
               "0,0 white 0,%[fx:h*0.62] black" -alpha off \) \
            -compose over -composite \
            "$out"
        echo "    -> depth-gradient blur (fallback)"
    fi

    magick "$out" -resize "${w}x${h}^" -gravity center -extent "${w}x${h}" \
        -unsharp 0x0.6+0.6+0.02 "$BUILD/${name}_final.png"
}

# emit <build-name> <out-name> <width> <height> [gravity]
# Writes the matching WebP and JPEG pair at one size.
emit() {
    local bn="$1" on="$2" w="$3" h="$4" g="${5:-center}"
    magick "$BUILD/${bn}" -resize "${w}x${h}^" -gravity "$g" -extent "${w}x${h}" \
        -strip -quality "$JQ" "$OUT/${on}.jpg"
    magick "$BUILD/${bn}" -resize "${w}x${h}^" -gravity "$g" -extent "${w}x${h}" \
        -strip -quality "$WQ" -define webp:method=6 "$OUT/${on}.webp"
}

echo "==> normalizing sources"
normalize "31948DBC-54DC-4CDF-8FC7-C366575ADEBE.JPG" shelf
normalize "IMG_8353.jpg" windowsill
normalize "IMG_8354.jpg" palm
normalize "IMG_0655.jpg" portrait
normalize "IMG_6763.jpg" graduation
normalize "IMG_1513_2.jpg" defense
normalize "IMG_1907.jpg" volleyball
normalize "000091050001.jpg" film
normalize "IMG_4919.jpg" hike-bay
normalize "cfeba68a-7317-4964-981f-0d17f3caafe6.JPG" hike-trail

echo
echo "==> plants (background blur)"
if have_vision; then
    echo "  Vision available via $PYTHON"
else
    echo "  Vision NOT available via $PYTHON, using gradient fallback for all plants"
fi

# The windowsill frame has three plants spread wide, so it needs the tiled pass.
echo "  shelf"
blur_background shelf 1400 1050
echo "  windowsill"
blur_background windowsill 1400 1050 4
echo "  palm"
blur_background palm 1400 1050

echo
echo "==> writing $OUT"
for p in shelf windowsill palm; do
    emit "${p}_final.png" "plant-${p}"      1200 900
    emit "${p}_final.png" "plant-${p}-sm"    600 450
done

# Portrait crops to a square from the upper part of the frame so the face is not
# centered under the circular avatar mask.
emit portrait_src.jpg portrait     960 960 north
emit portrait_src.jpg portrait-sm  480 480 north

emit graduation_src.jpg graduation 1000 750
emit defense_src.jpg    defense    1000 750
emit volleyball_src.jpg volleyball 1000 750
emit film_src.jpg       film       1000 750
emit hike-bay_src.jpg   hike-bay   1000 750
emit hike-trail_src.jpg hike-trail 1000 750 north

echo
echo "==> favicon"
# The old images/favicon.ico was a 6 MB JPEG. Replace it with a real icon.
magick "$BUILD/portrait_src.jpg" -resize 256x256^ -gravity north -extent 256x256 \
    \( -size 256x256 xc:none -fill white -draw "circle 128,128 128,4" \) \
    -alpha set -compose dstin -composite \
    -define icon:auto-resize=64,32,16 images/favicon.ico

echo
echo "==> results"
ls -la "$OUT" | awk 'NR>3 {printf "  %-28s %8.1f KB\n", $9, $5/1024}'
echo "  favicon.ico $(du -k images/favicon.ico | cut -f1) KB"
echo
echo "  img/ total: $(du -sh $OUT | cut -f1)"
