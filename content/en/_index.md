---
title: "Home"
date: 2023-10-24
type: landing

design:
  spacing: "4rem"

sections:
  - block: collection
    id: recent
    content:
      title: Recent Updates
      text: ""
      count: 6
      sort_by: Lastmod
      order: desc
      filters:
        folders:
          - blog
          - docs
          - works
        exclude_future: true
      archive:
        enable: false
    design:
      view: date-title-summary
      columns: "1"
      spacing:
        padding: ["0.25rem", 0, "4rem", 0]

---