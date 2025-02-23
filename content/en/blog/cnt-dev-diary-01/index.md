---
title: "Spicing Up Research with Code 1: Carbon Nanotube Structure Generator Dev Diary (1)"
date: 2023-12-27
categories:
 - Programming
tags:
 - Programming
 - Materials
 - Physics
 - Web
series:
 - Spicing-Up-Research-with-Code
enableToc: true
enableTocContent: true
summary: A web-based program that generates VASP POSCAR files for CNT structures. It automates complex calculations and creates structures with simple inputs - no installation required.
---

![program_thumb](/uploads/post/CNTnew_16_9.gif "program_thumb")

Hey there! I've created a program that generates NxM CNT (Carbon Nanotube) structures in VASP format. Simply save the text file with a .VASP extension, and you can visualize your carbon nanotube using VESTA.

![honey](/uploads/post/honey.png "honey")

Think of a CNT as a sheet of graphene (carbon atoms arranged in hexagons) rolled into a cylinder - kind of like that cylindrical honeycomb structure above. I made sure to include vacuum space around the tube for VASP calculations.

## Why I Built It

I tried several existing tools but ran into these frustrations:
- Manual calculations were a real headache → So I automated them
- Why install software when you just need a structure file? → Made it web-based
- The manuals were so complicated - like reading research papers! → Simplified the inputs
- Too many terminal commands and setup steps → Created a simple web interface

## Cool Features

### No Installation, Works Everywhere
Since it's a web-based JS program, you don't need to install anything. Works on any operating system!

### Super Easy to Use
![CNTG_web_Capture](/uploads/post/CNTwebCapture.jpg "CNTG_web_Capture")

Just two main inputs! Choose how many carbon hexagons make up your tube (N) and click - that's it! Want to tweak the C-C bond length? Check that box and change 1.42 to whatever you need. You can even swap carbon for B or N to make BN tubes (though I wonder if anyone will actually use that feature 😄).

## How to Use It

Visit: https://suecreamm.github.io/cnt_generator/

Pick either Armchair or Zigzag structure, set how many hexagons you want around the circumference (N), and click. You'll get a VASP-formatted atomic structure file.

For N values between 5-8, I've already created the files - grab them [here](https://github.com/suecreamm/materials/tree/main/02CNT). For other N values, create a text file in Notepad (Windows) or terminal (Mac, Linux), paste the output, and save with .vasp extension. Drop it into [VESTA](https://jp-minerals.org/vesta/en/download.html) to see your 3D nanotube!

## Development Story

I use a Mac, and it's frustrating when some programs don't work on it or break when switching operating systems. That's why I learned JavaScript to make this web-based tool. Sure, there might be better programs out there, but I felt that installing Python and using terminal commands created unnecessary barriers. If you just need a structure file, why bother with all that setup?

It took about a week to develop.

## References & Resources
- Atomic structures: Based on standard definitions
- Calculations: Manually worked out for cylindrical coordinates
- Frontend design: https://html5up.net/solid-state
- Frontend implementation: Mostly improvised as I went along 😅
