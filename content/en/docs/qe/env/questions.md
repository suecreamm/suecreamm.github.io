---
title: Common Questions for Beginners
date: 2026-09-09
weight: 10
commentable: true
sidebar:
    open: true
---

## How can I run `pw.x` without typing the full path (`/home/.../pw.x`)?

At first, you may need to run Quantum ESPRESSO using the full path:

```bash
mpirun -np 16 /home/hwang/q-e-qe-7.4.1/bin/pw.x -in ausurf.in > ausurf.out
```

You can set it up so that only `pw.x` is needed:

```bash
mpirun -np 16 pw.x -in 1scf.in > 1scf.out
```

### Setup

Run the following commands once:

```bash
echo 'export PATH="/home/hwang/q-e-qe-7.4.1/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

- The first command, echo ... >> ~/.bashrc, adds the Quantum ESPRESSO bin path to your ~/.bashrc file.
- The second command, source ~/.bashrc, reloads .bashrc and applies the setting immediately to the current terminal.


Then check that `pw.x` can be found:

```bash
which pw.x
```

It should return something like:

```text
/home/hwang/q-e-qe-7.4.1/bin/pw.x
```

### What is this setting called?

This is called **adding a directory to the `PATH` environment variable**. `PATH` tells Linux where to look for executable programs.

Because the setting is saved in `~/.bashrc`, it is automatically applied to future Bash sessions.

> **Note:** If you run only
>
> ```bash
> export PATH="/home/hwang/q-e-qe-7.4.1/bin:$PATH"
> ```
>
> in the terminal without adding it to `~/.bashrc`, it applies only to the current shell session.
