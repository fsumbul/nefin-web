#!/usr/bin/env python3
"""
scrape-catalog.py — nefinbeauty.com'daki mevcut katalogdan ürün verisini çeker.
Yeni site, müşterinin KENDİ metinlerini kullanır; hiçbir metin üretilmez.
Çıktı: content/products.json

  python3 scripts/scrape-catalog.py
"""
import json, re, sys, urllib.request, html as htmllib
from pathlib import Path

BASE = "https://nefinbeauty.com"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36"
OUT = Path(__file__).resolve().parent.parent / "content" / "products.json"

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    return urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")

def strip_tags(s):
    s = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<li[^>]*>", "\n• ", s, flags=re.I)
    s = re.sub(r"<(br|/p|/div|/h\d)[^>]*>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    s = htmllib.unescape(s)
    s = s.replace(" ", " ")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n\s*\n+", "\n", s)
    return s.strip()

def slugify(s):
    tr = str.maketrans("çğıöşüÇĞİIÖŞÜ", "cgiosucgiiosu")
    s = s.translate(tr).lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return re.sub(r"-+", "-", s)

def parse_product(pid):
    raw = get(f"{BASE}/product-{pid}")
    title = ""
    m = re.search(r"<title>(.*?)</title>", raw, re.S)
    if m:
        title = htmllib.unescape(m.group(1)).replace(" - Nefin Beauty", "").strip()
    desc = ""
    m = re.search(r'<meta name="description" content="(.*?)"', raw)
    if m:
        desc = htmllib.unescape(m.group(1)).strip()

    # Fiyat: sayfadaki mega-menü/benzer ürün bloklarıyla karışmasın diye
    # ürünün kendi "Sepete Ekle" düğmesinden (data-product-id) sonraki fiyat kutusu okunur.
    list_price = sale_price = None
    m = re.search(rf'data-product-id="{pid}"(.*?)</div>\s*</a>', raw, re.S)
    scope = m.group(1) if m else ""
    if not scope:
        m = re.search(r'<div class="product-card-price">(.*?)</div>', raw, re.S)
        scope = m.group(1) if m else ""
    nums = [float(x.replace(".", "").replace(",", ".")) for x in re.findall(r"([\d.]+,\d{2})", scope)]
    if len(nums) >= 2:
        list_price, sale_price = max(nums[:2]), min(nums[:2])
    elif nums:
        list_price = sale_price = nums[0]

    sections = []
    for m in re.finditer(
        r'<div class="acc-item">.*?<button class="acc-btn".*?<span>(.*?)</span>.*?'
        r'<div class="acc-panel-inner">(.*?)</div>\s*</div>\s*</div>',
        raw, re.S):
        label = strip_tags(m.group(1))
        body = strip_tags(m.group(2))
        if label and body:
            sections.append({"label": label, "body": body})

    imgs = []
    for m in re.finditer(r'(https://nefinbeauty\.com/[^"\' ]*?img_[^"\' ]+?\.(?:webp|jpg|jpeg|png))', raw):
        u = m.group(1)
        if u not in imgs:
            imgs.append(u)

    intro = ""
    m = re.search(r'<div class="product-description[^"]*">(.*?)</div>\s*</div>', raw, re.S)
    if m:
        intro = strip_tags(m.group(1))
    if not intro:
        body = strip_tags(raw)
        cand = [l.strip() for l in body.split("\n") if len(l.strip()) > 90]
        intro = cand[0] if cand else desc

    # Giriş metni: madde işaretleri akordeona girdiği için burada yalnızca
    # ilk düz paragraflar tutulur.
    para = []
    for line in intro.split("\n"):
        line = line.strip()
        if not line or line.startswith("•"):
            if para:
                break
            continue
        para.append(line)
        if len(" ".join(para)) > 260:
            break
    intro = " ".join(para)

    return {
        "id": pid,
        "slug": slugify(title)[:70],
        "title": title,
        "legacyUrl": f"/product-{pid}",
        "description": desc,
        "intro": intro[:900],
        "listPrice": list_price,
        "salePrice": sale_price,
        "currency": "TRY",
        "sections": sections,
        "images": imgs[:6],
    }

def main():
    listing = get(f"{BASE}/urunler")
    ids = sorted({int(m) for m in re.findall(r"/product-(\d+)", listing)}, reverse=True)
    if not ids:
        print("Ürün bulunamadı", file=sys.stderr); sys.exit(1)
    out = []
    for pid in ids:
        try:
            p = parse_product(pid)
            out.append(p)
            print(f"✓ {pid} {p['title'][:55]} — {len(p['sections'])} bölüm, {len(p['images'])} görsel")
        except Exception as e:
            print(f"✗ {pid}: {e}", file=sys.stderr)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n{len(out)} ürün → {OUT}")

if __name__ == "__main__":
    main()
