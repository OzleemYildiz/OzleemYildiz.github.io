#!/usr/bin/env python3
"""Write a grayscale foreground mask for a photo using Apple's Vision framework.

This is the same subject-lifting that powers "copy subject" in Preview. White is
subject, black is background.

    subject_mask.py input.jpg mask.png

Exit 1 means Vision found no subject, which is the caller's cue to fall back to a
gradient blur. Needs pyobjc-framework-Vision and macOS 14 or newer.

Dev-time only. Nothing here ships to the browser.
"""

import sys

import Vision
import Quartz
from Foundation import NSURL


def fail(msg, code=1):
    print(msg, file=sys.stderr)
    sys.exit(code)


def main():
    if len(sys.argv) != 3:
        fail("usage: subject_mask.py <input> <output.png>", 2)

    src, dst = sys.argv[1], sys.argv[2]

    url = NSURL.fileURLWithPath_(src)
    ci = Quartz.CIImage.imageWithContentsOfURL_(url)
    if ci is None:
        fail(f"could not read {src}", 2)

    # Vision reports geometry in the image's own orientation, so bake in any EXIF
    # rotation first. Otherwise the mask comes back rotated against the pixels.
    ci = ci.imageByApplyingOrientation_(1)
    extent = ci.extent()
    w, h = int(extent.size.width), int(extent.size.height)

    request = Vision.VNGenerateForegroundInstanceMaskRequest.alloc().init()
    handler = Vision.VNImageRequestHandler.alloc().initWithCIImage_options_(ci, {})

    ok, err = handler.performRequests_error_([request], None)
    if not ok:
        fail(f"vision failed: {err}")

    results = request.results()
    if not results:
        fail("no subject found")

    observation = results[0]
    instances = observation.allInstances()
    if not instances or len(instances) == 0:
        fail("no subject found")

    # allInstances keeps every distinct subject Vision separated out. These photos
    # have several plants side by side, so take the union rather than the largest.
    mask_buf, err = observation.generateScaledMaskForImageForInstances_fromRequestHandler_error_(
        instances, handler, None
    )
    if mask_buf is None:
        fail(f"mask generation failed: {err}")

    mask = Quartz.CIImage.imageWithCVPixelBuffer_(mask_buf)
    m_extent = mask.extent()

    # generateScaledMaskForImage usually matches the source extent already, but
    # scale explicitly so a mismatch can never silently misalign the composite.
    if int(m_extent.size.width) != w or int(m_extent.size.height) != h:
        sx = extent.size.width / m_extent.size.width
        sy = extent.size.height / m_extent.size.height
        mask = mask.imageByApplyingTransform_(
            Quartz.CGAffineTransformMakeScale(sx, sy)
        )

    context = Quartz.CIContext.contextWithOptions_(None)
    cg = context.createCGImage_fromRect_(mask, extent)
    if cg is None:
        fail("could not rasterize mask")

    out_url = NSURL.fileURLWithPath_(dst)
    dest = Quartz.CGImageDestinationCreateWithURL(out_url, "public.png", 1, None)
    if dest is None:
        fail(f"could not open {dst} for writing")

    Quartz.CGImageDestinationAddImage(dest, cg, None)
    if not Quartz.CGImageDestinationFinalize(dest):
        fail(f"could not write {dst}")

    print(f"ok: {len(instances)} instance(s), {w}x{h}", file=sys.stderr)


if __name__ == "__main__":
    main()
