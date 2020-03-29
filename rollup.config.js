import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import babel from "rollup-plugin-babel";
import workbox from "rollup-plugin-workbox-inject";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;
const plugins = [
  resolve(),
  replace({ "process.env.NODE_ENV": JSON.stringify(production ? "production" : "development") }),
  babel({ exclude: "node_modules/**" }),
  production && terser()
];

export default [
  {
    input: "src/main.js",
    output: {
      dir: "public",
      entryFileNames: "bundle.js",
      chunkFileNames: "chunk-[hash].js",
      format: "esm",
      sourcemap: !production
    },
    plugins: plugins
  },
  {
    input: "src/main.js",
    output: {
      dir: "public",
      entryFileNames: "bundle-noimport.js",
      chunkFileNames: "chunk-[hash].js",
      format: "system",
      sourcemap: !production
    },
    plugins: plugins
  },
  {
    input: "src/ai.js",
    output: {
      file: "public/ai.js",
      format: "iife",
      sourcemap: !production
    },
    plugins: plugins
  },
  {
    input: "src/sw.js",
    output: {
      file: "public/sw.js",
      format: "iife",
      sourcemap: true
    },
    plugins: plugins.concat([workbox({
        swSrc: "src/sw.js",
        swDest: "public/sw.js",
        globDirectory: "public",
        globPatterns: [
          "*.html",
          "*.js",
          "**/*.js"
        ]
      })])
  }
];
