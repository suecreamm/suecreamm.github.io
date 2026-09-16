---
title: "Home"
date: 2023-10-24
type: landing

sections:
  - block: markdown
    content:
      title: Recent Work
      text: ""
    design:
      spacing:
        padding: ["2rem", "1.25rem", "0", "1.25rem"]

  - block: collection
    id: recent-work
    content:
      title: ""
      text: ""
      count: 3
      sort_by: Lastmod
      order: desc
      filters:
        folders:
          - work
        exclude_future: true
      archive:
        enable: false
    design:
      view: date-title-summary
      columns: "1"
      spacing:
        padding: ["0", "1.25rem", "4rem", "1.25rem"]

  - block: markdown
    content:
      title: Recent Updates
      text: ""
    design:
      spacing:
        padding: ["0", "1.25rem", "0", "1.25rem"]

  - block: collection
    id: recent-updates
    content:
      title: ""
      text: ""
      count: 6
      sort_by: Lastmod
      order: desc
      filters:
        folders:
          - blog
          - docs
        exclude_future: true
      archive:
        enable: false
    design:
      view: date-title-summary
      columns: "1"
      spacing:
        padding: ["0", "1.25rem", "4rem", "1.25rem"]
---