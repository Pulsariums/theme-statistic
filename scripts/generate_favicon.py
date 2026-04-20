from PIL import Image, ImageDraw
import math

size = 64
img = Image.new("RGBA", (size, size), (0, 0, 0, 255))
draw = ImageDraw.Draw(img)
center = size / 2
r = size * 0.36

for i in range(12):
    angle = i * 2 * math.pi / 12
    p1 = (center + r * math.cos(angle - 0.1), center + r * math.sin(angle - 0.1))
    p2 = (center + (r + 14) * math.cos(angle), center + (r + 14) * math.sin(angle))
    p3 = (center + r * math.cos(angle + 0.1), center + r * math.sin(angle + 0.1))
    draw.polygon([p1, p2, p3], fill=(255, 255, 255, 255))

# ring

draw.ellipse((center - r, center - r, center + r, center + r), outline=(255, 255, 255, 255), width=4)
# inner circle

draw.ellipse((center - 7, center - 7, center + 7, center + 7), fill=(255, 255, 255, 255))
# red accent

draw.polygon([
    (center - 3, center - 11),
    (center + 3, center - 1),
    (center - 3, center + 9),
    (center - 9, center - 1),
], fill=(216, 30, 58, 255))

img.save("public/favicon-64.png")
img.save("public/favicon.ico", sizes=[(64, 64)])
print("favicon files created")
