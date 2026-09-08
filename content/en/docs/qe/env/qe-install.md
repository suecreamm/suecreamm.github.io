---

title: Building Quantum ESPRESSO and Submitting Jobs
date: 2025-04-11
weight: 40
commentable: true
sidebar:
open: true
----------

Below is a brief overview of the basic steps required to install Quantum ESPRESSO (QE) and run calculations on a computing cluster.

{{% steps %}}

### Download the source code

Download the desired version of the QE source code from the official Quantum ESPRESSO website ([quantum-espresso.org](https://www.quantum-espresso.org)) or its GitHub repository. You can also download it directly using commands such as `wget` or `git`.

### Build QE

Move to the downloaded source directory and run the following commands to configure and compile QE. Depending on your system, you may need to specify compilers, library paths, or optimization options during the `./configure` step.

```bash
./configure
make all
```

### Submit a calculation to a cluster

First prepare a QE input file (`.in`), then submit the calculation through the job scheduler used by your cluster, such as SLURM or PBS.

For example, on a SLURM system, a job can be submitted using:

```bash
sbatch job_script.sh
```

The job script typically contains an MPI command such as:

```bash
mpirun -np 16 pw.x -in input.in > output.out
```

{{% /steps %}}

---

### 1. Downloading and Building Quantum ESPRESSO

First, download the latest or desired version of QE from the official [Quantum ESPRESSO website](https://www.quantum-espresso.org) or its GitHub repository.

In this tutorial, I assume that all work starts from the `/home/hwang/` directory.

On Linux systems, a **home directory** is the personal working directory assigned to each user. It usually follows the form `/home/username`. Since the username used in this example is `hwang`, `/home/hwang/` will be used as the home directory throughout this tutorial.

#### 1.1 Check the current directory (`pwd`)

After logging into a cluster, you will usually start in your home directory. For this tutorial, I will assume that the directory is initially empty.

You can check your current location using:

```bash
pwd
```

Since this tutorial is also intended for users who are relatively new to Linux:

* `pwd` (**print working directory**) displays the full path of your current directory.

Expected output:

```text
/home/hwang
```

#### 1.2 Download the source code (`wget` or `git`)

If your current directory is `/home/hwang`, you can download QE using either `wget` or `git`.

This tutorial uses the QE 7.4.1 source archive downloaded with `wget`:

```bash
wget https://gitlab.com/QEF/q-e/-/archive/qe-7.4.1/q-e-qe-7.4.1.tar.gz
ls
```

Expected output:

```text
q-e-qe-7.4.1.tar.gz
```

Alternatively, you can clone the GitHub repository:

```bash
git clone https://github.com/QEF/q-e.git
ls
```

Expected output:

```text
q-e
```

Some useful Linux commands:

* `wget`: Downloads files from the internet.
* `git clone`: Creates a local copy of a Git repository.
* `ls` (**list**): Displays files and directories in the current directory. It is similar to `dir` on Windows.

#### 1.3 Extract the archive and enter the directory

The downloaded file is a `.tar.gz` archive, so it must first be extracted:

```bash
tar -xvf q-e-qe-7.4.1.tar.gz
```

* `tar -xvf`: Extracts the archive.

  * `x`: extract
  * `v`: verbose
  * `f`: file

After extraction, move into the newly created directory:

```bash
cd q-e-qe-7.4.1
```

* `cd` (**change directory**) moves into another directory.

The command itself does not print anything, but your current directory should now be:

```text
/home/hwang/q-e-qe-7.4.1
```

#### 1.4 Configure and build QE (`./configure` and `make`)

##### ***Standard desktop environment***

Before compiling QE, the build system must first be configured for your machine.

For a standard Linux or WSL environment where you are not specifically configuring parallel computing libraries, you can usually start with:

```bash
./configure
```

* `./configure`: Detects the available compilers and libraries and prepares the build configuration.

Additional options can be specified when necessary, for example to configure MPI support or external libraries.

##### ***Systems with parallel computing libraries, such as Intel MKL***

One of the reasons I originally wrote this note was to keep a record of the configuration options I used for an Intel-based HPC environment.

An example configuration is:

```bash
./configure \
  MPIF90=mpiifort F90=ifort CC=icc \
  --prefix=/usr/local \
  --with-scalapack='-lmkl_scalapack_lp64 -lmkl_blacs_intelmpi_lp64' \
  --with-blas='-lmkl_intel_lp64 -lmkl_sequential -lmkl_core' \
  --enable-openmp
```

The exact configuration depends on the compilers, MPI implementation, and mathematical libraries available on your system. If you are using a university or institutional cluster, it is usually best to check its documentation or available environment modules first.

{{< spoiler text="What do Intel MKL and HPC have to do with DFT calculations?" >}}

Density functional theory (DFT) codes such as VASP and Quantum ESPRESSO perform electronic-structure calculations that involve computationally expensive operations, including large matrix operations, diagonalization, and fast Fourier transforms (FFTs).

* **Intel MKL:** Intel Math Kernel Library provides optimized implementations of numerical libraries such as BLAS, LAPACK, and FFT routines. These libraries can significantly improve the performance of operations that frequently appear in DFT calculations.

* **HPC:** DFT calculations can become computationally demanding as the number of atoms, k-points, bands, or other numerical parameters increases. High-performance computing (HPC) clusters allow calculations to be distributed across many CPU cores or multiple nodes using parallelization frameworks such as MPI and OpenMP.

* **Why are they useful?** Optimized numerical libraries improve the performance of mathematical operations, while HPC resources make it possible to distribute larger workloads across multiple processors. Together, they can substantially reduce the time required for large electronic-structure calculations.

HPC is also widely used outside electronic-structure calculations, including weather forecasting, fluid dynamics, molecular simulations, and machine learning.

{{< /spoiler >}}

#### 1.5 Verify the build

If all required dependencies are available and the configuration succeeds without errors, the `./configure` step should generate a `make.inc` file.

Next, compile QE using:

```bash
make all
```

If the build completes successfully, check whether a ***`bin/`*** directory has been created inside the QE directory.

It should contain executables such as:

```text
pw.x
ph.x
pp.x
...
```

Among these, `pw.x` is one of the main executables used for Quantum ESPRESSO calculations.

Once the required executables have been successfully built, QE is ready to run calculations.

---

### 2. Preparing and Submitting a Calculation

To perform an actual QE calculation on a cluster, you need two main things:

1. A QE input file
2. A job script for the cluster scheduler

#### 2.1 Prepare an input file

QE includes example and benchmark input files in its `test-suite` directory.

For this example, I will use:

```text
/home/hwang/q-e-qe-7.4.1/test-suite/benchmarks/pw/ausurf.in
```

You can also use another appropriate input file from the `test-suite` directory.

First, create a directory for the calculation if necessary:

```bash
mkdir qe-test
cd qe-test
```

Then copy the example input file into the current directory:

```bash
cp /home/hwang/q-e-qe-7.4.1/test-suite/benchmarks/pw/ausurf.in .
```

* `cp` (**copy**) copies a file.
* `.` represents the current directory.

A QE `.in` file contains the information required to define the physical system and the type of calculation you want to perform.

In other words, this is where you specify the problem that QE will solve.

#### 2.2 Create a job script

Calculations on HPC clusters are generally submitted through a job scheduler.

Common schedulers include:

* SLURM
* PBS
* LSF

The exact job script depends on the cluster you are using. If your university or institution provides a computing cluster, follow its documentation for resource allocation, modules, and MPI commands.

Here, I will use SLURM as an example.

Create a file called `job_script.sh`:

```bash
vi job_script.sh
```

Then add something similar to the following:

```bash
#!/bin/bash
#SBATCH --job-name=qe_ausurf
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=16
#SBATCH --time=01:00:00

module load mpi

mpirun -np 16 /home/hwang/q-e-qe-7.4.1/bin/pw.x -in ausurf.in > ausurf.out
```

A few important lines are:

* `#!/bin/bash`: Specifies that the script should be executed using the Bash shell.
* `#SBATCH --nodes=1`: Requests one compute node.
* `#SBATCH --ntasks-per-node=16`: Requests 16 tasks on that node.
* `#SBATCH --time=01:00:00`: Sets a maximum runtime of one hour.

The main execution command is:

```bash
mpirun -np 16 /home/hwang/q-e-qe-7.4.1/bin/pw.x -in ausurf.in > ausurf.out
```

This runs `pw.x` using 16 MPI processes, reads the calculation settings from `ausurf.in`, and writes the output to `ausurf.out`.

The path

```text
/home/hwang/q-e-qe-7.4.1/bin/pw.x
```

points to the `pw.x` executable generated when QE was compiled.

> The correct MPI command and module configuration depend on the cluster. Some systems use `srun` instead of `mpirun`, so always check the documentation for your HPC environment.

#### 2.3 Submit the job

Submit the job script to SLURM using:

```bash
sbatch job_script.sh
```

Once submitted, the scheduler will allocate the requested resources and start the calculation when those resources become available.

You can check your current jobs using:

```bash
squeue -u $USER
```

* `sbatch`: Submits a job script to SLURM.
* `squeue -u $USER`: Displays jobs submitted by the current user.
* `$USER`: Automatically expands to your current username.

When the calculation finishes, the QE output should be stored in:

```text
ausurf.out
```

#### 2.4 Check the output

To display the output file:

```bash
cat ausurf.out
```

* `cat`: Prints the entire contents of a file to the terminal.

For longer calculations, it is often more useful to monitor the output while the calculation is running:

```bash
tail -f ausurf.out
```

* `tail -f`: Displays the last few lines of a file and continuously updates the terminal whenever new output is written.

Other useful commands include:

```bash
less ausurf.out
more ausurf.out
```

You can also edit or inspect files using editors such as:

```bash
nano ausurf.out
vim ausurf.out
```

The best choice depends on your workflow and personal preference.

{{% callout note %}}

If a QE calculation terminates abnormally, a file named ***`CRASH`*** may be created in the working directory. You can check for it using:

```bash
ls
```

The `CRASH` file and the main QE output file usually provide useful information for debugging.

Errors can arise for many reasons, including incorrectly formatted input files, missing or incorrect pseudopotentials, invalid calculation parameters, insufficient resources, or problems with the software environment.

{{% /callout %}}
