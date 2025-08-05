import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RouterProvider } from 'react-router';
import { config } from "./config/config.js";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { ThemeProvider } from "./config/ThemeContext.jsx";
import { router } from "./config/RoutesConfig.js";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
