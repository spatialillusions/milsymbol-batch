import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "app.js",
  output: {
    file: "dist/index.js",
    format: "iife",
    name: "milsymbolBatch",
  },
  plugins: [nodeResolve()],
};
