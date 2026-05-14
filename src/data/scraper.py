#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sheep marketplace scraper — Moroccan classified ads
Supports: avito.ma, moutonika.ma, and a template for My ANOC Market API
Outputs JSON schema compatible with synthetic generator.
"""

import json
import time
import random
import hashlib
import logging
import re
import argparse
from dataclasses import dataclass, field, asdict
from typing import Optional, List, Dict, Any
from urllib.parse import urljoin, urlencode

import requests
from bs4 import BeautifulSoup

# ─── Logging ────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("sheep_scraper")

# ─── Config ─────────────────────────────────────────────────────────────────

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "fr-MA,fr;q=0.9,ar;q=0.8,en;q=0.7",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

REQUEST_DELAY = (1.5, 3.5)   # seconds between requests (min, max)
MAX_PAGES     = 5             # pages to scrape per source
TIMEOUT       = 15            # seconds per request

# ─── Data model ─────────────────────────────────────────────────────────────

@dataclass
class Seller:
    name: str = "Unknown"
    phone: str = ""
    rating: float = 0.0
    location: str = ""
    experience: int = 0

@dataclass
class Listing:
    id: str = ""
    name: str = ""
    price: int = 0
    weight: int = 0
    breed: str = ""
    city: str = ""
    age: str = ""
    color: str = ""
    category: str = "Eid Sheep"
    description: str = ""
    source: str = ""
    url: str = ""
    seller: Seller = field(default_factory=Seller)
    images: List[str] = field(default_factory=list)
    featured: bool = False
    delivery: str = "not available"

def make_id(url_or_text: str) -> str:
    return hashlib.md5(url_or_text.encode()).hexdigest()[:10]

# ─── HTTP helpers ────────────────────────────────────────────────────────────

session = requests.Session()
session.headers.update(HEADERS)

def get(url: str, **kwargs) -> Optional[BeautifulSoup]:
    """Fetch a URL and return a BeautifulSoup object, or None on failure."""
    try:
        delay = random.uniform(*REQUEST_DELAY)
        log.debug("Sleeping %.1fs before %s", delay, url)
        time.sleep(delay)

        resp = session.get(url, timeout=TIMEOUT, **kwargs)
        resp.raise_for_status()
        return BeautifulSoup(resp.text, "html.parser")

    except requests.exceptions.HTTPError as e:
        log.warning("HTTP %s — %s", e.response.status_code, url)
    except requests.exceptions.ConnectionError:
        log.warning("Connection error — %s", url)
    except requests.exceptions.Timeout:
        log.warning("Timeout — %s", url)
    except Exception as e:
        log.warning("Unexpected error (%s) — %s", e, url)
    return None

def clean_price(text: str) -> int:
    """Extract integer from price string (e.g., '3 500 DH' -> 3500)."""
    if not text:
        return 0
    digits = re.sub(r'[^\d]', '', text)
    return int(digits) if digits else 0

def extract_weight(description: str) -> int:
    """Extract weight (kg) from description using regex."""
    if not description:
        return 0
    # Patterns: "65 kg", "65kg", "poids: 70kg", "70-75 kg" -> take first number
    match = re.search(r'(\d+(?:[.,]\d+)?)\s*(?:kg|kilo)', description.lower())
    if match:
        weight_str = match.group(1).replace(',', '.')
        try:
            return int(float(weight_str))
        except ValueError:
            pass
    return 0

# ─── Avito.ma scraper (improved) ──────────────────────────────────────────

AVITO_BASE    = "https://www.avito.ma"
AVITO_SEARCH  = "/fr/maroc/animaux_et_accessoires-a_vendre/mouton"

def parse_avito_listing(card, source_url: str) -> Optional[Listing]:
    try:
        a_tag = card.select_one("a[href]")
        if not a_tag:
            return None
        href = urljoin(AVITO_BASE, a_tag["href"])

        title_el = card.select_one("[class*='title'], h3, h2")
        name = title_el.get_text(strip=True) if title_el else "Mouton"

        price_el = card.select_one("[class*='price'], [class*='prix']")
        price = clean_price(price_el.get_text()) if price_el else 0

        city_el = card.select_one("[class*='city'], [class*='ville'], [class*='location']")
        city = city_el.get_text(strip=True) if city_el else ""

        img_el = card.select_one("img[src]")
        images = [img_el["src"]] if img_el else []

        listing = Listing(
            id=make_id(href),
            name=name,
            price=price,
            city=city,
            category="Eid Sheep",
            source="avito.ma",
            url=href,
            images=images,
            seller=Seller(location=city),
        )
        # Enrich from detail page (optional, can be skipped for speed)
        enrich_from_detail(listing)
        return listing
    except Exception as e:
        log.debug("parse_avito_listing error: %s", e)
        return None

def enrich_from_detail(listing: Listing):
    """Visit detail page to extract description, phone, weight, breed."""
    soup = get(listing.url)
    if not soup:
        return

    desc_el = soup.select_one("[class*='description'], [itemprop='description']")
    if desc_el:
        listing.description = desc_el.get_text(" ", strip=True)[:500]

    # Phone (may be hidden behind JS, but try)
    phone_el = soup.select_one("[class*='phone'], [href^='tel:']")
    if phone_el:
        raw = phone_el.get("href", phone_el.get_text(strip=True))
        listing.seller.phone = raw.replace("tel:", "").strip()

    seller_el = soup.select_one("[class*='seller'], [class*='vendeur']")
    if seller_el:
        listing.seller.name = seller_el.get_text(strip=True)[:60]

    # Weight extraction from description
    listing.weight = extract_weight(listing.description)

    # Breed detection (extended keywords)
    desc_lower = listing.description.lower()
    breeds = ["sardi", "beni guil", "timahdite", "boujaâd", "d'men", "ouled djellal"]
    for b in breeds:
        if b in desc_lower:
            listing.breed = b.title()
            break

def scrape_avito(max_pages: int = MAX_PAGES) -> List[Listing]:
    listings = []
    for page in range(1, max_pages + 1):
        params = {"o": page}
        url = AVITO_BASE + AVITO_SEARCH + "?" + urlencode(params)
        log.info("Avito — page %d → %s", page, url)

        soup = get(url)
        if not soup:
            break

        # More specific selector: look for listing cards
        cards = soup.select("div.listing-card, div.item, article")
        if not cards:
            log.info("No cards found on page %d.", page)
            break

        page_list = []
        for card in cards:
            listing = parse_avito_listing(card, url)
            if listing and listing.price > 0:
                page_list.append(listing)

        log.info("  → %d valid listings", len(page_list))
        listings.extend(page_list)

        # Check for next page link (optional)
        next_link = soup.select_one("a[rel='next']")
        if not next_link:
            break

    return listings

# ─── Moutonika.ma scraper (new) ───────────────────────────────────────────

MOUTONIKA_BASE = "https://moutonika.ma"
MOUTONIKA_SEARCH = "/nos-moutons"  # à vérifier sur le site réel

def scrape_moutonika(max_pages: int = MAX_PAGES) -> List[Listing]:
    listings = []
    # Moutonika appears to be a simple showcase; often no pagination.
    # We'll scrape the main page and any paginated pages if found.
    url = MOUTONIKA_BASE + MOUTONIKA_SEARCH
    log.info("Moutonika — scraping %s", url)

    soup = get(url)
    if not soup:
        return []

    # Look for product cards (adjust selectors after inspecting real site)
    cards = soup.select("article.product, .product-item, .card-mouton")
    if not cards:
        # fallback: any div containing price and image
        cards = soup.select("div:has(> img[src])")

    for card in cards:
        try:
            # Title
            title_el = card.select_one("h2, h3, .title, .product-title")
            name = title_el.get_text(strip=True) if title_el else "Mouton Sardi"

            # Price
            price_el = card.select_one(".price, .prix, .product-price")
            price = clean_price(price_el.get_text()) if price_el else 0

            # Image
            img_el = card.select_one("img")
            img_src = img_el.get("src") if img_el else ""
            if img_src and not img_src.startswith("http"):
                img_src = urljoin(MOUTONIKA_BASE, img_src)

            # Link
            link_el = card.select_one("a")
            href = urljoin(MOUTONIKA_BASE, link_el["href"]) if link_el else url

            # City (often not present, use default)
            city = "Maroc"

            listing = Listing(
                id=make_id(href),
                name=name,
                price=price,
                city=city,
                source="moutonika.ma",
                url=href,
                images=[img_src] if img_src else [],
                description=card.get_text(" ", strip=True)[:300],
                breed="Sardi" if "sardi" in name.lower() else "",
            )
            listing.weight = extract_weight(listing.description)
            if price > 0:
                listings.append(listing)
        except Exception as e:
            log.debug("Moutonika parse error: %s", e)

    log.info("Moutonika → %d listings", len(listings))
    return listings

# ─── My ANOC Market (API placeholder) ──────────────────────────────────────
# This section is prepared for future integration.
# After capturing the real API endpoints (using mitmproxy or similar),
# you can implement the actual calls.

MYANOC_API_URL = "https://api.anoc.ma/v1/listings"   # example, to be replaced
MYANOC_API_KEY = None  # if required

def scrape_myanoc() -> List[Listing]:
    """
    Scrape My ANOC Market via its mobile API.
    Currently returns empty list; you need to:
    1. Install the app on Android/iOS.
    2. Use mitmproxy or Wireshark to capture API requests.
    3. Update MYANOC_API_URL, headers, and parsing logic below.
    """
    log.warning("My ANOC Market scraping is not yet implemented.")
    log.info("To enable: capture network traffic from the app and update scrape_myanoc().")
    return []

    # Example implementation (once API is known):
    """
    headers = {
        "User-Agent": "MyANOCApp/2.0",
        "Authorization": f"Bearer {MYANOC_API_KEY}",
    }
    params = {"page": 1, "category": "mouton"}
    response = session.get(MYANOC_API_URL, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        for item in data.get("results", []):
            listing = Listing(
                id=make_id(item.get("id")),
                name=item.get("title"),
                price=item.get("price"),
                city=item.get("city"),
                source="myanoc.ma",
                url=item.get("share_url", ""),
                breed=item.get("breed", ""),
                weight=item.get("weight", 0),
                description=item.get("description"),
            )
            yield listing
    """
    return []

# ─── Generic classified scraper (legacy, kept for reference) ───────────────
# Not used by default but can be extended.

# ─── Deduplication and output ──────────────────────────────────────────────

def deduplicate(listings: List[Listing]) -> List[Listing]:
    seen = set()
    result = []
    for l in listings:
        if l.id not in seen:
            seen.add(l.id)
            result.append(l)
    return result

def save(listings: List[Listing], path: str):
    data = []
    for l in listings:
        d = asdict(l)
        d["seller"] = asdict(l.seller)
        data.append(d)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    log.info("Saved %d listings → %s", len(data), path)

# ─── CLI ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Scrape Moroccan sheep listings")
    parser.add_argument("--output", default="sheep_scraped.json", help="Output JSON file")
    parser.add_argument("--pages",  type=int, default=3, help="Max pages per source")
    parser.add_argument("--source", choices=["avito", "moutonika", "myanoc", "all"], default="all",
                        help="Which site(s) to scrape")
    parser.add_argument("--no-detail", action="store_true", help="Skip detail page enrichment (faster)")
    parser.add_argument("--dry-run", action="store_true", help="Print URLs then exit")
    args = parser.parse_args()

    if args.dry_run:
        log.info("Dry run — would scrape:")
        log.info("  Avito: %s%s?o=1", AVITO_BASE, AVITO_SEARCH)
        log.info("  Moutonika: %s%s", MOUTONIKA_BASE, MOUTONIKA_SEARCH)
        log.info("  My ANOC Market: (API call, see code)")
        return

    all_listings = []

    if args.source in ("avito", "all"):
        all_listings.extend(scrape_avito(max_pages=args.pages))

    if args.source in ("moutonika", "all"):
        all_listings.extend(scrape_moutonika(max_pages=args.pages))

    if args.source in ("myanoc", "all"):
        all_listings.extend(scrape_myanoc())

    if args.no_detail:
        # Remove detailed enrichment by clearing descriptions (optional)
        for l in all_listings:
            l.description = ""  # or keep as is

    all_listings = deduplicate(all_listings)
    log.info("Total after dedup: %d listings", len(all_listings))

    if all_listings:
        save(all_listings, args.output)
    else:
        log.warning("No listings scraped. Check selectors or network access.")

if __name__ == "__main__":
    main()