"""Inspect a PDF that is about to be published (e.g. public/cv/*.pdf) WITHOUT printing personal data.

Usage: python3 tools/check-public-pdf.py public/cv/Israel-Hurtarte-CV.pdf [--max-phones N] [--no-references]
Needs PyMuPDF (`pip install pymupdf`, ideally in a throw-away venv). Reports how many phone-shaped numbers,
emails, links, annotations and embedded files the PDF contains and whether reference headings are present, so
you can decide before it ships. Everything in public/ is published; no automated test looks inside a PDF.
"""
import re
import sys

import pymupdf

doc = pymupdf.open(sys.argv[1])
text = "\n".join(page.get_text() for page in doc)
flat = re.sub(r"[\s.\-()+]", "", text)
phones = set(re.findall(r"\d{8,}", flat))
print(f"pages: {len(doc)}")
print(f"phone-shaped numbers: {len(phones)}  (each one is published to everybody)")
print(f"email addresses: {len(set(re.findall(r'[\w.+-]+@[\w-]+\.[\w.]+', text)))}")
print(f"reference headings present: {bool(re.search(r'REFERENCIAS|REFERENCES', text, re.I))}")
print(f"links: {sum(len(page.get_links()) for page in doc)} | annotations: {sum(len(list(p.annots())) for p in doc)} | embedded files: {doc.embfile_count()}")
print("metadata fields set:", [k for k, v in doc.metadata.items() if v])

# Policy checks (used by CI): exit 1 when the PDF breaks them.
args = sys.argv[2:]
problems = []
if "--max-phones" in args and len(phones) > int(args[args.index("--max-phones") + 1]):
    problems.append("more phone-shaped numbers than allowed")
if "--no-references" in args and re.search(r"REFERENCIAS|REFERENCES", text, re.I):
    problems.append("a references section is present")
if problems:
    print("FAIL:", "; ".join(problems))
    sys.exit(1)
