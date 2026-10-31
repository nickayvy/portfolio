import sys, os
import numpy as np
from PIL import Image

def body_box(alpha):
    m = alpha > 128
    ys, xs = np.where(m)
    top, bottom = ys.min(), ys.max()
    cut = top + int((bottom - top) * 0.55)
    ys2, xs2 = np.where(m[cut:])
    return xs2.min(), xs2.max(), bottom

fs = sorted(f for f in os.listdir('frames/raw') if f.endswith('.png'))
ref = np.array(Image.open('frames/raw/' + fs[98]).convert('RGBA'))
rx0, rx1, rb = body_box(ref[..., 3])
src = Image.open(sys.argv[1]).convert('RGBA')
sx0, sx1, sb = body_box(np.array(src)[..., 3])
scale = (rx1 - rx0) / (sx1 - sx0)
w = round(src.width * scale)
small = src.resize((w, w), Image.LANCZOS)
ox = round(rx0 - sx0 * scale)
oy = round(rb - sb * scale)
out = Image.new('RGBA', (480, 480), (0, 0, 0, 0))
out.alpha_composite(small, (ox, oy)) if ox >= 0 and oy >= 0 else out.paste(small, (ox, oy), small)
out.save(sys.argv[2])
print('scale', round(scale, 4), 'offset', ox, oy)
