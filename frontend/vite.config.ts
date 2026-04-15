import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    hmr: {
      host: "localhost", // The host the browser uses to connect to the dev server
      clientPort: 5173, // The port the browser will use for HMR websocket connection
    },
    watch: {
      usePolling: true, // Recommended for some Docker setups, especially on Windows/macOS
    },
  },
});
