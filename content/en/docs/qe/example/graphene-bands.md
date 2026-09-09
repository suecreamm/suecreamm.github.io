---
title: Graphene Band Structure Calculation
date: 2026-09-02
weight: 60
sidebar:
  open: true
---

This tutorial continues from the graphene SCF calculation and calculates the electronic band structure along the high-symmetry path \(\Gamma \rightarrow M \rightarrow K \rightarrow \Gamma\).

The important point is that the band calculation reuses the converged ground-state data from the previous SCF calculation.

{{% steps %}}

### Create a working directory

Make a separate directory for the band-structure calculation and copy the SCF input using a relative path.

### Prepare the band input

Reuse the SCF setup, change the calculation type to `bands`, and define a high-symmetry k-point path.

### Run `pw.x`

Calculate the Kohn-Sham eigenvalues along the selected path.

### Post-process with `bands.x`

Collect the calculated eigenvalues into a convenient band-data file for plotting.

{{% /steps %}}

---

## 1. Create a Band-Calculation Directory

Start from the directory where the previous SCF calculation was prepared.

Create a separate directory for the band calculation:

```bash
mkdir 99band
cd 99band
```

Copy the previous SCF input into the new directory using a relative path:

```bash
cp ../1scf.in ./2bands.in
```

Here, `..` means the parent directory and `.` means the current directory.

The copied file will be used as the starting point for the band input, so the lattice, atomic positions, pseudopotential, cutoffs, and other basic settings remain consistent with the SCF calculation.

{{% callout note %}}

The band calculation must use the same `prefix` and the same SCF data stored in `outdir`.

Because `99band/` is a subdirectory, the relative paths to the SCF output and pseudopotential directories need to be adjusted.

For example:

```text
outdir = '../out/'
pseudo_dir = '../pseudo/'
```

{{% /callout %}}

For the SCF setup used in this tutorial:

{{< cards >}}

{{< card url="../graphene-scf" title="Graphene SCF Calculation" icon="custom/solid-calculator" subtitle="Ground-state calculation used as the starting point for the band structure." >}}

{{< /cards >}}

The original SCF input is also available on GitHub:

[View `1scf.in` on GitHub ↗](https://github.com/suecreamm/materials/blob/main/01graphene/qe/1scf.in)

---

## 2. Prepare the Band Input

Open the copied file:

```bash
vi 2bands.in
```

The main changes from the SCF calculation are:

- change `calculation = 'scf'` to `calculation = 'bands'`
- point `outdir` and `pseudo_dir` to the directories in the parent folder
- optionally specify `nbnd`
- replace the automatic k-point mesh with a high-symmetry path

A band input based on the previous graphene SCF calculation can be written as:

```text
&CONTROL
calculation = 'bands'
etot_conv_thr = 2.0000d-05
forc_conv_thr = 1.0000d-04
outdir = '../out/'
prefix = 'graphene'
pseudo_dir = '../pseudo/'
tprnfor = .true.
tstress = .true.
verbosity = 'high'
/

&SYSTEM
degauss = 0.01
ecutrho = 200
ecutwfc = 40
ibrav = 0
nat = 2
nbnd = 8
nosym = .false.
ntyp = 1
occupations = 'smearing'
smearing = 'mv'
/

&ELECTRONS
conv_thr = 4.000d-10
electron_maxstep = 80
mixing_beta = 0.4
/

ATOMIC_SPECIES
C 12.011 C.upf

ATOMIC_POSITIONS angstrom
C 0.0000000000 1.4202816622 0.0000000000
C 1.2300000000 0.7101408311 0.0000000000

K_POINTS crystal_b
4
0.000000000 0.000000000 0.000000000 30
0.500000000 0.000000000 0.000000000 30
0.333333333 0.333333333 0.000000000 30
0.000000000 0.000000000 0.000000000 0

CELL_PARAMETERS angstrom
2.4600000000 0.0000000000 0.0000000000
-1.2300000000 2.1304224933 0.0000000000
0.0000000000 0.0000000000 20.0000000000
```

{{% callout note %}}

`nbnd = 8` is an example value chosen to include several conduction bands above the occupied states.

The number of bands should be adjusted depending on the energy range you want to visualize.

{{% /callout %}}

---

## 3. Define the High-Symmetry Path

For graphene, a commonly used path through the two-dimensional Brillouin zone is:

\[
\Gamma \rightarrow M \rightarrow K \rightarrow \Gamma
\]

In the input above, this is specified using:

```text
K_POINTS crystal_b
4
0.000000000 0.000000000 0.000000000 30
0.500000000 0.000000000 0.000000000 30
0.333333333 0.333333333 0.000000000 30
0.000000000 0.000000000 0.000000000 0
```

The fourth number on each line controls the number of points generated between that high-symmetry point and the next one.

{{< spoiler text="Why not use K_POINTS automatic for a band structure?" >}}

An SCF calculation samples the Brillouin zone with a mesh in order to obtain a converged ground-state electron density.

A band-structure calculation has a different purpose: it evaluates the eigenvalues along a selected path through reciprocal space.

Therefore, instead of an automatic mesh, we explicitly specify a sequence of high-symmetry points.

{{< /spoiler >}}

---

## 4. Run the Band Calculation

### Local execution

```bash
pw.x -in 2bands.in > 2bands.out
```

For an MPI calculation:

```bash
mpirun -np 16 pw.x -in 2bands.in > 2bands.out
```

### HPC job submission

On a SLURM-based cluster, the calculation can be submitted through the same job-submission workflow used for the SCF calculation.

```bash
sbatch qe_job_submit.sh
```

If the job script contains a fixed input filename, change it from `1scf.in` to `2bands.in` before submission.

[View my `qe_job_submit.sh` on GitHub ↗](https://github.com/suecreamm/materials/blob/main/scripts/qe/qe_job_submit.sh)

{{% callout note %}}

The band calculation should read the converged SCF data associated with the same `prefix` and `outdir`.

If QE cannot find the previous calculation, check the relative `outdir` path first.

{{% /callout %}}

---

## 5. Check the Band Output

After the calculation finishes, inspect the end of the output file:

```bash
tail -50 2bands.out
```

You can also check that the job finished normally:

```bash
grep "JOB DONE" 2bands.out
```

At this stage, `pw.x` has calculated the eigenvalues along the selected k-point path.

The next step is to collect the band data using `bands.x`.

---

## 6. Post-process with `bands.x`

Create an input file named `3bandsx.in`:

```text
&BANDS
prefix = 'graphene'
outdir = '../out/'
filband = 'graphene.bands'
/
```

Run:

```bash
bands.x -in 3bandsx.in > 3bandsx.out
```

This creates:

```text
graphene.bands
```

which contains the band energies in a form that can be used for plotting.

{{% callout note %}}

`bands.x` does not perform a new electronic-structure calculation.

It post-processes the eigenvalues already calculated by `pw.x` during the `bands` calculation.

{{% /callout %}}

---

## 7. Workflow Summary

The complete workflow is:

```text
SCF
 ↓
Converged ground-state density
 ↓
BANDS calculation along Γ-M-K-Γ
 ↓
bands.x
 ↓
Band data
 ↓
Plot
```

The characteristic feature to look for in graphene is the crossing of the valence and conduction bands at the \(K\) point, forming the Dirac cone.

{{< spoiler text="Why is the K point important in graphene?" >}}

In ideal graphene, the valence and conduction bands meet at the \(K\) and \(K'\) points of the Brillouin zone.

Near these points, the electronic bands are approximately linear in energy versus momentum, which gives rise to the well-known Dirac-cone dispersion.

{{< /spoiler >}}

---

## Next

{{< cards >}}

{{< card url="../graphene-dos" title="Graphene Density of States" icon="custom/solid-table-cells-large" subtitle="Calculate the electronic density of states using an NSCF calculation and dos.x." >}}

{{< /cards >}}
