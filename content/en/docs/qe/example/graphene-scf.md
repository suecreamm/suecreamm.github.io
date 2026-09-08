---
title: 1. Graphene SCF Calculation
date: 2026-09-01
weight: 50
sidebar:
  open: true
---

In this example, we perform a self-consistent field (SCF) calculation for graphene using Quantum ESPRESSO.

The SCF calculation determines the ground-state electron density and provides the starting point for later calculations such as band structures and density of states.

## 1. Graphene Structure

Graphene is a two-dimensional material consisting of carbon atoms arranged in a honeycomb lattice.

Because Quantum ESPRESSO uses periodic boundary conditions in all three directions, vacuum is added along the \(z\)-direction to separate periodically repeated graphene layers.

In this example, the graphene unit cell contains two carbon atoms and a vacuum region of 20 Å along the \(z\)-direction.

## 2. SCF Input File

The input file used in this example is:

[View `1scf.in` on GitHub ↗](https://github.com/suecreamm/materials/blob/main/01graphene/qe/1scf.in)

```text
&CONTROL
calculation = 'scf'
etot_conv_thr = 2.0000d-05
forc_conv_thr = 1.0000d-04
outdir = './out/'
prefix = 'graphene'
pseudo_dir = 'pseudo/'
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

K_POINTS automatic
12 12 1 0 0 0

CELL_PARAMETERS angstrom
2.4600000000 0.0000000000 0.0000000000
-1.2300000000 2.1304224933 0.0000000000
0.0000000000 0.0000000000 20.0000000000
```

## 3. Understanding the Input

### CONTROL

```text
calculation = 'scf'
```

specifies a self-consistent field calculation.

```text
prefix = 'graphene'
outdir = './out/'
pseudo_dir = 'pseudo/'
```

`prefix` defines the common name used for generated files, while `outdir` specifies where temporary calculation data are stored. `pseudo_dir` points to the directory containing the pseudopotential files.

```text
tprnfor = .true.
tstress = .true.
```

These options request the calculation of atomic forces and the stress tensor.

### SYSTEM

```text
ibrav = 0
```

means that the lattice vectors are defined explicitly using `CELL_PARAMETERS`.

This is useful when the simulation cell is specified directly rather than through one of Quantum ESPRESSO's predefined Bravais lattices.

```text
nat = 2
ntyp = 1
```

The unit cell contains two atoms and one atomic species.

```text
ecutwfc = 40
ecutrho = 200
```

These parameters define the kinetic-energy cutoffs for the wavefunctions and charge density.

The appropriate cutoff values depend on the pseudopotential and should normally be checked through convergence tests.

### Smearing

```text
occupations = 'smearing'
smearing = 'mv'
degauss = 0.01
```

This calculation uses Marzari-Vanderbilt smearing with a smearing width of 0.01 Ry.

Smearing can help stabilize Brillouin-zone integration, especially for systems with electronic states close to the Fermi level.

### Electronic Convergence

```text
conv_thr = 4.000d-10
electron_maxstep = 80
mixing_beta = 0.4
```

`conv_thr` controls the convergence threshold for the electronic self-consistency cycle.

`electron_maxstep` sets the maximum number of SCF iterations, while `mixing_beta` controls how strongly the charge density is mixed between iterations.

## 4. Atomic Structure and Vacuum

The two carbon atoms are given in Cartesian coordinates:

```text
ATOMIC_POSITIONS angstrom
C 0.0000000000 1.4202816622 0.0000000000
C 1.2300000000 0.7101408311 0.0000000000
```

The lattice vectors are:

```text
CELL_PARAMETERS angstrom
2.4600000000 0.0000000000 0.0000000000
-1.2300000000 2.1304224933 0.0000000000
0.0000000000 0.0000000000 20.0000000000
```

The third lattice vector provides 20 Å of cell length along the \(z\)-direction.

Since graphene itself lies in the \(xy\)-plane, this creates vacuum between periodically repeated graphene sheets.

## 5. K-point Sampling

```text
K_POINTS automatic
12 12 1 0 0 0
```

A \(12 \times 12 \times 1\) k-point mesh is used.

The dense sampling is applied in the two periodic in-plane directions, while only one k-point is used along the vacuum direction.

## 6. Run the Calculation

The SCF calculation can be run using:

```bash
pw.x -in 1scf.in > 1scf.out             # serial run
```
```bash
mpirun -np 16 pw.x -in 1scf.in > 1scf.out # MPI run with 16 processes
```

On an HPC cluster, calculations are usually submitted to a **job scheduler** rather than run directly in the terminal.

A job script specifies the computational resources and the command used to run Quantum ESPRESSO. On a SLURM-based cluster, I submit the calculation with:


For example:
```bash
sbatch qe_job_submit.sh
```

The scheduler then places the job in a queue and starts it when the requested resources become available.

You can see the job script I use here:

[View my `qe_job_submit.sh` on GitHub ↗](https://github.com/suecreamm/materials/blob/main/scripts/qe/qe_job_submit.sh)


## 7. Check the Output

After the calculation finishes, inspect the output:

```bash
tail -50 1scf.out
```

A converged SCF calculation should contain:

```text
convergence has been achieved
```

The final total energy can usually be found using:

```bash
grep "!" 1scf.out
```

Quantum ESPRESSO marks the final total energy with an exclamation mark (`!`).

## 8. What Comes Next?

The converged charge density from this calculation can be reused in subsequent electronic-structure calculations.

In the next examples, we will use the graphene ground state to calculate:

- the electronic band structure,
- the density of states,
- and phonon properties.

## Next

{{< cards >}}

{{< card url="../graphene-bands" title="Graphene Band Structure" icon="custom/solid-signal" subtitle="Calculate the electronic bands along a high-symmetry path." >}}

{{< /cards >}}
