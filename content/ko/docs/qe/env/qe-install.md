---
title: Quantum ESPRESSO 빌드 및 작업 제출하기
date: 2025-04-11
weight: 40
commentable: true
sidebar:
  open: true
---

아래는 Quantum ESPRESSO(QE)를 사용하기 위한 과정을 간단하게 요약한 것입니다.


{{% steps %}}

### 소스 코드 다운로드

QE 공식 웹사이트(quantum-espresso.org)에서 최신 버전의 소스 코드를 다운로드합니다. 또는 `wget`, `git` 명령어를 사용하여 다운로드할 수 있습니다.

### 빌드

다운로드한 소스 코드 디렉토리로 이동한 후, 컴파일을 위해 다음 명령어를 실행합니다. 필요에 따라 ./configure 단계에서 컴파일러, 라이브러리 경로, 최적화 옵션 등을 지정할 수 있습니다.
```bash
./configure
make all
```

### 계산 작업을 클러스터에 제출

작업을 실행하려면 먼저 입력 파일(.in)을 준비한 후, 클러스터의 작업 스케줄러(SLURM, PBS 등)에 작업을 제출합니다. 예를 들어, SLURM을 사용하는 경우:
bashsbatch job_script.sh
작업 스크립트에는 `mpirun -np 16 pw.x -in input.in > output.out`와 같이 MPI를 사용한 병렬 실행 명령이 포함됩니다.
{{% /steps %}}


### 1. QE 소스 코드 다운로드 및 준비

먼저, QE 공식 웹사이트([www.quantum-espresso.org](https://www.quantum-espresso.org))나 GitHub 저장소에서 최신, 혹은 원하는 버전의 소스 코드를 다운로드합니다.
여기서는 `/home/hwang/` 디렉토리에서 작업을 진행한다고 가정합니다.

리눅스에서 "홈 디렉토리(home directory)"란 사용자의 개인 작업 공간으로, 보통 `/home/사용자이름` 형태로 되어 있습니다. 저의 사용자 이름이 `hwang`이기 때문에 여기서는 `/home/hwang/`이 이 튜토리얼 내내 홈 디렉토리라고 나올 것입니다.

#### 1.1 현재 디렉토리 확인 (pwd)

클러스터에 접속하게 되면 이 디렉토리로 접속됩니다. 지금 단계에서는 이 디렉토리에 아무것도 없다고 가정하겠습니다.

`pwd` 명령어를 쳐서 현재 위치를 확인해 보겠습니다. 본 튜토리얼은 처음 유저를 위한 것이기 때문에 리눅스 초보자를 위해 명령어를 간단히 설명하겠습니다:
- pwd (print working directory): 지금 내가 어디에 있는지 경로를 보여줍니다.
- 예상 결과:
```
/home/hwang
```

#### 1.2 소스 코드 다운로드 (wget 또는 git)

현재 위치가 `/home/hwang`이 맞다면 아래 명령어를 사용해 QE를 다운로드하겠습니다.  wget이나 git 둘 중 하나의 명령어를 쓰면 됩니다. git은 종종 사용이 안 되는 경우가 있는데 wget을 써도 받을 수 있습니다. 이후 `ls` 명령어를 통해 현재 디렉토리에 다운로드가 완료되었는지 확인할 수 있습니다. 이 튜토리얼에서는 wget을 사용해 q-e-qe-7.4.1.tar.gz 파일을 다운로드한 경우를 기준으로 진행합니다. 
```bash
wget https://gitlab.com/QEF/q-e/-/archive/qe-7.4.1/q-e-qe-7.4.1.tar.gz
ls
```
- 예상 결과:
```
q-e-qe-7.4.1.tar.gz
```
혹은
```bash
git clone https://github.com/QEF/q-e.git
ls
```
- 예상 결과:
```
q-e
```

- wget: 인터넷에서 파일을 다운로드하는 명령어입니다.
- git clone: GitHub 저장소를 복제합니다.
- ls (list): 현재 디렉토리에 어떤 파일이나 폴더가 있는지 보여줍니다. (윈도우의 dir과 비슷함)

#### 1.3 압축 풀고 폴더 이동하기
다운로드한 파일은 .tar.gz 형식인데, 압축을 해제해야 합니다. 다음 명령어를 사용합니다:
```bash
tar -xvf q-e-qe-7.4.1.tar.gz
```
- tar -xvf: .tar.gz 압축 파일을 해제합니다 (x: extract, v: verbose, f: file).

압축을 푼 후, 생성된 디렉토리로 이동합니다:

```bash
cd q-e-qe-7.4.1
```
- cd (change directory): 디렉토리를 이동하는 명령어입니다. 원하는 폴더로 들어갈 때 사용합니다.
- 예상 결과: 출력되는 메시지는 아무 것도 없지만, 현재 경로는 /home/hwang/q-e-qe-7.4.1입니다.

#### 1.4 설정 및 빌드 (./configure 및 make)
##### ***일반 데스크탑***
QE를 컴파일하려면 먼저 시스템에 맞는 설정을 해야 합니다. WSL 환경이거나 Parallel computing과 관련이 없다면 다음 명령어를 실행합니다:

```bash
./configure
```
- ./configure: 빌드 환경을 설정합니다. 필요하면 컴파일러, 라이브러리 경로, 최적화 옵션 등을 추가로 지정할 수 있습니다 (예: ./configure --with-mpi).

##### ***Parallel computing 관련 리소스가 있는 경우 (예: Intel MKL 활용하는 경우)***
사실 이 글은 이 configure 옵션을 기록해놓고자 쓴 글입니다. 아래의 옵션으로 컴파일 할 수 있는데, 접어 놓은 글은 스킵해도 DFT 계산을 하는 데에는 아무 상관이 없습니다.

```bash
./configure \
  MPIF90=mpiifort F90=ifort CC=icc \
  --prefix=/usr/local \
  --with-scalapack='-lmkl_scalapack_lp64 -lmkl_blacs_intelmpi_lp64' \
  --with-blas='-lmkl_intel_lp64 -lmkl_sequential -lmkl_core' \
  --enable-openmp
```

{{< spoiler text="DFT 계산을 하는데 Intel MKL, HPC는 무슨 관계야? 왜 필요해?" >}}

DFT(밀도 범함수 이론) 계산은 VASP나 Quantum ESPRESSO(QE) 같은 소프트웨어로 전자 구조를 계산하며, 대규모 행렬 연산과 FFT(고속 푸리에 변환) 같은 복잡한 수학 연산이 필요하다.

- Intel MKL의 역할: Intel MKL은 행렬 연산(BLAS, LAPACK), FFT 등의 연산을 인텔 CPU에 최적화해 빠른 속도로 계산할 수 있게 해준다. 이를 통해 DFT 계산의 병목 구간(예: 해밀토니안 대각화, 파동함수 변환)을 빠르게 처리해 계산 속도를 높일 수 있다.
- HPC의 역할: DFT 계산은 연산량이 매우 커 HPC(고성능 컴퓨팅) 클러스터의 수백~수천 코어로 병렬 처리를 한다. HPC는 다중 노드를 활용해 VASP, QE의 병렬 연산(MPI, OpenMP, CUDA)을 효율적으로 실행한다. 전자 구조 계산 뿐만 아니라 기상 예측, 유체 시뮬레이션, 딥 러닝 등에 활용됩니다.
- 왜 필요해?: MKL은 단일 노드 내 연산을 최적화하고, HPC는 대규모 병렬화를 가능케 합니다. 둘 다 없으면 DFT 계산이 너무 느려지거나 대규모 시스템(수백 원자 이상)을 다룰 수 없다. 예: MKL은 행렬 연산을 빠르게 할 수 있게 하고, HPC는 작업을 수백 코어로 나누어 처리해 며칠 걸릴 계산을 몇 시간으로 줄여준다.
{{< /spoiler >}}



#### 1.5 설치 확인
모든 requirements를 가지고.. dependency 문제같은 것이 없다면 중간에 에러 메시지 없이 configure 단계가 끝납니다. 이 단계가 끝나면 `make.inc` 파일이 생성됩니다.
다음으로 아래의 명령어를 실행합니다.

```bash
make all
```

중간에 에러 메시지 없이 무사히 이 단계가 끝났다면 `/q-e/` 디렉토리 내부에 `***bin/***` 디렉토리가 생겼는지, 그 안에 pw.x, ph.x, pp.x ... 의 파일이 생겼는지 확인해 보면 끝입니다.
pw.x는 모든 QE 계산에 거의 필수적으로 쓰이는데 이게 생성되어야 비로소 jobscript 제출을 해서 컴퓨터한테 계산을 시킬 수 있는 단계가 됩니다!

### 2. 계산 작업 준비 및 제출
QE를 사용하여 실제 계산을 수행하려면 입력 파일과 작업 스크립트를 준비한 후, 클러스터에 작업을 제출해야 합니다.

#### 2.1 입력 파일 준비
input 파일은 `/home/hwang/q-e/test-suite/`에 들어가면 볼 수 있습니다. 예시는 `/home/hwang/q-e/test-suite/benchmarks/pw/ausurf.in`을 사용하겠습니다.
test-suite 폴더 안에 있는 다른 파일을 돌려도 상관 없습니다.

QE의 계산을 위해 입력 파일(예: `ausurf.in`)을 작업 디렉토리로 복사하여 사용하겠습니다. 다음 명령어로 입력 파일을 현재 디렉토리(`/home/hwang/q-e-qe-7.4.1/`)로 복사합니다.
*.in 파일은 어떠한 시스템을 계산할 지에 대한 정보를 담고 있습니다. 풀고 싶은 문제를 여기에 정의하게 됩니다.

```bash
cp /home/hwang/q-e/test-suite/benchmarks/pw/ausurf.in .
```
- cp (copy): 파일을 복사하는 명령어입니다. .은 현재 디렉토리를 의미합니다.

#### 2.2 작업 스크립트 작성
클러스터에서 작업을 제출하려면 작업 스크립트를 작성해야 합니다. 클러스터 환경마다 job 스케줄러가 다르고 job script도 전부 다릅니다. 학교나 기관에서 계산 클러스터를 쓰게 해주는 경우가 있던데 알려주는 대로 작업 스크립트를 쓰면 됩니다.

여기서는 SLURM 작업 스케줄러를 예로 사용합니다. `vi job_script.sh` 명령어로 job_script.sh 파일을 생성하고 아래 내용을 추가하고 저장합니다.

```bash
#!/bin/bash
#SBATCH --job-name=qe_ausurf
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=16
#SBATCH --time=01:00:00

module load mpi
mpirun -np 16 /home/hwang/q-e/bin/pw.x -in ausurf.in > ausurf.out
```

Job script에서 필수적인 내용만 설명하면 아래와 같습니다.

- #!/bin/bash: Bash shell로 실행됨을 나타냅니다.
- mpirun -np 16 /home/hwang/q-e/bin/pw.x -in ausurf.in > ausurf.out: 16개 프로세스로 pw.x를 병렬 실행하여 ausurf.in을 처리하고 결과를 ausurf.out에 저장합니다.
/home/hwang/q-e/bin/pw.x는 QE 컴파일 후 생성된 실행 파일의 경로입니다.


#### 2.3 작업 제출
작업 스크립트를 SLURM에 제출하여 계산을 시작합니다. 작업이 제출되면 클러스터에서 계산이 시작되고, 완료 후 결과가 ausurf.out 파일에 저장됩니다.
```bash
sbatch job_script.sh
```
```bash
squeue -u $USER
```
- sbatch: 클러스터의 작업 스케줄러에 job을 제출합니다.
- squeue -u $USER: 현재 사용자가 제출한 작업의 상태를 보여줍니다. $USER는 현재 사용자 이름을 자동으로 대체합니다.



#### 2.4 결과 확인
작업이 실행되면, 출력 파일(ausurf.out)을 확인하여 계산 결과를 검토합니다:
```bash
cat ausurf.out
```
- cat: 파일 내용을 터미널에 한 번에 출력합니다.

아주 짧은 계산이 아니라면 계산에 시간이 오래 걸리는데, 그럴 때 저는 아래의 명령어를 씁니다 (실시간으로 확인 가능).
```bash
tail -f ausurf.out
```
- tail -f: 파일의 마지막 몇 줄을 실시간으로 출력하며, 새로운 내용이 추가될 때마다 갱신됩니다.


파일을 읽고 쓰는 명령어는 여러 가지가 있는데 개인의 취향과 상황에 맞춰 적절하게 쓰면 됩니다.
- less ausurf.out, more ausurf.out
- nano ausurf.out 또는 vim ausurf.out: 파일을 편집

{{% callout note %}}
계산이 적절하게 진행되지 않는 경우 `ls` 명령어를 쳐보면 ***CRASH***라는 파일이 생성되어 있습니다. 이것과 *.out 파일을 열어 문제를 디버깅하면 됩니다.
input 파일이 포맷에 맞게 쓰여지지 않은 경우, pseudopotential이 적절하게 주어지지 않은 경우 등 아주 다양한 상황이 있습니다.
{{% /callout%}}

