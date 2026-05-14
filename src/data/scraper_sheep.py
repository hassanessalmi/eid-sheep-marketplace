#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import json
import time
import random
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# ================= CONFIG =================
OUTPUT_FILE = "sheep_data.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
}

DELAY = (1, 2)


# ================= UTIL =================
def sleep():
    time.sleep(random.uniform(*DELAY))


def save_json(data):
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ Saved {len(data)} items -> {OUTPUT_FILE}")


# ================= SCRAPER REAL =================
def scrape_lebergier():
    """
    REAL SITE:
    https://lebergier-maroc.com/#moutons
    """
    print("Scraping Le Bergier Maroc...")

    url = "https://lebergier-maroc.com/"

    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(r.text, "html.parser")

        items = []

        # Try multiple selectors (site can change)
        cards = soup.find_all("div") + soup.find_all("article")

        for c in cards:
            text = c.get_text(" ", strip=True)

            # filter sheep keywords
            if not any(k in text.lower() for k in ["mouton", "sheep", "خروف", "sardi"]):
                continue

            img = c.find("img")
            img_url = img["src"] if img and img.get("src") else ""

            link = c.find("a")
            link_url = urljoin(url, link["href"]) if link and link.get("href") else url

            price = 0
            for t in text.split():
                if t.isdigit():
                    price = int(t)
                    break

            item = {
                "id": str(hash(text))[:10],
                "name": text[:60],
                "price": price,
                "city": "Morocco",
                "source": "lebergier-maroc",
                "url": link_url,
                "image": img_url
            }

            items.append(item)

        return items

    except Exception as e:
        print("Error:", e)
        return []


def scrape_avito_simple():
    print("Scraping Avito...")

    url = "https://www.avito.ma/fr/maroc/animaux_et_accessoires"

    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(r.text, "html.parser")

        items = []

        for a in soup.find_all("a", href=True):
            text = a.get_text(strip=True)

            if len(text) < 10:
                continue

            if "mouton" not in text.lower() and "sheep" not in text.lower():
                continue

            items.append({
                "id": str(hash(text))[:10],
                "name": text,
                "price": 0,
                "city": "Morocco",
                "source": "avito",
                "url": urljoin(url, a["href"])
            })

        return items

    except Exception as e:
        print("Avito error:", e)
        return []


# ================= MAIN =================
def main():
    all_data = []

    all_data += scrape_lebergier()
    sleep()
    all_data += scrape_avito_simple()

    # remove duplicates
    seen = set()
    unique = []

    for x in all_data:
        if x["id"] not in seen:
            seen.add(x["id"])
            unique.append(x)

    save_json(unique)

    print("DONE ✔️")


if __name__ == "__main__":
    main()