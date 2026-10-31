import sys, os
import numpy as np
from PIL import Image

def collar(a):
    red = (a[..., 0] > 170) & (a[..., 1] < 90) & (a[..., 2] < 90) & (a[..., 3] > 200)
    ys, xs = np.where(red)
    return ys.min(), ys.max()

def edges(a, y):
    xs = np.where(a[y, :, 3] > 128)[0]
    return xs.min(), xs.max()

fs = sorted(f for f in os.listdir('frames/raw') if f.endswith('.png'))
body = np.array(Image.open('frames/raw/' + fs[int(sys.argv[3])]).convert('RGBA'))
src = np.array(Image.open(sys.argv[1]).convert('RGBA'))

b_bt, b_bb = collar(body)
s_bt, s_bb = collar(src)
b_bottom = np.where(body[..., 3] > 128)[0].max()
s_bottom = np.where(src[..., 3] > 128)[0].max()

b_probe = b_bb + (b_bottom - b_bb) // 3
s_probe = s_bb + (s_bottom - s_bb) // 3
bl, br = edges(body, b_probe)
sl, sr = edges(src, s_probe)

sx = (br - bl) / (sr - sl)
sy = (b_bottom - b_bb) / (s_bottom - s_bb)
ox = bl - sl * sx
oy = b_bb - s_bb * sy

warped = Image.fromarray(src).transform(
    (body.shape[1], body.shape[0]), Image.AFFINE,
    (1 / sx, 0, -ox / sx, 0, 1 / sy, -oy / sy), Image.BICUBIC)
w = np.array(warped).astype(float)
b = body.astype(float)

H = b.shape[0]
y = np.arange(H)[:, None, None]
t = np.clip((y - (b_bt - int(sys.argv[4]))) / 8, 0, 1)
wa, ba = w[..., 3:] / 255, b[..., 3:] / 255
a = wa * (1 - t) + ba * t
rgb_p = w[..., :3] * wa * (1 - t) + b[..., :3] * ba * t
rgb = np.where(a > 0, rgb_p / np.maximum(a, 1e-6), 0)
out = np.concatenate([rgb, a * 255], -1).clip(0, 255).astype(np.uint8)
Image.fromarray(out, 'RGBA').save(sys.argv[2])
print(f'sx {sx:.3f} sy {sy:.3f} offset {ox:.1f} {oy:.1f}')
