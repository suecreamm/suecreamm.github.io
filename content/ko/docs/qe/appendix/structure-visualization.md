---
title: "원자 구조 시각화하기"
date: 2024-03-31
summary: "VESTA에서 결정구조를 열고, 표시 범위를 조정하고, 결합과 다면체 표현을 설정하는 짧은 튜토리얼."
tags:
  - VESTA
  - Crystal Structure
  - Materials Project
  - VASP
---

## 1. 초기 설정

1. [Materials Project](https://materialsproject.org/)에서 계정을 만든다.
2. 운영체제에 맞는 [VESTA](https://jp-minerals.org/vesta/en/download.html)를 다운로드하고 설치한다.

---

## 2. Drill 1: Graphene

### 2.1 구조 파일 다운로드

Materials Project에서 **graphene**을 검색하고 시각화할 구조를 선택한다.

![Materials Project에서 graphene을 검색하는 화면](/images/tutorials/vesta/01_graphene_materials_project_search.webp)

구조 파일을 **POSCAR** 형식으로 다운로드한다.

![Materials Project에서 graphene POSCAR를 다운로드하는 화면](/images/tutorials/vesta/02_graphene_materials_project_download.webp)

### 2.2 VESTA에서 구조 열기

다운로드한 파일의 이름을 다음과 같이 바꾼다.

```text
C.poscar -> C.vasp
```

그다음 파일을 VESTA를 실행하고, 빈 화면에 `C.vasp` 파일을 드래그해서 연다.

![VESTA에서 연 graphene 구조](/images/tutorials/vesta/03_graphene_open_in_vesta.webp)

### 2.3 화면에 표시되는 unit cell 범위 조정

Box 1에서 왼쪽 하단에 있는 다음 메뉴를 연다.

```text
Style -> Boundary
```

예를 들어 다음과 같이 설정한다.

```text
x(max): 2
y(max): 2
```

이 설정은 **화면에 표시되는 범위만** 바꾼다. 실제 lattice vector를 수정하거나 물리적인 supercell을 새로 만드는 것은 아니다.

![Style panel, view toolbar, menu bar가 표시된 VESTA 화면](/images/tutorials/vesta/04_vesta_interface_boundary_bonds.webp)

그림의 숫자는 이 튜토리얼에서 사용하는 VESTA 인터페이스 영역을 나타낸다.

- **Box 1: Style panel:** Boundary...에서 화면에 표시할 범위를 조절한다.
- **Box 2: View/orientation toolbar:** lattice-axis 및 회전 도구를 사용해 구조를 여러 방향에서 확인한다.
- **Box 3: Menu bar:** [Edit] -> [Bonds]에서 bond를 정의하거나 수정한다.

### 2.4 C-C bond 정의

다음 메뉴를 연다.

```text
[Edit] -> [Bonds] -> [New]
```

다음과 같이 설정한다.

```text
A1: C
A2: C
```

nearest-neighbor C-C 거리가 포함되도록 bond-length range를 지정한 뒤 **Apply**를 누른다.

---

## 3. Drill 2: CaTiO3

### 3.1 구조 파일 다운로드 및 열기

위의 과정과 같은 방식으로, Materials Project에서 **CaTiO3**를 검색한다. POSCAR 파일을 다운로드한 뒤 VESTA에서 연다.

### 3.2 Polyhedral view 사용

다음 스타일을 선택한다.

```text
Style -> Polyhedral
```

![Polyhedral representation을 사용한 CaTiO3 구조와 VESTA 인터페이스](/images/tutorials/vesta/05_catio3_polyhedral_view.webp)

여기서도 같은 숫자 표기를 사용한다.

- **Box 1: Style panel:** **Polyhedral**을 선택한다.
- **Box 2: View/orientation toolbar:** 구조를 회전하거나 특정 lattice direction에 맞춰 본다.
- **Box 3: Menu bar:** coordination environment를 정의할 때 **Edit -> Bonds**를 연다.

### 3.3 Ti-O bond 정의

다음 메뉴를 연다.

```text
Edit -> Bonds
```

Ti-O bond를 정의해 준다.

```text
A1: Ti
A2: O
```

Ti 주변의 nearest O 원자들이 포함되도록 maximum bond length를 설정하고 다음 옵션을 활성화한다.

```text
Show polyhedra
```

![Ti 중심 산소 polyhedra를 만들기 위한 Ti-O bond 설정](/images/tutorials/vesta/06_catio3_bond_settings.webp)

---

## 4. VASP 구조 파일 읽기

일반적인 POSCAR 형식은 다음과 같이 구성된다.

```text
Line 1       노트 (보통 시스템 이름을 씀)
Line 2       Scaling factor
Lines 3-5    Lattice vectors
Line 6       Atomic species
Line 7       Number of atoms
Line 8       Direct or Cartesian
Line 9-...   Atomic coordinates
```

'coordinate line의 개수 (Line 9부터 파일 끝까지의 line 수)'는 위에 적힌 '전체 원자 수 (Line 7 각 항목의 합)'와 반드시 일치해야 한다.

![Graphene POSCAR의 주요 항목을 표시한 화면](/images/tutorials/vesta/07_poscar_file_structure.webp)

### Direct coordinates

`Direct`에서는 원자 위치가 lattice vector (Line #3 - #5)에 대한 fractional coordinate (Line #9 - ...)로 표현된다.

$$
\mathbf{r}=f_1\mathbf{a}_1+f_2\mathbf{a}_2+f_3\mathbf{a}_3
$$

### Cartesian coordinates

`Cartesian`에서는 원자 위치가 Cartesian coordinate로 직접 표현된다.

$$
\mathbf{r}=(x,y,z).
$$


### 4.1 POSCAR의 text와 VESTA의 atom 연결하기

![POSCAR의 atomic coordinate와 VESTA의 atom entry를 연결한 화면](/images/tutorials/vesta/08_poscar_to_vesta_mapping.webp)

그림의 표시는 구조 파일을 확인할 때 다음과 같이 확인할 수 있다.

- **파랑:** POSCAR의 coordinate row 개수는 위에 적힌 atom count와 반드시 같아야 한다.
- **빨강 1: Objects panel:** VESTA에서는 **Objects** 아래에 구조의 atom이 표시된다.
- **빨강 2: atom list:** POSCAR의 첫 번째 coordinate line은 VESTA의 첫 번째 atom entry, 이 예제에서는 **C1**, 에 대응된다.

