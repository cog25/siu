import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import generouted from '@generouted/solid-router/plugin'
import unocss from 'unocss/vite'
import { comlink } from "vite-plugin-comlink";
import { dirname, join, resolve } from 'node:path'
import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  worker: {
    plugins: () => [comlink()],
  },
  optimizeDeps: { exclude: ["pyodide"] },
  resolve: { alias: { "~": resolve(__dirname, "./src") } },
  plugins: [comlink(), unocss(), solid(), generouted(),
  {
    name: "vite-plugin-pyodide",
    generateBundle: async () => {
      const assetsDir = "dist/assets";
      await mkdir(assetsDir, { recursive: true });
      const files = [
        "pyodide-lock.json",
        "pyodide.asm.js",
        "pyodide.asm.wasm",
        "python_stdlib.zip",
      ];
      const modulePath = fileURLToPath(import.meta.resolve("pyodide"));
      for (const file of files) {
        await copyFile(
          join(dirname(modulePath), file),
          join(assetsDir, file),
        );
      }
    },
  },],
})
