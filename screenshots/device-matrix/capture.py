#!/usr/bin/env python3
"""Capture the running Android app without changing saved observations."""
import html
import json
import re
import subprocess
import time
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PROFILES = [
    ('compact-phone', 'Compact phone', 640, 1136, 320),
    ('small-phone', 'Small phone', 720, 1280, 320),
    ('standard-phone', 'Standard phone', 1179, 2556, 480),
    ('original-emulator', 'Original emulator', 1280, 2856, 480),
    ('large-phone', 'Large phone', 1440, 3120, 480),
    ('small-tablet', 'Small tablet', 1200, 1920, 320),
    ('tablet', 'Tablet', 1600, 2560, 320),
    ('large-tablet', 'Large tablet', 2048, 2732, 320),
]
SCREENS = [('home', 'Beranda'), ('input', 'Pantau'), ('education', 'Edukasi'),
           ('profile', 'Profil'), ('analysis', 'Analisis Sungai')]


def adb(*args):
    return subprocess.check_output(['adb', *args], timeout=30)


def nodes():
    adb('shell', 'uiautomator', 'dump', '/sdcard/window.xml')
    return list(ET.fromstring(adb('shell', 'cat', '/sdcard/window.xml')).iter('node'))


def tap(label):
    for node in nodes():
        if label in (node.get('content-desc', ''), node.get('text', '')):
            bounds = list(map(int, re.findall(r'\d+', node.get('bounds', ''))))
            if len(bounds) == 4 and bounds[2] > bounds[0] and bounds[3] > bounds[1]:
                adb('shell', 'input', 'tap', str((bounds[0] + bounds[2]) // 2),
                    str((bounds[1] + bounds[3]) // 2))
                time.sleep(1)
                return True
    return False


def reset_scroll(width, height):
    for _ in range(3):
        adb('shell', 'input', 'swipe', str(width // 2), str(height // 3),
            str(width // 2), str(height * 3 // 4), '250')
    time.sleep(0.5)


def override(value):
    match = re.search(r'Override (?:size|density): (\S+)', value)
    return match.group(1) if match else 'reset'


def main():
    original_size = adb('shell', 'wm', 'size').decode()
    original_density = adb('shell', 'wm', 'density').decode()
    manifest = {
        'capturedAt': datetime.now(timezone.utc).isoformat(),
        'platform': 'Android emulator / Expo Go',
        'orientation': 'portrait',
        'fontScale': adb('shell', 'settings', 'get', 'system', 'font_scale').decode().strip(),
        'notes': 'Live viewport captures at scroll top. No observations were created or deleted. Analysis reflects existing data. Expo Go developer overlay may be visible. Logical dimensions describe the whole display, including system bars.',
        'profiles': [],
    }
    try:
        for slug, label, width, height, density in PROFILES:
            folder = ROOT / 'devices' / slug
            folder.mkdir(parents=True, exist_ok=True)
            adb('shell', 'wm', 'size', f'{width}x{height}')
            adb('shell', 'wm', 'density', str(density))
            time.sleep(2)
            profile = {'id': slug, 'label': label, 'physical': [width, height],
                       'density': density,
                       'logical': [round(width * 160 / density, 2), round(height * 160 / density, 2)],
                       'screens': []}
            for screen, title in SCREENS:
                if screen == 'analysis':
                    assert tap('Beranda'), 'Home tab unavailable'
                    reset_scroll(width, height)
                    # Scroll the action clear of the fixed bottom navigation before tapping.
                    adb('shell', 'input', 'swipe', str(width // 2), str(height * 7 // 10),
                        str(width // 2), str(height // 3), '400')
                    time.sleep(0.5)
                    assert tap('Lihat Analisis'), 'Analysis action unavailable'
                else:
                    assert tap(title), f'{title} tab unavailable'
                reset_scroll(width, height)
                if screen == 'education':
                    # The carousel may retain its previous position across navigation.
                    for _ in range(7):
                        adb('shell', 'input', 'swipe', str(width // 2 - 90), str(height // 3),
                            str(width // 2 + 150), str(height // 3), '150')
                    time.sleep(0.5)
                path = folder / f'{screen}.png'
                path.write_bytes(adb('exec-out', 'screencap', '-p'))
                labels = [node.get('text') for node in nodes() if node.get('text')]
                expected = {'home': 'Sahabat', 'input': 'Input Pengamatan',
                            'education': 'Kenali Bioindikator', 'profile': 'Profil',
                            'analysis': 'Analisis Sungai'}[screen]
                assert any(expected in text for text in labels), f'Wrong screen: {slug}/{screen}'
                profile['screens'].append({'id': screen, 'title': title,
                                           'path': str(path.relative_to(ROOT)), 'visibleText': labels})
                print(f'Captured {slug}/{screen}', flush=True)
            manifest['profiles'].append(profile)
    finally:
        adb('shell', 'wm', 'size', override(original_size))
        adb('shell', 'wm', 'density', override(original_density))
        time.sleep(1)
        tap('Beranda')
    (ROOT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    sections = []
    for profile in manifest['profiles']:
        logical = ' × '.join(str(v) for v in profile['logical'])
        physical = ' × '.join(str(v) for v in profile['physical'])
        figures = ''.join(
            f'<figure><a href="{s["path"]}" target="_blank"><img loading="lazy" src="{s["path"]}" '
            f'alt="{html.escape(s["title"])} on {profile["label"]}" width="{profile["physical"][0]}" '
            f'height="{profile["physical"][1]}"></a><figcaption>{html.escape(s["title"])}</figcaption></figure>'
            for s in profile['screens'])
        sections.append(f'<section id="{profile["id"]}"><h2>{profile["label"]}</h2>'
                        f'<p>{logical} dp · {physical} px · {profile["density"]} dpi</p>'
                        f'<div class="grid">{figures}</div></section>')
    links = ''.join(f'<a href="#{p["id"]}">{p["label"]}</a>' for p in manifest['profiles'])
    (ROOT / 'index.html').write_text('''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sahabat Sungai — Phone and tablet captures</title>
<style>
:root{font-family:system-ui,sans-serif;color:#173b2a;background:#f0f6f2}*{box-sizing:border-box}
body{margin:0}header,main{max-width:1800px;margin:auto;padding:28px}h1{margin:0 0 12px}
p{line-height:1.6}nav{display:flex;flex-wrap:wrap;gap:10px}nav a{padding:8px 12px;background:white;border-radius:8px;color:#005e36}
section{margin-bottom:48px;scroll-margin-top:20px}.grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px;align-items:start}
figure{margin:0;padding:8px;background:white;border-radius:12px;border:1px solid #d8e5dc}
img{display:block;width:100%;height:auto;border-radius:6px}figcaption{padding:12px 4px;font-weight:600}
@media(max-width:1000px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:600px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}header,main{padding:16px}}
</style></head><body><header><h1>Sahabat Sungai · Device matrix</h1>
<p>40 live screenshots · 8 phone/tablet sizes · 5 application screens. Click any screenshot for its original resolution.</p>
<p>Portrait Android emulator captures at default font scale. These are viewport screenshots, not full-page composites. Analysis shows the existing data state; no sample observations were inserted. Expo Go's developer overlay may appear.</p>
''' + f'<p>Captured {html.escape(manifest["capturedAt"])} · <a href="manifest.json">Capture metadata</a></p><nav>{links}</nav></header><main>'
        + ''.join(sections) + '</main></body></html>\n')
    print('Gallery complete: screenshots/device-matrix/index.html', flush=True)


if __name__ == '__main__':
    main()
