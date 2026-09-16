---
title: Online CNT Generator
summary: Web-based carbon nanotube structure generator for creating zigzag and armchair CNTs.
date: 2023-02-17
---

[Open CNT Generator ↗](https://suecreamm.github.io/cnt_generator/)

[View Source Code on GitHub ↗](https://github.com/suecreamm/cnt_generator)

<div id="github-readme">
Loading project documentation...
</div>

<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<script>
const repo = "suecreamm/cnt_generator";
const branch = "main";

const rawBase =
  `https://raw.githubusercontent.com/${repo}/${branch}/`;

const githubBase =
  `https://github.com/${repo}/blob/${branch}/`;

fetch(`${rawBase}README.md`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to load README: ${response.status}`);
    }
    return response.text();
  })
  .then(markdown => {

    // Fix relative Markdown image paths
    markdown = markdown.replace(
      /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
      (match, alt, src) =>
        `![${alt}](${rawBase}${src})`
    );

    // Fix relative HTML <img> paths
    markdown = markdown.replace(
      /(<img[^>]+src=["'])(?!https?:\/\/)([^"']+)(["'][^>]*>)/g,
      `$1${rawBase}$2$3`
    );

    // Fix relative Markdown links
    markdown = markdown.replace(
      /\[([^\]]+)\]\((?!https?:\/\/|#)([^)]+)\)/g,
      (match, text, href) =>
        `[${text}](${githubBase}${href})`
    );

    document.getElementById("github-readme").innerHTML =
      marked.parse(markdown);
  })
  .catch(error => {
    document.getElementById("github-readme").innerHTML =
      `<p>Could not load the project README.</p>`;

    console.error(error);
  });
</script>