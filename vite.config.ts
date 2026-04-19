import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base:'https://GeorgeValle.github.io/minesweeper',
  server: {
    port: 5173,
  },
});

