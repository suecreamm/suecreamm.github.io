/*
 * Auto thumbnails for the "Recent Updates" block on the home page.
 *
 * For each item in #recent:
 *   1. fetch the linked page
 *   2. use its og:image if it is a real page image (not the site-wide default)
 *   3. otherwise use the first image inside the article body
 *   4. if nothing is found, leave the item without a thumbnail
 *
 * Results are cached in sessionStorage so revisiting the home page is instant.
 */
(function () {
  "use strict";

  const ROOT_SELECTOR = "#recent";
  const CACHE_KEY = "recent-thumbs:v1";

  const root = document.querySelector(ROOT_SELECTOR);
  if (!root) return;

  /* ---------- cache ---------- */
  let cache = {};
  try {
    cache = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "{}");
  } catch (e) {
    cache = {};
  }
  function saveCache() {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
    }
  }

  /* ---------- site default og:image (to ignore) ---------- */
  function ogImageOf(doc, base) {
    const meta =
      doc.querySelector('meta[property="og:image"]') ||
      doc.querySelector('meta[name="twitter:image"]');
    const content = meta && meta.getAttribute("content");
    return content ? new URL(content, base).href : null;
  }
  const siteDefaultOg = ogImageOf(document, location.href);

  function looksLikeSiteIcon(url) {
    return /\/(icon|logo|avatar)[^/]*\.(png|svg|jpe?g|webp)(\?|$)/i.test(url);
  }

  /* ---------- pick an image from a fetched page ---------- */
  function pickImage(doc, pageUrl) {
    const og = ogImageOf(doc, pageUrl);
    if (og && og !== siteDefaultOg && !looksLikeSiteIcon(og)) {
      return og;
    }

    const scope =
      doc.querySelector("main article .prose") ||
      doc.querySelector(".prose") ||
      doc.querySelector("main article") ||
      doc.querySelector("main");
    if (!scope) return null;

    const imgs = scope.querySelectorAll("img");
    for (const img of imgs) {
      if (img.closest("header, nav, footer, aside")) continue;
      const src =
        img.getAttribute("src") ||
        img.getAttribute("data-src") ||
        "";
      if (!src || src.startsWith("data:")) continue;
      if (/\.svg(\?|$)/i.test(src)) continue;
      const url = new URL(src, pageUrl).href;
      if (looksLikeSiteIcon(url)) continue;
      return url;
    }
    return null;
  }

  /* ---------- render ---------- */
  function addThumb(item, src, alt) {
    if (!src || item.querySelector(".recent-thumb")) return;
    const img = document.createElement("img");
    img.className = "recent-thumb";
    img.src = src;
    img.alt = alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", function () {
      img.remove();
      item.classList.remove("has-thumb");
    });
    item.appendChild(img);
    item.classList.add("has-thumb");
  }

  async function processItem(item) {
    const link = item.querySelector("a[href]");
    if (!link) return;

    const pageUrl = new URL(link.getAttribute("href"), location.href).href;
    if (new URL(pageUrl).origin !== location.origin) return;

    const title = (link.textContent || "").trim();

    if (pageUrl in cache) {
      addThumb(item, cache[pageUrl], title);
      return;
    }

    try {
      const res = await fetch(pageUrl, { credentials: "same-origin" });
      if (!res.ok) return;
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const src = pickImage(doc, pageUrl);
      cache[pageUrl] = src;
      saveCache();
      addThumb(item, src, title);
    } catch (e) {
      /* network error: skip thumbnail */
    }
  }

  /* Each list item is a Tailwind "group" card */
  const items = Array.from(root.querySelectorAll(".group"))
    .filter(function (el) { return !el.parentElement.closest(".group"); });

  items.forEach(processItem);
})();
