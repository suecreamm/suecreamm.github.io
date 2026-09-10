## 전체 경로(`/home/.../pw.x`) 없이 `pw.x`만 입력해서 실행하려면?

처음에는 Quantum ESPRESSO 실행 파일의 전체 경로를 직접 써야 할 수 있습니다.

```bash
mpirun -np 16 /home/hwang/q-e-qe-7.4.1/bin/pw.x -in ausurf.in > ausurf.out
```

하지만 아래처럼 `pw.x`만 입력해서 실행할 수 있도록 설정할 수 있습니다.

```bash
mpirun -np 16 pw.x -in 1scf.in > 1scf.out
```

### 설정 방법

다음 명령을 한 번 실행합니다.

```bash
echo 'export PATH="/home/hwang/q-e-qe-7.4.1/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```
- 첫 번째 명령 `echo ... >> ~/.bashrc`은 QE의 `bin` 경로를 `~/.bashrc`에 추가합니다.
- 두 번째 명령 `source ~/.bashrc`는 `.bashrc`를 다시 불러와서 현재 터미널에 바로 적용합니다.

설정이 잘 되었는지 확인하려면:

```bash
which pw.x
```

다음과 비슷하게 나오면 정상입니다.

```text
/home/hwang/q-e-qe-7.4.1/bin/pw.x
```

### 이 설정은 뭐라고 부르나요?

이 작업을 **Quantum ESPRESSO의 `bin` 디렉터리를 `PATH` 환경 변수에 추가한다**고 합니다.

`PATH`는 Linux가 실행 파일을 찾을 때 확인하는 경로 목록입니다. 이 설정 덕분에 전체 경로를 쓰지 않고 `pw.x`만 입력해도 실행할 수 있습니다.

> **참고**
>
> 아래 명령만 터미널에서 직접 실행하면:
>
> ```bash
> export PATH="/home/hwang/q-e-qe-7.4.1/bin:$PATH"
> ```
>
> 현재 터미널 세션에서만 적용됩니다.
>
> `~/.bashrc`에 저장한 내용은 이후 새 세션에서도 자동으로 적용됩니다.
