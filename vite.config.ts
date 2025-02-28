import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { CssModuleTypes } from "./watching-css-modules";

export default defineConfig({
  plugins: [react(), CssModuleTypes()],
  define: {
    __VITE_NODE_ENV__: process.env.VITE_NODE_ENV,
  },
});
