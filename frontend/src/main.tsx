import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import App from "./App.tsx";
import { ThemeProvider } from "./components/ui/themes.tsx";
import { PostProvider } from "./lib/postContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <PostProvider limit={20}>
          <App />
        </PostProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
);
