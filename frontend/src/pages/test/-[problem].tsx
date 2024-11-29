import { SolidMarkdown } from "solid-markdown";
import { For, Ref, Show, createSignal, onCleanup, onMount, createEffect, PropsWithChildren, JSX, splitProps, createReaction } from "solid-js";
import { Resizable, ResizableHandle, ResizablePanel } from "~/components/ui/resizable";
import { Tabs, TabsIndicator, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FitAddon } from '@xterm/addon-fit';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { cn } from "~/utils/cn";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { Terminal } from "@xterm/xterm";
import * as Comlink from "comlink"
import { debounce, delay } from "es-toolkit";
import c from "ansi-colors"
import d from 'ts-dedent';


const py = new ComlinkWorker<typeof import("~/py.worker.ts")>(
  new URL("/src/py.worker", import.meta.url),
);

const problems: Record<string, string> = {
  "문제 1": d`
    ## 문제 1. 3명의 국어, 영우, 수학 점수를 입력받아 총점, 평균 구하기
    입력
    \`\`\`text
    1번째 과목점수: 70
    2번째 과목점수: 70
    3번째 과목점수: 70

    1번째 과목점수: 80
    2번째 과목점수: 80
    3번째 과목점수: 80

    1번째 과목점수: 90
    2번째 과목점수: 90
    3번째 과목점수: 90
    \`\`\`
    출력
    \`\`\`text
    [70, 70, 70, 210, 70.0]
    [80, 80, 80, 240, 80.0]
    [90, 90, 90, 270, 90.0]
    \`\`\`
  `,
  "문제 2": d`
    ## 2. 원하는 층만큼 입력한 수의 배수로 나열하기
    입력
    \`\`\`
    층-배수: 5-7
    \`\`\`
    출력
    \`\`\`
    [7, 14, 21, 28, 35]
    [7, 14, 21, 28, 35]
    [7, 14, 21, 28, 35]
    [7, 14, 21, 28, 35]
    [7, 14, 21, 28, 35]
    \`\`\`

  `,
  "문제 3": d`
    ## 3. 입력한 수 안에 있는 소수 나열하기
    입력
    \`\`\`text
    숫자 : 10
    \`\`\`
    출력
    \`\`\`
    [2, 3, 5, 7]
    \`\`\`
  `,
  "문제 4-A": d`
    ## 문제 4-A
    입력
    \`\`\`text
    가로x세로:4x5 
    \`\`\`
    출력
    \`\`\`
    [1, 2, 3, 4, 5]
    [6, 7, 8, 9, 10]
    [11, 12, 13, 14, 15]
    [16, 17, 18, 19, 20]
    \`\`\`
  `,
  "문제 4-B": d`
    ## 문제 4-B
    입력
    \`\`\`text
    가로x세로:4x5 
    \`\`\`
    출력
    \`\`\`
    [5, 4, 3, 2, 1]
    [10, 9, 8, 7, 6]
    [15, 14, 13, 12, 11]
    [20, 19, 18, 17, 16]
    \`\`\`
  `,
  "문제 4-C": d`
    ## 문제 4-C
    입력
    \`\`\`text
    가로x세로:4x5 
    \`\`\`
    출력
    \`\`\`
    [1, 5, 9, 13, 17]
    [2, 6, 10, 14, 18]
    [3, 7, 11, 15, 19]
    [4, 8, 12, 16, 20]
    \`\`\`
  `,
  "문제 4-D": d`
      ## 문제 4-D
      입력
      \`\`\`text
      가로x세로:4x5 
      \`\`\`

      출력
      \`\`\`
      [4, 8, 12, 16, 20]
      [3, 7, 11, 15, 19]
      [2, 6, 10, 14, 18]
      [1, 5, 9, 13, 17]
      \`\`\`
  `,

};



import "@xterm/xterm/css/xterm.css"
import { endpointSymbol } from "vite-plugin-comlink/symbol";
import { toast } from "solid-sonner";
import { Navigate, useNavigate, useParams } from "~/router";
import Loading from "~/components/loading.svg";
import { Separator } from "~/components/ui/separator";

// console.log(await py.run("1+1"))
function Console(_props: { hide?: boolean, terminal?: Terminal } & JSX.HTMLAttributes<HTMLDivElement>) {
  const [props, rest] = splitProps(_props, ["hide", "terminal"]);

  let term = props.terminal || new Terminal({ convertEol: true });
  let termRef!: HTMLDivElement;

  const fitAddon = new FitAddon();

  onMount(() => {
    term.open(termRef);
    term.loadAddon(fitAddon);
  });

  createEffect(() => {
    if (props.hide) {
      termRef.style.width = "0";
      termRef.style.height = "0";
      termRef.style.display = "none";

    }
    else {
      termRef.style.width = "100%";
      termRef.style.height = "100%";
      termRef.style.display = "block";
    }
    fitAddon.fit();
  });

  return <div class="bg-black w-full h-full" ref={termRef} {...rest}></div>;
}


export default function Login() {
  const [selectedTab, setSelectedTab] = createSignal(Object.keys(problems)[0]);
  const [isHandling, setIsHandling] = createSignal(false);
  const [isDisabled, setIsDisabled] = createSignal(true);

  const { problem } = useParams("/test/:problem?");

  let monacoRef!: HTMLDivElement;
  let editor!: monaco.editor.IStandaloneCodeEditor;
  const term = new Terminal({ convertEol: true });


  onMount(() => {
    editor = monaco.editor.create(monacoRef, {
      language: "python",
      automaticLayout: false
    });

    window.addEventListener("resize", () => editor.layout());
  });

  onCleanup(() => {
    editor.getModel()?.dispose();
    editor.dispose();
  });

  createEffect(() => {
    if (isHandling()) {
      monacoRef.style.width = "0";
      monacoRef.style.height = "0";
      monacoRef.style.display = "none";
    }
    else {
      monacoRef.style.width = "100%";
      monacoRef.style.height = "100%";
      monacoRef.style.display = "block";
    }

    editor.layout();
  });

  onMount(async () => {
    term.writeln("파이썬을 로드하고 있습니다...")
    const i = setInterval(() => {
      py.run("print('Loaded!')", Comlink.proxy((b) => {
        setIsDisabled(false);
        clearInterval(i);
        term.clear();
      }))
    }, 2000);
    
    term.onData((chunk) => {
      py.input(chunk)
      term.write(chunk)
    });
  })


  onMount(async () => {
    await delay(2000)
    editor.layout();
    await delay(2000)
    editor.layout();
    await delay(2000)
    editor.layout();
    await delay(2000)
    editor.layout();
    await delay(2000)
    editor.layout();
  })

  async function executeCode(code?: string) {
    console.time("executeCode")
    await py.run(
      /* code */ code || editor.getValue(),
      /* stdout */ Comlink.proxy((b: Uint8Array) => term.write(b))
    );
    console.timeEnd("executeCode")
  }

  createEffect(() => {
    const navigate = useNavigate();
    if (selectedTab() != problem) {
      navigate("/test/:problem?", { params: { problem: selectedTab() } })
    }
  })

  return (
    <>
      <main class="w-screen h-screen grid grid-cols-[auto_1fr] p-2">
        <Tabs defaultValue="account" orientation="vertical" class="contents" value={selectedTab()} onChange={setSelectedTab}>
          <TabsList class="min-w-[5em] max-w-[200px] gap-y-.5">
            <For each={Object.keys(problems)}>
              {(it) => {
                return <TabsTrigger class="bg-transparent" value={it}>
                  <span class="w-full text-align-right">{it}</span>
                </TabsTrigger>
              }}
            </For>
            <TabsIndicator />
            <div class="h-full"></div>
            <Button size="sm" variant="outline" class="text-primary/80">시험<br />종료하기</Button>
          </TabsList>
        </Tabs>
        <Resizable>
          <ResizablePanel initialSize={0.35} minSize={0.3} class="p-inline-2">
            <SolidMarkdown children={problems[selectedTab()]} renderingStrategy="reconcile" class="text-sm lh-[3]" components={{
              h1(props) {
                return <h1 class="text-lg font-semibold">{props.children}</h1>
              },
              h2(props) {
                return <h2 class="text-base font-semibold">{props.children}</h2>
              },
              code(props) {
                return <pre class="bg-primary-foreground p-2 text-xs text-black">{props.children}</pre>
              },
              li(props) {
                return <li class="list-disc">{props.children}</li>
              },
              ol(props) {
                return <ol class="list-decimal">{props.children}</ol>
              },
              ul(props) {
                return <ul class="list-disc">{props.children}</ul>
              },
              td(props) {
                return <td class="p-1">{props.children}</td>
              },
              th(props) {
                return <th class="p-1">{props.children}</th>
              },
              tr(props) {
                return <tr class="border-b">{props.children}</tr>
              },
            }} />
          </ResizablePanel>
          <ResizableHandle withHandle
            onHandleDragStart={() => setIsHandling(true)}
            onHandleDragEnd={() => setIsHandling(false)}
          />
          <ResizablePanel initialSize={1 - 0.35} minSize={0.3}>
            <Resizable orientation="vertical">
              <ResizablePanel class="bg-muted">
                <div ref={monacoRef} class="w-full h-full" />
              </ResizablePanel>
              <ResizableHandle withHandle
                onHandleDragStart={() => setIsHandling(true)}
                onHandleDragEnd={() => setIsHandling(false)}
              />
              <ResizablePanel class="grid grid-cols-[auto_1fr] bg-muted">
                <Show when={!isHandling()}>
                  <div class="flex flex-col gap-2 p-1.5 bg-primary-foreground">
                    <Button class="px-1.5 h-5 text-xs rd-sm bg-sky-6 hover:bg-sky-6/90" onClick={() => executeCode()} disabled={isDisabled()}>
                      <Show when={!isDisabled()} fallback={Loading({})}>
                        실행하기
                      </Show>
                    </Button>
                    <Button class="px-1.5 h-5 text-xs rd-sm bg-emerald-6 hover:bg-emerald-6/90">제출하기</Button>
                    <Separator />
                    <div class="grid grid-cols-2 gap-x-.5">
                      <span class="text-3 grid-col-[1/3] text-.7"> 글꼴 크기 </span>
                      <Button class="px-1.5 h-5 text-xs rd-sm"
                        onClick={() => editor.updateOptions({ fontSize: Math.abs(editor.getOption(52) - 1) })}
                      >
                        &minus;
                      </Button>
                      <Button class="px-1.5 h-5 text-xs rd-sm"
                        onClick={() => editor.updateOptions({ fontSize: editor.getOption(52) + 1 })}

                      >
                        &plus;
                      </Button>
                    </div>
                  </div>
                </Show>
                <Console hide={isHandling()} terminal={term} />
              </ResizablePanel>
            </Resizable>
          </ResizablePanel>
        </Resizable >
      </main >
    </>
  );
}
