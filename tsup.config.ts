import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  outDir: "dist",
  clean: true,
  external: [
    "axios",
    "react",
    "React",
    "react-dom",
    "react-redux",
    "next",
    "next/image",
    "next/link",
    "next/navigation",
    "next/head",
    "next/head",
    "@heroicons/react",
    "@mui/material",
    "@mui/icons-material",
    "@radix-ui/*",
    "@assistant-ui/*",
  ],
});
