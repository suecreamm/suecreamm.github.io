(function () {
  "use strict";

  const TOC_SELECTOR = ".hb-scrollbar.sticky.top-16";
  const ACTIVE_CLASS = "toc-active";
  const NAVBAR_OFFSET = 130;

  /* ---------------------------------------------------------
     1. Mark docs pages (/docs/..., /ko/docs/...)
     --------------------------------------------------------- */
  const path = window.location.pathname;
  if (/^\/(?:[^/]+\/)?docs(?:\/|$)/.test(path)) {
    document.documentElement.classList.add("is-docs-page");
  }

  /* ---------------------------------------------------------
     2. Helpers
     --------------------------------------------------------- */
  function getTarget(link) {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return null;
    try {
      return document.getElementById(decodeURIComponent(href.slice(1)));
    } catch (e) {
      return null;
    }
  }

  /* ---------------------------------------------------------
     3. Scroll spy for one TOC
     --------------------------------------------------------- */
  function enhanceTOC(toc) {
    if (toc.dataset.tocEnhanced === "true") return;

    const entries = Array.from(toc.querySelectorAll('a[href^="#"]'))
      .map(function (link) { return { link: link, heading: getTarget(link) }; })
      .filter(function (e) { return e.heading; });

    if (!entries.length) return;
    toc.dataset.tocEnhanced = "true";

    let activeLink = null;

    function setActive(link) {
      if (link === activeLink) return;
      if (activeLink) activeLink.classList.remove(ACTIVE_CLASS);
      if (link) link.classList.add(ACTIVE_CLASS);
      activeLink = link;
    }

    function updateFromScroll() {
      let current = entries[0];

      for (const entry of entries) {
        if (entry.heading.getBoundingClientRect().top <= NAVBAR_OFFSET) {
          current = entry;
        } else {
          break;
        }
      }

      // At the very bottom, the last heading may never reach the offset
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = entries[entries.length - 1];

      setActive(current.link);
    }

    let ticking = false;
    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        updateFromScroll();
        ticking = false;
      });
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    entries.forEach(function (entry) {
      entry.link.addEventListener("click", function () {
        setActive(entry.link);
      });
    });

    updateFromScroll();
  }

  /* ---------------------------------------------------------
     4. Init (+ catch TOCs rendered later)
     --------------------------------------------------------- */
  function init() {
    document.querySelectorAll(TOC_SELECTOR).forEach(enhanceTOC);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  let pending = false;
  new MutationObserver(function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      init();
      pending = false;
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
