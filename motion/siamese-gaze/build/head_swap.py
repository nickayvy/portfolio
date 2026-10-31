import sys, os
import numpy as np
from PIL import Image

def collar(a):
    red = (a[..., 0] > 170) & (a[..., 1] < 90) & (a[..., 2] < 90) & (a[..., 3] > 200)
    ys, xs = np.where(red)
    return ys.min(), ys.max(), xs.min(), xs.max()

def head_width(a, y_bottom):
    m = a[..., 3] > 128
    rows = [np.where(m[y])[0] for y in range(int(y_bottom * 0.45), y_bottom)]
    return max(r.max() - r.min() for r in rows if len(r))

fs = sorted(f for f in os.listdir('frames/raw') if f.endswith('.png'))
body = np.array(Image.open('frames/raw/' + fs[int(sys.argv[3])]).convert('RGBA')).astype(float)
head = np.array(Image.open(sys.argv[1]).convert('RGBA'))
bt, bb, bx0, bx1 = collar(body.astype(int))
ht, hb, hx0, hx1 = collar(head.astype(int))
scale = head_width(body.astype(int), bt) / head_width(head.astype(int), ht)
hs = Image.fromarray(head).resize((round(head.shape[1] * scale),) * 2, Image.LANCZOS)
hsa = np.array(hs).astype(float)
ox = round((bx0 + bx1) / 2 - (hx0 + hx1) / 2 * scale)
oy = round(bb - hb * scale)
layer = np.zeros_like(body)
H, W = layer.shape[:2]
ys0, xs0 = max(0, oy), max(0, ox)
ys1, xs1 = min(H, oy + hsa.shape[0]), min(W, ox + hsa.shape[1])
layer[ys0:ys1, xs0:xs1] = hsa[ys0 - oy:ys1 - oy, xs0 - ox:xs1 - ox]
y = np.arange(H)[:, None, None]
keep = np.clip((y - (bb - 3)) / 4, 0, 1)
la = layer[..., 3:] / 255
ba = body[..., 3:] / 255 * keep
fade = np.clip(((bb + 1) - y) / 4, 0, 1)
la = la * fade
out_a = (ba + la * (1 - ba)) * 255
out_rgb_p = body[..., :3] * ba + layer[..., :3] * la * (1 - ba)
rgb = np.where(out_a > 0, out_rgb_p * 255 / np.maximum(out_a, 1e-6), 0)
rgb = np.where(out_a > 0, rgb, 0)
Image.fromarray(np.concatenate([rgb, out_a], -1).clip(0, 255).astype(np.uint8), 'RGBA').save(sys.argv[2])
print('scale', round(scale, 3), 'offset', ox, oy, 'collar body', bt, bb, 'head', ht, hb)
