---
title: Quantum ESPRESSO 빌드 및 작업 제출하기
date: 2025-04-11
weight: 40
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

#### 1.1 pwd

클러스터에 접속하게 되면 이 디렉토리로 접속됩니다. 지금 단계에서는 이 디렉토리에 아무것도 없다고 가정하겠습니다.

`pwd` 명령어를 쳐서 현재 위치를 확인해 보겠습니다. 본 튜토리얼은 처음 유저를 위한 것이기 때문에 리눅스 초보자를 위해 명령어를 간단히 설명하겠습니다:
- pwd (print working directory): 지금 내가 어디에 있는지 경로를 보여줍니다.
- 예상 결과:
```
/home/hwang
```

#### 1.2 wget https://gitlab.com/QEF/q-e/-/archive/qe-7.4.1/q-e-qe-7.4.1.tar.gz

현재 위치가 `/home/hwang`이 맞다면 아래 명령어를 사용해 QE를 다운로드하겠습니다.  wget이나 git 둘 중 하나의 명령어를 쓰면 됩니다. git은 종종 사용이 안 되는 경우가 있는데 wget을 써도 받을 수 있습니다. 이후 `ls` 명령어를 통해 현재 디렉토리에 다운로드가 완료되었는지 확인할 수 있습니다.  
```
wget https://gitlab.com/QEF/q-e/-/archive/qe-7.4.1/q-e-qe-7.4.1.tar.gz
ls
```
혹은
```
git clone https://github.com/QEF/q-e.git
ls
```
- wget: 인터넷에서 파일을 다운로드하는 명령어입니다.
- ls (list): 현재 디렉토리에 어떤 파일이나 폴더가 있는지 보여줍니다. (윈도우의 dir과 비슷함)
- 예상 결과:
```
q-e-qe-7.4.1.tar.gz
```



터미널을 열고 다음 명령어를 사용해 `/home/hwang/`에서 작업을 시작합니다. 

```bash
cd /home/hwang/
```

- `cd` (change directory): 디렉토리를 이동하는 명령어입니다. 원하는 폴더로 들어갈 때 사용합니다.
- 예상 결과: 출력되는 메시지는 아무 것도 없지만, 현재 /home/hwang/으로 이동한 상태입니다.

