---
title: 1. Graphene SCF Calculation
date: 2026-09-01
weight: 50
commentable: true
sidebar:
  open: true
---

In this example, we perform a self-consistent field (SCF) calculation for graphene using QE.

The SCF calculation determines the ground-state electron density and provides the starting point for later calculations such as band structures and density of states.

{{% steps %}}

### Prepare the graphene structure

Define a two-atom graphene unit cell with sufficient vacuum along the \(z\)-direction.

### Prepare the SCF input

Set the plane-wave cutoffs, k-point mesh, pseudopotential, and electronic convergence parameters.

### Run the calculation

Execute `pw.x` locally or submit the calculation to an HPC cluster.

### Check convergence

Inspect the output file and confirm that the SCF cycle has converged successfully.

{{% /steps %}}

---

## 1. Graphene Structure

Graphene is a two-dimensional material consisting of carbon atoms arranged in a honeycomb lattice.

Because QE uses periodic boundary conditions in all three directions, vacuum is added along the \(z\)-direction to separate periodically repeated graphene layers.

In this example, the graphene unit cell contains two carbon atoms and a cell length of 20 Å along the \(z\)-direction.

{{% callout note %}}

For two-dimensional materials, the vacuum region should be large enough to reduce artificial interactions between periodically repeated layers.

{{% /callout %}}

---

## 2. SCF Input File

Before running the calculation, prepare the pseudopotential used in the input file.

### Pseudopotential

For this tutorial, pseudopotentials can be obtained from [PseudoDojo ↗](https://www.pseudo-dojo.org/).

Download a pseudopotential appropriate for the exchange-correlation functional and calculation setup you intend to use, then place the file in the directory specified by `pseudo_dir`.

In this example:

```text
pseudo_dir = 'pseudo/'
```

so the pseudopotential file should be placed inside the `pseudo/` directory.

{{% callout note %}}

The pseudopotential, `ecutwfc`, and `ecutrho` should be treated as a consistent set. When changing the pseudopotential, check the recommended cutoff values and perform convergence tests for the quantities relevant to your calculation.

{{% /callout %}}

### Input File

The input file used in this example is available in my GitHub repository:

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

{{% callout note %}}

The pseudopotential filename shown in `ATOMIC_SPECIES` must match the actual file stored in `pseudo_dir`.

{{% /callout %}}

---

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

- `prefix` defines the common name used for files generated during the calculation.
- `outdir` specifies where temporary calculation data are stored.
- `pseudo_dir` points to the directory containing the pseudopotential files.

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

### Smearing

```text
occupations = 'smearing'
smearing = 'mv'
degauss = 0.01
```

This calculation uses Marzari-Vanderbilt smearing with a smearing width of 0.01 Ry.

{{< spoiler text="Why use smearing for graphene?" >}}

Graphene is a zero-gap semimetal: the valence and conduction bands meet at the Dirac point.

A small amount of smearing can make Brillouin-zone integration and SCF convergence more stable when electronic states lie very close to the Fermi level.

The smearing width should still be chosen carefully because an unnecessarily large value can broaden electronic features and affect calculated quantities.

{{< /spoiler >}}

### Electronic Convergence

```text
conv_thr = 4.000d-10
electron_maxstep = 80
mixing_beta = 0.4
```

- `conv_thr` controls the convergence threshold of the electronic SCF cycle.
- `electron_maxstep` sets the maximum number of SCF iterations.
- `mixing_beta` controls how strongly the charge density is mixed between iterations.

---

## 4. Atomic Structure and Vacuum

The atomic coordinates are defined as:

```text
ATOMIC_POSITIONS angstrom
C 0.0000000000 1.4202816622 0.0000000000
C 1.2300000000 0.7101408311 0.0000000000
```

The lattice vectors are specified explicitly:

```text
CELL_PARAMETERS angstrom
2.4600000000 0.0000000000 0.0000000000
-1.2300000000 2.1304224933 0.0000000000
0.0000000000 0.0000000000 20.0000000000
```

The third lattice vector gives a 20 Å cell length along the \(z\)-direction.

Since graphene lies in the \(xy\)-plane, most of this length acts as vacuum separating periodic images.

---

## 5. K-point Sampling

```text
K_POINTS automatic
12 12 1 0 0 0
```

A \(12 \times 12 \times 1\) k-point mesh is used.

The dense sampling is applied in the two periodic in-plane directions, while only one k-point is used along the vacuum direction.

{{% callout note %}}

The k-point mesh should also be tested for convergence.

For graphene and other two-dimensional materials, the important sampling is primarily in the in-plane directions.

{{% /callout %}}

---

## 6. Run the Calculation

### Local execution

For a simple local run, QE can be executed directly from the terminal.

**Serial execution**

```bash
pw.x -in 1scf.in > 1scf.out
```

**Parallel execution using MPI**

```bash
mpirun -np 16 pw.x -in 1scf.in > 1scf.out
```

Here, `-np 16` launches 16 MPI processes.

### HPC job submission

On an HPC cluster, calculations are usually submitted to a **job scheduler** rather than run directly in the login shell.

For example, on a SLURM-based cluster, I submit my QE calculation with:

```bash
sbatch qe_job_submit.sh
```

The scheduler places the job in a queue and starts it when the requested computational resources become available.

[View my `qe_job_submit.sh` on GitHub ↗](https://github.com/suecreamm/materials/blob/main/scripts/qe/qe_job_submit.sh)

{{% callout note %}}

The exact execution command depends on the cluster configuration.

Some systems use `mpirun`, while others may use `srun` or another MPI launcher. Resource requests and module settings should follow the documentation of the HPC system you are using.

{{% /callout %}}

For a more detailed walkthrough of building QE and submitting jobs on a cluster:

{{< cards >}}

{{< card url="../../env/qe-install" title="Building Quantum ESPRESSO and Submitting Jobs" icon="custom/solid-download" subtitle="QE installation, HPC setup, and SLURM job submission." >}}

{{< /cards >}}

---

## 7. Check the Output

After the calculation finishes, inspect the output file:

```bash
tail -50 1scf.out
```

A converged SCF calculation should contain:

```text
convergence has been achieved
```

The final total energy can be found using:

```bash
grep "!" 1scf.out
```

Quantum ESPRESSO marks the final total energy with an exclamation mark (`!`).

{{< spoiler text="What should I check if the SCF calculation does not converge?" >}}

If the calculation does not converge, useful parameters to inspect include:

- `conv_thr`
- `mixing_beta`
- `electron_maxstep`
- the k-point mesh
- the smearing settings
- the pseudopotential and cutoff energies

The output file usually contains the most useful clues for identifying where the calculation failed.

{{< /spoiler >}}

---

## 8. What Comes Next?

The converged ground-state electron density can be reused in subsequent electronic-structure calculations.

In the next examples, we will use this graphene calculation to obtain:

- the electronic band structure,
- the density of states,
- and phonon properties.

## Next

{{< cards >}}

{{< card url="../graphene-bands" title="Graphene Band Structure" icon="custom/solid-signal" subtitle="Calculate the electronic bands along a high-symmetry path." >}}

{{< /cards >}}
