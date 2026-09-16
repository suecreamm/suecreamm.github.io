---
title: "A. Visualizing Atomic Structures"
date: 2024-03-31
lastmod: 2026-09-15
summary: "A short tutorial on opening crystal structures in VESTA, adjusting the displayed range, and configuring bonds and polyhedral representations."
weight: 9010
commentable: true
tags:
  - VESTA
  - Crystal Structure
  - Materials Project
  - VASP
sidebar:
    open: false
---

## 1. Initial Setup

1. Create an account on [Materials Project](https://materialsproject.org/).
2. Download and install [VESTA](https://jp-minerals.org/vesta/en/download.html) for your operating system.

---

## 2. Drill 1: Graphene

### 2.1 Download the Structure File

Search for **graphene** on Materials Project and select the structure you want to visualize.


<p align="center">
  <img
    src="/images/tutorials/vesta/01_graphene_materials_project_search.webp"
    alt="Searching for graphene on Materials Project"
    style="width: 100%; max-width: 500px;">
</p>

Download the structure file in **POSCAR** format.

<p align="center">
  <img
    src="/images/tutorials/vesta/02_graphene_materials_project_download.webp"
    alt="Downloading the graphene POSCAR from Materials Project"
    style="width: 100%; max-width: 650px;">
</p>

### 2.2 Open the Structure in VESTA

Rename the downloaded file as follows:

```text
C.poscar -> C.vasp
```

Then launch VESTA and drag the `C.vasp` file onto the empty VESTA window.

<p align="center">
  <img
    src="/images/tutorials/vesta/03_graphene_open_in_vesta.webp"
    alt="Graphene structure opened in VESTA"
    style="width: 100%; max-width: 650px;">
</p>

### 2.3 Adjust the Displayed Unit-Cell Range

Open the following menu located at the bottom left of Box 1:

```text
Style -> Boundary
```

For example, set:

```text
x(max): 2
y(max): 2
```

This changes **only the range displayed on the screen**. It does not modify the actual lattice vectors or create a physical supercell.

<p align="center">
  <img
    src="/images/tutorials/vesta/04_vesta_interface_boundary_bonds.webp"
    alt="VESTA interface showing the Style panel, view toolbar, and menu bar"
    style="width: 100%; max-width: 650px;">
</p>

The numbered labels in the figure indicate the VESTA interface areas used in this tutorial.

- **Box 1: Style panel:** Adjust the displayed range under **Boundary...**
- **Box 2: View/orientation toolbar:** Use the lattice-axis and rotation tools to inspect the structure from different directions.
- **Box 3: Menu bar:** Define or modify bonds under **Edit -> Bonds**.

### 2.4 Define C-C Bonds

Open:

```text
[Edit] -> [Bonds] -> [New]
```

Set:

```text
A1: C
A2: C
```

Choose a bond-length range that includes the nearest-neighbor C-C distance, then click **Apply**.

---

## 3. Drill 2: CaTiO3

### 3.1 Download and Open the Structure File

Following the same procedure as above, search for **CaTiO3** on Materials Project. Download the POSCAR file and open it in VESTA.

### 3.2 Use the Polyhedral View

Select the following style:

```text
Style -> Polyhedral
```

![CaTiO3 structure in polyhedral representation with the VESTA interface](/images/tutorials/vesta/05_catio3_polyhedral_view.webp)

The same numbered labels are used here.

- **Box 1: Style panel:** Select **Polyhedral**.
- **Box 2: View/orientation toolbar:** Rotate the structure or align it along a specific lattice direction.
- **Box 3: Menu bar:** Open **[Edit] -> [Bonds]** when defining the coordination environment.

### 3.3 Define Ti-O Bonds

Open:

```text
[Edit] -> [Bonds]
```

Define the Ti-O bond:

```text
A1: Ti
A2: O
```

Set the maximum bond length so that the nearest O atoms around Ti are included, then enable:

```text
Show polyhedra
```
<p align="center">
  <img
    src="/images/tutorials/vesta/06_catio3_bond_settings.webp"
    alt="Ti-O bond settings for constructing oxygen polyhedra around Ti"
    style="width: 100%; max-width: 600px;">
</p>

---

## 4. Reading a VASP Structure File

A typical POSCAR file is organized as follows:

```text
Line 1       Comment
Line 2       Scaling factor
Lines 3-5    Lattice vectors
Line 6       Atomic species
Line 7       Number of atoms
Line 8       Direct or Cartesian
Line 9-...   Atomic coordinates
```

The number of coordinate lines, from Line 9 to the end of the file, must match the total number of atoms given above, i.e. the sum of the values in Line 7.

<p align="center">
  <img
    src="/images/tutorials/vesta/07_poscar_file_structure.webp"
    alt="Main components of a graphene POSCAR file"
    style="width: 100%; max-width: 650px;">
</p>
### Direct Coordinates

In `Direct` format, atomic positions are expressed as fractional coordinates with respect to the lattice vectors in Lines 3-5.

$$
\mathbf{r}=f_1\mathbf{a}_1+f_2\mathbf{a}_2+f_3\mathbf{a}_3
$$

### Cartesian Coordinates

In `Cartesian` format, atomic positions are given directly in Cartesian coordinates.

$$
\mathbf{r}=(x,y,z).
$$

### 4.1 Connecting POSCAR Text to Atoms in VESTA

![Mapping POSCAR atomic coordinates to atom entries in VESTA](/images/tutorials/vesta/08_poscar_to_vesta_mapping.webp)


This will come in handy when you want to customize the structure.

- **Blue:** The number of coordinate rows in the POSCAR must match the atom count given above.
- **Red 1: Objects button:** This displays a list of the atomic coordinates from the text file, as shown above.
- **Red 2: Atom list:** The first coordinate line in the POSCAR corresponds to the first atom entry in VESTA, which is **C1** in this example.


---
