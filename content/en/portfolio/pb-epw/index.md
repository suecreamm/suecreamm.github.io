---
title: Electron–Phonon Coupling with EPW
summary: First-principles electron–phonon calculations using Quantum ESPRESSO and EPW, including phonon dispersion, Eliashberg spectral functions, electron self-energy, linewidths, and carrier lifetimes.
date: 2026-09-08
---

<div id="github-readme">
Loading project documentation...
</div>

<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<script>
const repo = "suecreamm/materials";
const branch = "main";
const basePath = "04Pb/calc";
const readmePath = `${basePath}/README.md`;

const rawBase =
  `https://raw.githubusercontent.com/${repo}/${branch}/${basePath}/`;

const githubBase =
  `https://github.com/${repo}/blob/${branch}/${basePath}/`;

fetch(
  `https://raw.githubusercontent.com/${repo}/${branch}/${readmePath}`
)
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to load README");
    }
    return response.text();
  })
  .then(markdown => {

    // Fix relative paths in HTML <img> tags
    markdown = markdown.replace(
      /<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/g,
      (match, before, src, after) => {

        if (
          !src.startsWith("http://") &&
          !src.startsWith("https://")
        ) {
          src = rawBase + src;
        }

        return `<img${before}src="${src}"${after}>`;
      }
    );

    const renderer = new marked.Renderer();

    // Fix Markdown image paths: ![](image.png)
    renderer.image = function({ href, title, text }) {

      if (
        !href.startsWith("http://") &&
        !href.startsWith("https://")
      ) {
        href = rawBase + href;
      }

      return `
        <img
          src="${href}"
          alt="${text || ""}"
          title="${title || ""}"
          style="
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1.5rem auto;
          "
        >
      `;
    };

    // Fix relative links to files/directories in the GitHub repo
    renderer.link = function({ href, title, tokens }) {

      const text = this.parser.parseInline(tokens);

      if (
        !href.startsWith("http://") &&
        !href.startsWith("https://") &&
        !href.startsWith("#")
      ) {
        href = githubBase + href;
      }

      return `
        <a
          href="${href}"
          ${title ? `title="${title}"` : ""}
          target="_blank"
          rel="noopener noreferrer"
        >
          ${text}
        </a>
      `;
    };

    document.getElementById("github-readme").innerHTML =
      marked.parse(markdown, {
        renderer,
        gfm: true
      });
  })
  .catch(error => {
    document.getElementById("github-readme").innerHTML =
      "<p>Could not load the project README.</p>";

    console.error(error);
  });
</script>
