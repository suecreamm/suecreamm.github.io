---
title: Work
type: landing

sections:
  - block: markdown
    content:
      title: Selected Works
      text: |
        Selected computational projects, scientific software,
        and technical work.
    design:
      spacing:
        padding: ["3rem", "1.25rem", "0", "1.25rem"]

  - block: collection
    id: work-list
    content:
      title: ""
      text: ""
      count: 0
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
        padding: ["0", "1.25rem", "6rem", "1.25rem"]
---
