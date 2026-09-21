(function () {

  /*
   * =========================================================
   * Configuration / component discovery
   * =========================================================
   */

  const COMPONENT_SELECTOR =
    ".github-readme-component";


  /*
   * =========================================================
   * Path utilities
   * =========================================================
   */

  function normalizeBasePath(path) {

    if (!path) {
      return "";
    }


    return (
      path
        .replace(/^\/+/, "")
        .replace(/\/+$/, "") +
      "/"
    );

  }


  function createRepoURLs(
    repo,
    branch,
    basePath
  ) {

    const normalizedPath =
      normalizeBasePath(
        basePath
      );


    return {

      rawBase:
        `https://raw.githubusercontent.com/` +
        `${repo}/${branch}/` +
        `${normalizedPath}`,

      githubBase:
        `https://github.com/` +
        `${repo}/blob/${branch}/` +
        `${normalizedPath}`,

      readme:
        `https://raw.githubusercontent.com/` +
        `${repo}/${branch}/` +
        `${normalizedPath}README.md`

    };

  }


  /*
   * =========================================================
   * Heading IDs
   * =========================================================
   */

  function slugify(text) {

    /*
     * Same rule as GitHub, so links written in the
     * README (e.g. #phonon-linewidth--electronphonon-coupling)
     * keep working on the site.
     */
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\s-]/gu, "")
      .replace(/\s/g, "-");

  }


  function addHeadingIds(container) {

    const headings =
      container.querySelectorAll(
        "h2, h3"
      );


    const usedIds =
      new Set();


    headings.forEach(
      heading => {

        /*
         * Keep an existing ID if Marked
         * or the README already supplied one.
         */
        let id =
          heading.id ||
          slugify(
            heading.textContent
          );


        if (!id) {
          return;
        }


        const baseId = id;

        let counter = 2;


        while (
          usedIds.has(id)
        ) {

          id =
            `${baseId}-${counter}`;

          counter++;

        }


        usedIds.add(id);

        heading.id = id;

      }
    );

  }


  /*
   * =========================================================
   * README TOC generation
   * =========================================================
   */

  function createTOCLink(
    heading
  ) {

    const li =
      document.createElement("li");


    li.className =
      "my-2 scroll-my-6 scroll-py-6";


    const link =
      document.createElement("a");


    link.href =
      `#${heading.id}`;


    /*
     * Copy the heading's nodes (not textContent) so
     * rendered math shows up correctly in the TOC.
     */
    heading.childNodes.forEach(
      node => link.appendChild(node.cloneNode(true))
    );


    /*
     * Mirror Hugo Blox's current TOC classes
     * so our global CSS works identically.
     */
    if (
      heading.tagName === "H2"
    ) {

      link.className =
        "font-semibold inline-block " +
        "text-gray-500 " +
        "hover:text-gray-900 " +
        "dark:text-gray-400 " +
        "dark:hover:text-gray-300 " +
        "w-full break-words";

    } else {

      link.className =
        "pl-4 rtl:pr-4 inline-block " +
        "text-gray-500 " +
        "hover:text-gray-900 " +
        "dark:text-gray-400 " +
        "dark:hover:text-gray-300 " +
        "w-full break-words";

    }


    li.appendChild(link);


    return li;

  }


function buildReadmeTOC(
  component,
  content
) {

  /*
   * Remove previous TOC if this component
   * gets initialized again.
   */
  const oldWrapper =
    component.querySelector(
      ".github-readme-toc-wrapper"
    );

  if (oldWrapper) {
    oldWrapper.remove();
  }


  const headings =
    Array.from(
      content.querySelectorAll(
        "h2, h3"
      )
    );


  if (!headings.length) {
    return;
  }


  /*
   * Outer positioning wrapper.
   *
   * This sits outside the README body.
   */
  const wrapper =
    document.createElement("div");

  wrapper.className =
    "github-readme-toc-wrapper";


  /*
   * Inner sticky TOC.
   *
   * Classes intentionally match
   * Hugo Blox native TOC styling.
   */
  const toc =
    document.createElement("aside");

  toc.className =
    "github-readme-toc " +
    "hb-scrollbar text-sm " +
    "sticky top-16 " +
    "overflow-y-auto " +
    "pr-4 pt-6 " +
    "max-h-[calc(100vh-var(--navbar-height)-env(safe-area-inset-bottom))] " +
    "-mr-4 rtl:-ml-4";

  toc.setAttribute(
    "aria-label",
    "Table of contents"
  );


  const title =
    document.createElement("p");

  title.className =
    "mb-4 font-semibold tracking-tight";

  title.textContent =
    "On this page";


  const list =
    document.createElement("ul");


  headings.forEach(
    heading => {

      if (!heading.id) {
        return;
      }

      list.appendChild(
        createTOCLink(heading)
      );

    }
  );


  toc.appendChild(title);
  toc.appendChild(list);

  wrapper.appendChild(toc);

  component.appendChild(wrapper);
}

  /*
   * =========================================================
   * Marked renderer
   * =========================================================
   */

  function createRenderer(
    rawBase,
    githubBase
  ) {

    const renderer =
      new marked.Renderer();


    /*
     * Markdown images
     *
     * ![](figure.png)
     */
    renderer.image =
      function ({
        href,
        title,
        text
      }) {

        if (!href) {
          return "";
        }


        if (
          !href.startsWith(
            "http://"
          ) &&
          !href.startsWith(
            "https://"
          )
        ) {

          href =
            rawBase + href;

        }


        return `
          <img
            src="${href}"
            alt="${text || ""}"
            title="${title || ""}"
            class="github-readme-image"
          >
        `;

      };


    /*
     * Markdown links
     */
    renderer.link =
      function ({
        href,
        title,
        tokens
      }) {

        const text =
          this.parser.parseInline(
            tokens
          );


        if (!href) {

          return text;

        }


        /*
         * Internal section link:
         *
         * #phonon-dispersion
         */
        if (
          href.startsWith("#")
        ) {

          return `
            <a
              href="${href}"
              ${
                title
                  ? `title="${title}"`
                  : ""
              }
            >
              ${text}
            </a>
          `;

        }


        /*
         * Relative repository path.
         */
        if (
          !href.startsWith(
            "http://"
          ) &&
          !href.startsWith(
            "https://"
          )
        ) {

          href =
            githubBase + href;

        }


        return `
          <a
            href="${href}"
            ${
              title
                ? `title="${title}"`
                : ""
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            ${text}
          </a>
        `;

      };


    return renderer;

  }


  /*
   * =========================================================
   * Raw HTML image paths
   * =========================================================
   */

  function fixHTMLImagePaths(
    markdown,
    rawBase
  ) {

    return markdown.replace(
      /<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/g,
      (
        match,
        before,
        src,
        after
      ) => {

        if (
          !src.startsWith(
            "http://"
          ) &&
          !src.startsWith(
            "https://"
          ) &&
          !src.startsWith(
            "data:"
          )
        ) {

          src =
            rawBase + src;

        }


        return (
          `<img${before}` +
          `src="${src}"` +
          `${after}>`
        );

      }
    );

  }


  /*
   * =========================================================
   * Raw HTML link paths
   * =========================================================
   *
   * <a href="figure.png"> inside raw HTML blocks is not seen
   * by the Marked link renderer, so point it at GitHub here.
   */

  function fixHTMLLinkPaths(
    markdown,
    githubBase
  ) {

    return markdown.replace(
      /<a([^>]*?)href=["']([^"']+)["']([^>]*?)>/g,
      (match, before, href, after) => {

        if (
          /^(https?:|mailto:|#|\/)/.test(href)
        ) {
          return match;
        }

        return (
          `<a${before}` +
          `href="${githubBase + href}"` +
          ` target="_blank" rel="noopener noreferrer"` +
          `${after}>`
        );

      }
    );

  }


  /*
   * =========================================================
   * Hash navigation
   * =========================================================
   */

  function scrollToCurrentHash() {

    if (
      !window.location.hash
    ) {
      return;
    }


    const id =
      decodeURIComponent(
        window.location.hash.substring(
          1
        )
      );


    const target =
      document.getElementById(
        id
      );


    if (!target) {
      return;
    }


    target.scrollIntoView({
      behavior: "auto",
      block: "start"
    });

  }



  /*
   * =========================================================
   * Math: protect before Marked, restore after, render KaTeX
   * =========================================================
   *
   * Marked runs before KaTeX, so without this step it eats
   * math syntax: "_" and "*" become <em>/<strong>, "\\" and
   * "\{" lose their backslash, etc. We swap every formula for
   * an opaque placeholder, let Marked parse the Markdown, then
   * put the original TeX back and render it.
   *
   * Supported (same as GitHub, plus \( \) and \[ \]):
   *   $...$   $$...$$   $`...`$   ```math ... ```
   *   \(...\) \[...\]
   */

  const MATH_OPEN = "\uE000";
  const MATH_CLOSE = "\uE001";
  const MATH_TOKEN_RE = /\uE000(\d+)\uE001/g;

  const KATEX_CDN = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/";


  function protectMath(src) {

    const store = [];
    const n = src.length;
    let out = "";
    let i = 0;
    let atLineStart = true;

    function token(tex, display, original) {
      store.push({ tex, display, original });
      return MATH_OPEN + (store.length - 1) + MATH_CLOSE;
    }

    /* Find an unescaped closing delimiter, skipping "\x" pairs. */
    function findClose(from, delim, stopAtBlankLine, stopAtBacktick) {
      let j = from;
      while (j < n) {
        const c = src[j];
        if (stopAtBacktick && c === "`") {
          return -1;
        }
        if (c === "\\" && delim !== "\\]" && delim !== "\\)") {
          j += 2;
          continue;
        }
        if (stopAtBlankLine && c === "\n" && /^\n[ \t]*\n/.test(src.slice(j, j + 50))) {
          return -1;
        }
        if (src.startsWith(delim, j)) {
          return j;
        }
        j++;
      }
      return -1;
    }

    while (i < n) {

      const ch = src[i];

      /* Fenced code blocks (```math becomes display math). */
      if (atLineStart) {
        const m = /^( {0,3})(`{3,}|~{3,})([^\n]*)(\n|$)/.exec(src.slice(i));
        if (m) {
          const fence = m[2];
          const info = m[3].trim().toLowerCase();
          const bodyStart = i + m[0].length;
          const closeRe = new RegExp(
            "^ {0,3}" + (fence[0] === "`" ? "`" : "~") +
            "{" + fence.length + ",}[ \\t]*$", "m"
          );
          const cm = closeRe.exec(src.slice(bodyStart));
          const bodyEnd = cm ? bodyStart + cm.index : n;
          const blockEnd = cm ? bodyEnd + cm[0].length : n;

          if (info === "math") {
            out += "\n" + token(src.slice(bodyStart, bodyEnd), true, src.slice(i, blockEnd)) + "\n";
          } else {
            out += src.slice(i, blockEnd);
          }
          i = blockEnd;
          atLineStart = false;
          continue;
        }
      }

      /* GitHub inline form: $`...`$ */
      if (ch === "$" && src[i + 1] === "`") {
        const run = /^`+/.exec(src.slice(i + 1))[0];
        const close = src.indexOf(run, i + 1 + run.length);
        if (close !== -1 && src[close + run.length] === "$" && src[close + run.length] !== "`") {
          const end = close + run.length + 1;
          out += token(src.slice(i + 1 + run.length, close), false, src.slice(i, end));
          i = end;
          atLineStart = false;
          continue;
        }
      }

      /* Inline code spans: copy verbatim. */
      if (ch === "`") {
        const run = /^`+/.exec(src.slice(i))[0];
        let j = i + run.length;
        let close = -1;
        while ((j = src.indexOf(run, j)) !== -1) {
          if (src[j + run.length] !== "`" && src[j - 1] !== "`") {
            close = j;
            break;
          }
          j += run.length;
        }
        const end = close === -1 ? i + run.length : close + run.length;
        out += src.slice(i, end);
        i = end;
        atLineStart = false;
        continue;
      }

      /* Backslash: \[ \] and \( \) math, or a normal escape. */
      if (ch === "\\") {
        const next = src[i + 1];
        if (next === "[" || next === "(") {
          const delim = next === "[" ? "\\]" : "\\)";
          const close = findClose(i + 2, delim, next === "(");
          if (close !== -1 && close > i + 2) {
            const end = close + 2;
            out += token(src.slice(i + 2, close), next === "[", src.slice(i, end));
            i = end;
            atLineStart = false;
            continue;
          }
        }
        out += src.slice(i, i + 2);
        i += 2;
        atLineStart = false;
        continue;
      }

      /* $$ ... $$ display math. */
      if (ch === "$" && src[i + 1] === "$") {
        const close = findClose(i + 2, "$$", false);
        if (close !== -1) {
          const end = close + 2;
          out += token(src.slice(i + 2, close), true, src.slice(i, end));
          i = end;
          atLineStart = false;
          continue;
        }
      }

      /* $ ... $ inline math (GitHub-style rules). */
      if (ch === "$" && src[i + 1] && !/\s|\$/.test(src[i + 1])) {
        let j = i + 1;
        let close = -1;
        while ((j = findClose(j, "$", true, true)) !== -1) {
          if (!/\s/.test(src[j - 1]) && !/\d/.test(src[j + 1] || "")) {
            close = j;
            break;
          }
          j++;
        }
        if (close !== -1) {
          const end = close + 1;
          out += token(src.slice(i + 1, close), false, src.slice(i, end));
          i = end;
          atLineStart = false;
          continue;
        }
      }

      out += ch;
      atLineStart = ch === "\n";
      i++;

    }

    return { markdown: out, store };

  }


  function restoreMath(container, store) {

    /* Text nodes: placeholder -> <span class="readme-math"> */
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue.includes(MATH_OPEN)) {
        nodes.push(walker.currentNode);
      }
    }

    nodes.forEach(node => {
      const text = node.nodeValue;
      const insideCode = node.parentElement && node.parentElement.closest("pre, code");
      const frag = document.createDocumentFragment();
      let last = 0;
      let m;
      MATH_TOKEN_RE.lastIndex = 0;

      while ((m = MATH_TOKEN_RE.exec(text))) {
        frag.append(text.slice(last, m.index));
        const item = store[Number(m[1])];

        if (!item || insideCode) {
          frag.append(item ? item.original : m[0]);
        } else {
          const el = document.createElement("span");
          el.className = item.display ? "readme-math readme-math-display" : "readme-math";
          el.dataset.tex = item.tex;
          el.textContent = item.original;
          frag.append(el);
        }
        last = m.index + m[0].length;
      }

      frag.append(text.slice(last));
      node.replaceWith(frag);
    });

    /* Attributes (e.g. alt text): put the original source back. */
    container.querySelectorAll("*").forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.value.includes(MATH_OPEN)) {
          el.setAttribute(
            attr.name,
            attr.value.replace(MATH_TOKEN_RE, (all, k) => (store[Number(k)] || {}).original || all)
          );
        }
      });
    });

  }


  let katexPromise = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Failed to load " + src));
      document.head.appendChild(s);
    });
  }

  /* Use the theme's KaTeX if present, otherwise load it from a CDN. */
  function ensureKatex() {
    if (window.katex && typeof window.katex.render === "function") {
      return Promise.resolve(window.katex);
    }
    if (!katexPromise) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = KATEX_CDN + "katex.min.css";
      document.head.appendChild(css);
      katexPromise = loadScript(KATEX_CDN + "katex.min.js").then(() => window.katex);
    }
    return katexPromise;
  }


  async function renderMath(container) {

    const targets = container.querySelectorAll(".readme-math");
    if (!targets.length) {
      return;
    }

    let katex;
    try {
      katex = await ensureKatex();
    } catch (error) {
      console.error("github-readme: KaTeX unavailable", error);
      return;
    }

    targets.forEach(el => {
      try {
        katex.render(el.dataset.tex, el, {
          displayMode: el.classList.contains("readme-math-display"),
          throwOnError: false
        });
      } catch (error) {
        console.error("github-readme: math error", error);
      }
    });

  }


  /*
   * =========================================================
   * Fetch README
   * =========================================================
   */

  async function fetchReadme(
    url
  ) {

    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        `Failed to load README: ` +
        `${response.status} ` +
        `${response.statusText}`
      );

    }


    return response.text();

  }


  /*
   * =========================================================
   * Initialize one component
   * =========================================================
   */

  async function initComponent(
    component
  ) {

    /*
     * Avoid loading the same shortcode twice.
     */
    if (
      component.dataset
        .githubReadmeInitialized ===
      "true"
    ) {
      return;
    }


    component.dataset
      .githubReadmeInitialized =
      "true";


    const content =
      component.querySelector(
        ".github-readme-body"
      );


    if (!content) {

      console.error(
        "github-readme: " +
        "missing .github-readme-body"
      );

      return;

    }


    const repo =
      component.dataset.repo;


    const branch =
      component.dataset.branch ||
      "main";


    const basePath =
      component.dataset.path ||
      "";


    if (!repo) {

      content.innerHTML =
        "<p>Could not load the project README.</p>";


      console.error(
        "github-readme: " +
        "missing repository name"
      );

      return;

    }


    const urls =
      createRepoURLs(
        repo,
        branch,
        basePath
      );


    try {

      const originalMarkdown =
        await fetchReadme(
          urls.readme
        );


      const protectedMath =
        protectMath(
          originalMarkdown
        );


      const markdown =
        fixHTMLLinkPaths(
          fixHTMLImagePaths(
            protectedMath.markdown,
            urls.rawBase
          ),
          urls.githubBase
        );


      const renderer =
        createRenderer(
          urls.rawBase,
          urls.githubBase
        );


      content.innerHTML =
        marked.parse(
          markdown,
          {
            renderer,
            gfm: true
          }
        );

      restoreMath(
        content,
        protectedMath.store
      );

      addHeadingIds(content);

      await renderMath(content);

      buildReadmeTOC(
        component,
        content
      );

      requestAnimationFrame(
        scrollToCurrentHash
      );

    } catch (error) {

      content.innerHTML =
        "<p>Could not load the project README.</p>";


      console.error(
        "github-readme:",
        error
      );

    }

  }


  /*
   * =========================================================
   * Initialize all components
   * =========================================================
   */

  function initGithubReadmes() {

    document
      .querySelectorAll(
        COMPONENT_SELECTOR
      )
      .forEach(
        initComponent
      );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initGithubReadmes
    );

  } else {

    initGithubReadmes();

  }


  /*
   * Direct hash changes while already on page.
   */
  window.addEventListener(
    "hashchange",
    () => {

      requestAnimationFrame(
        scrollToCurrentHash
      );

    }
  );

})();