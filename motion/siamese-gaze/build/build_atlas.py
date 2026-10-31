import json, os
import numpy as np
from PIL import Image

meta = json.load(open('final/siamese-gaze.json'))
cols, rows = meta['columns'], meta['rows']
cw, ch = meta['cell']
sources = meta['sourceFrames']

stills = {f'M{k}': f'frames/morph/cell_{k:02d}.png' for k in range(70, 90)}
for k in range(70, 90):
    sources[k] = f'M{k}'
sources[90] = 110

raw = sorted(f for f in os.listdir('frames/raw') if f.endswith('.png'))
atlas = Image.new('RGBA', (cols * cw, rows * ch), (0, 0, 0, 0))
for i, src in enumerate(sources):
    path = stills[src] if isinstance(src, str) else 'frames/raw/' + raw[src]
    cell = Image.open(path).convert('RGBA').crop((126, 70, 393, 440)).resize((cw, ch), Image.LANCZOS)
    a = np.array(cell)
    a[a[..., 3] < 8] = 0
    atlas.paste(Image.fromarray(a), ((i % cols) * cw, (i // cols) * ch))

atlas.save('final/siamese-gaze.webp', quality=72, alpha_quality=70, method=4)
meta['sourceFrames'] = sources
json.dump(meta, open('final/siamese-gaze.json', 'w'), indent=2)
print(sources[68:92], os.path.getsize('final/siamese-gaze.webp') // 1024, 'KB')
