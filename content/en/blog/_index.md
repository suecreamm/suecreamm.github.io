---
title: Blog
url: /blog/
type: landing

sections:
  - block: markdown
    content:
      title: Blog
      text: ""
    design:
      spacing:
        padding: ["3rem", "1.25rem", "0", "1.25rem"]

  - block: collection
    id: blog-list
    content:
      title: ""
      text: ""
      count: 0
      sort_by: Date
      order: desc
      filters:
        folders:
          - blog
        exclude_future: true
      archive:
        enable: false
    design:
      view: date-title-summary
      columns: "1"
      spacing:
        padding: ["0", "1.25rem", "6rem", "1.25rem"]
---
