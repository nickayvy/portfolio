import sys, os
from PIL import Image, ImageDraw
fs = sorted(f for f in os.listdir('frames/raw') if f.endswith('.png'))
items = [('frames/raw/' + fs[98], 'raw 98')] + [(p, os.path.basename(p)) for p in sys.argv[2:]] + [('frames/raw/' + fs[110], 'raw 110')]
W = Image.new('RGB', (len(items) * 270, 390), (251, 250, 246)); d = ImageDraw.Draw(W)
for j, (p, l) in enumerate(items):
    c = Image.open(p).convert('RGBA').crop((126, 70, 393, 440)); W.paste(c, (j * 270, 0), c); d.text((j * 270 + 4, 375), l, fill='black')
W.save(sys.argv[1], quality=90)
