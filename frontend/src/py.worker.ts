/// <reference types="vite-plugin-comlink/client" />
import { loadPyodide } from "pyodide"
export const add = (a: number, b: number) => a + b;

const pyodide = await loadPyodide({});

let lock = false;

let buffer = [] as string[];

export async function input(str: string) {
    console.log(str);
    buffer.push(str);
}

const syncWait = (ms: number) => {
    const end = Date.now() + ms
    while (Date.now() < end) continue
}



export async function run(code: string, stdin: (buffer: Uint8Array) => unknown | Promise<unknown>): Promise<any> {

    pyodide.setStdout({
        write: (x: Uint8Array) => {
            stdin(x); return x.byteLength;
        }, isatty: true
    });
    pyodide.setStderr({
        write: (x: Uint8Array) => {
            // stdin(Uint8Array.from(new TextEncoder().encode()));
            stdin(x); return x.byteLength;
        },
    })
    pyodide.setStdin({
        stdin: () => {
            while(buffer.length === 0) {
                syncWait(100);
                console.log("waiting")
            }
            return buffer.shift() || "";
        },
        autoEOF: false
    })
    // pyodide.setStdin({})
    // await pyodide.runPythonAsync(`print("\n\n\n\\u001b[35mExecuting...\\u001b[37m");`,);
    await pyodide.runPythonAsync(`print("\\n\\u001b[35mExecuting...\\u001b[37m");`);
    await pyodide.runPythonAsync(code);
    await pyodide.runPythonAsync(`print("\\u001b[35mEnded...\\u001b[37m");`);
}


