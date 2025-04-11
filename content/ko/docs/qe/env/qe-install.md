---
title: Quantum ESPRESSO 빌드 및 작업 제출하기
date: 2025-04-11
weight: 40
sidebar:
  open: true
---


## QE 빌드 및 작업 제출
Quantum ESPRESSO(QE)를 사용하려면 소스 코드를 다운로드하고, 이를 컴파일하여 실행 가능한 프로그램으로 만드는 빌드 과정이 필요합니다. 이후, 계산 작업을 클러스터의 작업 스케줄러에 제출해 실행합니다. 이 과정에서 병렬 컴퓨팅 도구인 `mpirun`을 활용해 효율적으로 자원을 사용할 수 있습니다. 아래에서 상세하게 설명하겠습니다.


{{% steps %}}
### 소스 코드 다운로드
QE 공식 웹사이트(quantum-espresso.org)에서 최신 버전의 소스 코드를 다운로드합니다. 또는 wgket, git 명령어를 사용하여 다운로드할 수 있습니다.
여기서는 `git clone https://github.com/QEF/q-e.git` 명령을 씁니다.

### 빌드
다운로드한 소스 코드 디렉토리로 이동한 후, 컴파일을 위해 다음 명령어를 실행합니다. 필요에 따라 ./configure 단계에서 컴파일러, 라이브러리 경로, 최적화 옵션 등을 지정할 수 있습니다.
```bash
./configure
make all
```

### 계산 작업을 클러스터에 제출
작업을 실행하려면 먼저 입력 파일(.in)을 준비한 후, 클러스터의 작업 스케줄러(SLURM, PBS 등)에 작업을 제출합니다. 예를 들어, SLURM을 사용하는 경우:
bashsbatch job_script.sh
작업 스크립트에는 mpirun -np 16 pw.x -in input.in > output.out와 같이 MPI를 사용한 병렬 실행 명령이 포함됩니다.
{{% /steps %}}


### 1. QE 소스 코드 다운로드 및 준비

먼저, QE 공식 웹사이트([www.quantum-espresso.org](https://www.quantum-espresso.org))나 GitHub 저장소에서 최신, 혹은 원하는 버전의 소스 코드를 다운로드합니다.
여기서는 `/home/hwang/` 디렉토리에서 작업을 진행한다고 가정합니다. 리눅스에서 "홈 디렉토리(home directory)"란 사용자의 개인 작업 공간으로, 보통 `/home/사용자이름` 형태로 되어 있습니다. 예를 들어, 사용자 이름이 `hwang`이라면 `/home/hwang/`이 당신의 홈 디렉토리입니다.
지금은 이 디렉토리에 아무것도 없다고 가정하겠습니다.

터미널을 열고 다음 명령어를 사용해 `/home/hwang/`에서 작업을 시작합니다. 리눅스 초보자를 위해 명령어를 간단히 설명하겠습니다:

```bash
cd /home/hwang/
```

- cd (change directory): 디렉토리를 이동하는 명령어입니다. 원하는 폴더로 들어갈 때 사용합니다.
- 예상 결과: 아무 메시지도 출력되지 않지만, 이제 /home/hwang/으로 이동한 상태입니다.

  
