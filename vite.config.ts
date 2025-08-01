import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { CssModuleTypes } from "./watching-css-modules";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), CssModuleTypes(), svgr()],
  define: {
    'VITE_NODE_ENV': process.env.VITE_NODE_ENV
  },
});