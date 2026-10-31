import os
import cv2
import numpy as np
from PIL import Image

raw = sorted(f for f in os.listdir('frames/raw') if f.endswith('.png'))
keys = [
    ('frames/raw/' + raw[98], -24.6),
    ('source/gap-stills/S4-fit.png', -17.5),
    ('source/gap-stills/S3-fit.png', -7.3),
    ('source/gap-stills/S5-fit.png', 5.0),
    ('source/gap-stills/S2-fit.png', 8.8),
    ('source/gap-stills/S1-fit.png', 15.1),
    ('frames/raw/' + raw[110], 19.8),
]
CELLS = range(70, 90)
os.makedirs('frames/morph', exist_ok=True)

def load(p):
    a = np.array(Image.open(p).convert('RGBA')).astype(np.float32) / 255
    a[..., :3] *= a[..., 3:]
    return a

def gray(a):
    return ((a[..., :3].mean(-1) + (1 - a[..., 3])) * 255).clip(0, 255).astype(np.uint8)

dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
imgs = [load(p) for p, _ in keys]
flows = {}
for i in range(len(keys) - 1):
    ga, gb = gray(imgs[i]), gray(imgs[i + 1])
    flows[i] = (dis.calc(ga, gb, None), dis.calc(gb, ga, None))

H, W = imgs[0].shape[:2]
gx, gy = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))

def warp(img, flow, s):
    return cv2.remap(img, gx - s * flow[..., 0], gy - s * flow[..., 1], cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)

lo, hi = keys[0][1], keys[-1][1]
names = []
for n, k in enumerate(CELLS):
    target = lo + (hi - lo) * n / (len(CELLS) - 1)
    i = max(j for j in range(len(keys) - 1) if keys[j][1] <= target + 1e-6) if target < hi else len(keys) - 2
    t = (target - keys[i][1]) / (keys[i + 1][1] - keys[i][1])
    fab, fba = flows[i]
    a = warp(imgs[i], fab, t)
    b = warp(imgs[i + 1], fba, 1 - t)
    out = a * (1 - t) + b * t
    alpha = out[..., 3:]
    rgb = np.where(alpha > 1e-4, out[..., :3] / np.maximum(alpha, 1e-4), 0)
    img = (np.concatenate([rgb, alpha], -1) * 255).clip(0, 255).astype(np.uint8)
    name = f'frames/morph/cell_{k:02d}.png'
    Image.fromarray(img, 'RGBA').save(name)
    names.append(name)
    print(k, f'key {i}->{i + 1} t={t:.2f}')
