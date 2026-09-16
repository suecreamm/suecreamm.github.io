/*
 * Auto thumbnails for post lists:
 *   - Home:  #recent-work, #recent-updates
 *   - Works: #works-list
 *   - Blog:  #blog-list
 *
 * For each item in the blocks:
 *   1. fetch the linked page
 *   2. use its og:image if it is a real page image (not the site-wide default)
 *   3. otherwise use the first image inside the article body
 *   4. if nothing is found, leave the item without a thumbnail
 *
 * Results are cached in sessionStorage so revisiting a list is instant.
 */
(function () {
  "use strict";

  const ROOT_SELECTOR = "#recent-work, #recent-updates, #works-list, #blog-list";
  const CACHE_KEY = "recent-thumbs:v3";
  const MAX_PARALLEL = 3;

  function init() {
    const roots = document.querySelectorAll(ROOT_SELECTOR);
    if (!roots.length) return;

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
        /* storage full or disabled: ignore */
      }
    }

    /* ---------- site default og:image (to ignore) ---------- */
    function ogImageOf(doc, base) {
      const meta =
        doc.querySelector('meta[property="og:image"]') ||
        doc.querySelector('meta[name="twitter:image"]');
      const content = meta && meta.getAttribute("content");
      if (!content) return null;
      try {
        return new URL(content, base).href;
      } catch (e) {
        return null;
      }
    }
    const siteDefaultOg = ogImageOf(document, location.href);

    function looksLikeSiteIcon(url) {
      return /\/(icon|logo|avatar|favicon)[^/]*\.(png|svg|jpe?g|webp|ico)(\?|$)/i.test(url);
    }

    /* ---------- pick an image from a fetched page ---------- */
    function pickImage(doc, pageUrl) {
      const og = ogImageOf(doc, pageUrl);
      if (og && og !== siteDefaultOg && !looksLikeSiteIcon(og)) {
        return og;
      }

      const scope =
        doc.querySelector("main article .prose") ||
        doc.querySelector("main .prose") ||
        doc.querySelector(".prose") ||
        doc.querySelector("main article") ||
        doc.querySelector("article") ||
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
        let url;
        try {
          url = new URL(src, pageUrl).href;
        } catch (e) {
          continue;
        }
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
      item.insertBefore(img, item.firstChild);
      item.classList.add("has-thumb");
    }

    async function processItem(item) {
      const link =
        item.querySelector("h1 a[href], h2 a[href], h3 a[href], h4 a[href]") ||
        item.querySelector("a[href]") ||
        (item.matches("a[href]") ? item : null);
      if (!link) return;

      let pageUrl;
      try {
        pageUrl = new URL(link.getAttribute("href"), location.href);
      } catch (e) {
        return;
      }
      if (pageUrl.origin !== location.origin) return;
      pageUrl.hash = "";
      const key = pageUrl.href;

      const title = (link.textContent || "").trim();

      if (key in cache) {
        addThumb(item, cache[key], title);
        return;
      }

      try {
        const res = await fetch(key, { credentials: "same-origin" });
        if (!res.ok) return;
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const src = pickImage(doc, key);
        cache[key] = src;
        saveCache();
        addThumb(item, src, title);
      } catch (e) {
        /* network error: skip thumbnail */
      }
    }

    /* ---------- find list items ---------- */
    function findItems(root) {
      /* Preferred: each item is a Tailwind "group" card */
      let found = Array.from(root.querySelectorAll(".group")).filter(function (el) {
        return !el.parentElement.closest(".group");
      });
      if (found.length) return found;

      /* Fallback: any element that holds a heading with a link */
      const headings = root.querySelectorAll("h2 a[href], h3 a[href], h4 a[href]");
      const set = new Set();
      headings.forEach(function (a) {
        let el = a.closest("article, li") || a.parentElement.parentElement;
        if (el && root.contains(el) && el !== root) set.add(el);
      });
      return Array.from(set);
    }

    const items = [];
    roots.forEach(function (root) {
      findItems(root).forEach(function (el) {
        items.push(el);
      });
    });
    if (!items.length) return;

    /* ---------- run with limited parallel fetches ---------- */
    let index = 0;
    function next() {
      if (index >= items.length) return Promise.resolve();
      const item = items[index++];
      return processItem(item).then(next);
    }
    for (let i = 0; i < Math.min(MAX_PARALLEL, items.length); i++) {
      next();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();