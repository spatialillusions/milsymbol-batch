// This plugins makes sure that modules are included in the bundle
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
