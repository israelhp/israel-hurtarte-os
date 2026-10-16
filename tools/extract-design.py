"""Statically unpack the Claude Design bundle. Never executes bundle code.

Usage: python3 -I tools/extract-design.py <bundle.html> <out_dir>
Write <out_dir> OUTSIDE the repo (e.g. the session scratchpad) or under a git-ignored path.
Produces template.html (CSS + markup + prototype logic) and the embedded runtime/font files.
"""
import base64, gzip, json, os, re, sys

src, out = sys.argv[1], sys.argv[2]
html = open(src, encoding="utf-8").read()

def grab(kind):
    m = re.search(r'<script type="__bundler/%s">(.*?)</script>' % kind, html, re.S)
    return m.group(1) if m else None

manifest = json.loads(grab("manifest"))
template = json.loads(grab("template"))
os.makedirs(out, exist_ok=True)
open(os.path.join(out, "template.html"), "w", encoding="utf-8").write(template)
EXT = {"text/javascript": "js", "application/javascript": "js", "text/css": "css",
       "font/woff2": "woff2", "image/png": "png", "image/svg+xml": "svg"}
for uid, entry in manifest.items():
    data = base64.b64decode(entry.get("data", ""))
    if entry.get("compressed"):
        data = gzip.decompress(data)
    ext = EXT.get(entry.get("mime", ""), "bin")
    open(os.path.join(out, f"{uid}.{ext}"), "wb").write(data)
    print(uid, entry.get("mime"), len(data))
