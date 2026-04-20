from pathlib import Path
import re

ROOT_DIR = Path(r'R:\opeanni.me css')
OUTPUT_FILE = Path(__file__).resolve().parent / 'THEME_CSS_TECHNIQUE_POOL.md'

if not ROOT_DIR.exists():
    raise SystemExit(f'Root directory not found: {ROOT_DIR}')

files = sorted(ROOT_DIR.rglob('*.css'))
tech = {
    'root_vars': {},
    'theme_modes': set(),
    'important': {},
    'bg_patterns': set(),
    'logo_patterns': set(),
    'mask_clip': set(),
    'fonts': set(),
    'counter': set(),
}

for path in files:
    text = path.read_text(encoding='utf-8', errors='ignore')
    for m in re.finditer(r':root\s*\{([\s\S]*?)\}', text):
        body = m.group(1)
        for line in body.splitlines():
            line = line.strip()
            if line.startswith('--'):
                key = line.split(':', 1)[0].strip()
                tech['root_vars'].setdefault(key, set()).add(line)
    if 'html.fds-theme-dark' in text:
        tech['theme_modes'].add('dark')
    if 'html.fds-theme-light' in text:
        tech['theme_modes'].add('light')
    if 'html:not(.fds-theme-light):not(.fds-theme-dark)' in text:
        tech['theme_modes'].add('system')
    imp = text.count('!important')
    if imp:
        tech['important'][path.name] = imp
    for m in re.findall(r'background(?:-image)?\s*:\s*([^;]+);', text):
        tech['bg_patterns'].add(m.strip())
    if re.search(r'::(?:before|after)', text) and 'content:' in text:
        tech['logo_patterns'].add('pseudo content overlay')
    if 'mask-image' in text or '-webkit-mask-image' in text or 'overflow: hidden' in text:
        tech['mask_clip'].add(path.name)
    if '@import' in text or 'font-family' in text:
        tech['fonts'].add(path.name)
    if 'api/count' in text or 'themeId' in text or 'theme_id' in text:
        tech['counter'].add(path.name)

with OUTPUT_FILE.open('w', encoding='utf-8') as f:
    f.write('# Theme CSS Technique Pool\n\n')
    f.write('## 1. Tema motoru ve değişkenler\n')
    f.write('Bu temalarda sıkça görülen kök değişkenler:\n')
    for key in sorted(tech['root_vars']):
        f.write(f'- `{key}`\n')
    f.write('\n### Öne çıkan değişken kategorileri\n')
    f.write('- Tema renkleri (`--ana-renk`, `--vurgu-rengi`, `--parlama-rengi`)\n')
    f.write('- Arka plan görsel tanımları (`--theme-dark-bg-image`, `--theme-light-bg-image`, `--theme-system-bg-image`)\n')
    f.write('- Kart, logo ve kontrol köşe yuvarlaklıkları\n')
    f.write('- Hover ve geçiş süreleri\n')
    f.write('- Font/başlık ayarları\n\n')
    f.write('## 2. Tema modları\n')
    for mode in sorted(tech['theme_modes']):
        f.write(f'- `{mode}`\n')
    f.write('\n## 3. Override / !important teknikleri\n')
    for fn, imp in sorted(tech['important'].items(), key=lambda x: -x[1]):
        f.write(f'- {fn}: {imp} kez `!important`\n')
    f.write('\n## 4. Arka plan / görsel stratejileri\n')
    for pat in sorted(list(tech['bg_patterns'])[:50]):
        f.write(f'- `{pat}`\n')
    if len(tech['bg_patterns']) > 50:
        f.write(f'- ... ({len(tech['bg_patterns'])} toplam)\n')
    f.write('\n## 5. Logo / metin değiştirme\n')
    if tech['logo_patterns']:
        f.write('- `::before` / `::after` pseudo-element content overlay kullanımı\n')
        f.write('- Orijinal logo/başlık bileşenlerini gizleme ve yerine tema adı/görsel koyma\n')
    f.write('\n## 6. Mask / clip düzeltmeleri\n')
    for fn in sorted(tech['mask_clip']):
        f.write(f'- {fn}\n')
    f.write('- `overflow: hidden` ile resim taşmasını önleme\n')
    f.write('- `mask-image: none` ile hedef site maskelerini kaldırma\n')
    f.write('\n## 7. Font / @import kullanımı\n')
    for fn in sorted(tech['fonts']):
        f.write(f'- {fn}\n')
    f.write('- Google Fonts veya özel font aileleri kullanımı\n')
    f.write('\n## 8. Tema tracker / kimlik\n')
    if tech['counter']:
        for fn in sorted(tech['counter']):
            f.write(f'- {fn}\n')
    else:
        f.write('- Henüz açık bir tracker `themeId` kullanımı bulunamadı.\n')

print('Theme analysis complete. Output:', OUTPUT_FILE)
