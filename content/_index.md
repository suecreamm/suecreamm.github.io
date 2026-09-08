---
title: 'Home'
date: 2023-10-24
type: landing

design:
  spacing: "4rem"

sections:
  - block: hero
    content:
      title: Research, Code, and Technical Notes
      text: A personal collection of scientific computing projects, technical documentation, and notes from my work and study. 🎉
      primary_action:
        text: View Portfolio
        url: /portfolio/
        icon: rocket-launch
      secondary_action:
        text: Browse Documentation
        url: /docs/

    design:
      spacing:
        padding: [0, 0, 0, 0]
        margin: [0, 0, 0, 0]
      # For full-screen, add `min-h-screen` below
      css_class: ""
      background:
        color: ""
        image:
          # Add your image background to `assets/media/`.
          filename: ""
          filters:
            brightness: 0.5
  
  - block: features
    id: explore
    content:
      title: Explore
      text: Browse my projects, technical documentation, notes, and background.
      items:
        - name: Portfolio
          icon: star
          description: Selected scientific computing, software, and technical projects
        - name: Documentation
          icon: document-text
          description: Practical workflows, technical guides, and references
        - name: Blog
          icon: bolt
          description: Physics, computing, and notes from things I learn
        - name: About
          icon: rectangle-group
          description: Research interests, background, skills, and contact information
  
---
