#!/usr/bin/env python3
import re
import sys
from pathlib import Path
import markdown

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'

TEMPLATE = '''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{title}</title>
  <style>
    body{{font-family: system-ui,Segoe UI,Roboto,Arial;max-width:900px;margin:32px auto;color:#111}}
    pre, code{{background:#f5f5f5;padding:8px;border-radius:6px}}
    table{{border-collapse:collapse;width:100%;margin:12px 0}}
    th,td{{border:1px solid #ddd;padding:8px;text-align:left}}
  </style>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <script>mermaid.initialize({{startOnLoad:true,theme:'default'}});</script>
</head>
<body>
{content}
</body>
</html>'''

MERMAID_RE = re.compile(r'```mermaid\s*(.*?)```', re.S)


def convert_markdown(md_text: str) -> str:
    # Replace mermaid fenced blocks with divs so Mermaid can render client-side
    md_text = MERMAID_RE.sub(lambda m: '<div class="mermaid">' + m.group(1).strip() + '</div>', md_text)
    html = markdown.markdown(md_text, extensions=['fenced_code', 'tables'])
    return html


def build():
    md_files = sorted(DOCS.glob('*.md'))
    pages = []
    for md in md_files:
        name = md.stem
        out = DOCS / f"{name}.html"
        md_text = md.read_text(encoding='utf-8')
        body = convert_markdown(md_text)
        title_line = md_text.splitlines()[0] if md_text else name
        title = title_line.strip('# ').strip() if title_line else name
        out.write_text(TEMPLATE.format(title=title, content=body), encoding='utf-8')
        pages.append((title, out.name))
        print(f'Wrote {out}')

    # generate index
    index_body = '<h1>Docs</h1>\n<ul>\n'
    for title, fname in pages:
        index_body += f'  <li><a href="{fname}">{title}</a></li>\n'
    index_body += '</ul>\n'
    (DOCS / 'index.html').write_text(TEMPLATE.format(title='Docs', content=index_body), encoding='utf-8')
    print('Wrote docs/index.html')


if __name__ == '__main__':
    try:
        build()
    except Exception as e:
        print('Error:', e)
        sys.exit(1)
