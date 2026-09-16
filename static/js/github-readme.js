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

    return text
      .toLowerCase()
      .trim()
      .replace(/[–—]/g, "-")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

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


    link.textContent =
      heading.textContent;


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


      const markdown =
        fixHTMLImagePaths(
          originalMarkdown,
          urls.rawBase
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

      addHeadingIds(content);

      renderDynamicMath(content);

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

function renderDynamicMath(container) {

  /*
   * KaTeX auto-render
   */
  if (
    typeof window.renderMathInElement === "function"
  ) {

    window.renderMathInElement(
      container,
      {
        delimiters: [
          {
            left: "$$",
            right: "$$",
            display: true
          },
          {
            left: "\\[",
            right: "\\]",
            display: true
          },
          {
            left: "$",
            right: "$",
            display: false
          },
          {
            left: "\\(",
            right: "\\)",
            display: false
          }
        ],

        throwOnError: false
      }
    );

    return;
  }


  /*
   * MathJax fallback
   */
  if (
    window.MathJax &&
    typeof window.MathJax.typesetPromise ===
      "function"
  ) {

    window.MathJax
      .typesetPromise([container])
      .catch(error => {
        console.error(
          "Math rendering failed:",
          error
        );
      });

  }

}