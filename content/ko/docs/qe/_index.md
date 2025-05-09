---
title: Quantum ESPRESSO 실습 튜토리얼 (그래핀)
date: 2025-04-08
weight: 30
sidebar:
  open: true
---

<link rel="stylesheet" 
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

## 퀀텀 에스프레소로 DFT 시작하기

이 튜토리얼에서는 CentOS 환경의 클러스터에서 Quantum ESPRESSO로 그래핀 Density Functional Theory (DFT) 계산을 하기 위한 내용을 다룹니다.


### 계산 환경 구축하기
{{< cards >}}
{{< card url="env/get-started" title="처음 시작하는 사람들이 가질만한 의문" icon="custom/solid-circle-question" >}}
{{< card url="env/linux-basics" title="리눅스 기초 명령어" icon="custom/solid-terminal" >}}
{{< card url="env/qe-install" title="QE 빌드 및 작업 제출" icon="custom/solid-download" >}}
{{< /cards >}}


### 실습 예제 (그래핀)
{{< cards >}}
{{< card url="example/graphene-scf" title="그래핀 SCF 계산" icon="custom/solid-calculator" >}}
{{< card url="example/graphene-bands" title="그래핀 밴드 구조 계산" icon="custom/solid-signal" >}}
{{< card url="example/graphene-dos" title="그래핀 상태 밀도 계산" icon="custom/solid-table-cells-large" >}}
{{< card url="example/graphene-phonopy" title="그래핀 포논 계산 (Phonopy)" icon="custom/solid-bacon" >}}
{{< /cards >}}

### 부록
{{< cards >}}
{{< card url="appendix/structure-visualization" title="원자 구조 시각화하기" icon="custom/solid-atom" >}}
{{< card url="appendix/structure-formats" title="원자 구조 내 마음대로 커스텀하기" icon="custom/solid-lock-open" >}}
{{< /cards >}}
