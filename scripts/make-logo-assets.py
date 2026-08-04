"""
Turn the master ROT logo (white mark on solid black, 1024x1024) into transparent,
tintable assets.

The mark is pure white on pure black, so luminance IS the alpha channel: knock the
black out to transparent and the mark can sit on marble in any colour without
dragging a black square along with it.

Emits two assets, because the lockup does not survive being shrunk:
  rot-mark.png   - monogram only, trimmed to its own bounds. For the nav at 36px,
                   where "RICH OFF TECH" would be 3px tall mush.
  rot-lockup.png - monogram + wordmark, trimmed. For the footer at full size.
"""
from PIL import Image

SRC = "/Users/richofftechllc/rotechllc-crm/public/rot-logo.png"
OUT = "/Users/richofftechllc/rotechllc-crm/public/"

img = Image.open(SRC).convert("L")          # luminance
w, h = img.size
print(f"source {w}x{h}")

# Alpha = luminance. White mark -> opaque, black ground -> transparent.
# RGB is left white so the asset can be recoloured with a CSS filter or used
# as-is on a dark panel; the nav tints it via CSS rather than baking a colour in.
#
# FLOOR is not optional. The master has ~14k pixels of compression noise sitting
# at luminance 1-8 scattered across the "black", which is invisible to the eye but
# is enough to make getbbox() return the whole 1024x1024 canvas and trim nothing.
# Values at or below the floor go fully transparent; the rest is rescaled so the
# mark's own antialiased edges keep their full range and stay crisp.
FLOOR = 10

def to_rgba(gray):
    rgba = Image.new("RGBA", gray.size)
    rgba.putdata([
        (255, 255, 255, 0 if v <= FLOOR else min(255, round((v - FLOOR) * 255 / (255 - FLOOR))))
        for v in gray.getdata()
    ])
    return rgba

full = to_rgba(img)

# --- find the wordmark band so the monogram can be cut above it ---------------
# Scan row darkness from the bottom: the wordmark is a short band of ink with a
# clear gap of empty rows between it and the monogram above.
rows = [max(img.crop((0, y, w, y + 1)).getdata()) for y in range(h)]
ink = [y for y, v in enumerate(rows) if v > 40]
assert ink, "no ink rows found - is the master still white-on-black?"
top, bottom = ink[0], ink[-1]
print(f"ink rows {top}..{bottom}")

# The gap: longest run of empty rows inside the ink span.
gap_start = gap_len = 0
run_start = None
for y in range(top, bottom + 1):
    if rows[y] <= 40:
        if run_start is None:
            run_start = y
    else:
        if run_start is not None and y - run_start > gap_len:
            gap_start, gap_len = run_start, y - run_start
        run_start = None
print(f"largest gap: {gap_len}px starting at y={gap_start}")

mono_bottom = gap_start if gap_len > 8 else bottom

mark = full.crop((0, 0, w, mono_bottom)).crop(
    to_rgba(img.crop((0, 0, w, mono_bottom))).getbbox()
)
lockup = full.crop(full.getbbox())

# Ink variants. The nav and footer sit on light marble, where the white master
# would be invisible. Baking the colour beats a CSS `filter: brightness(0)`:
# the filter can only reach pure #000, which is harsh next to warm stone, and it
# costs a compositing pass on an element that is on every page.
#
# --rot-fg from globals.css. Keep these in step if that token moves.
INK = (20, 16, 12)

def inked(im):
    out = Image.new("RGBA", im.size, INK + (0,))
    out.putalpha(im.getchannel("A"))
    return out

for name, im in [
    ("rot-mark.png", mark),
    ("rot-lockup.png", lockup),
    ("rot-mark-ink.png", inked(mark)),
    ("rot-lockup-ink.png", inked(lockup)),
]:
    im.save(OUT + name)
    print(f"{name:<22} {im.size}")
