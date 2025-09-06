import { StrictMode } from "react";
// Global unhandled promise rejection logger
window.addEventListener("unhandledrejection", (event) => {
  console.error("[Global] Unhandled promise rejection:", event.reason);
});
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RouterProvider } from "react-router";
import { config } from "./config/config.js";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { ThemeProvider } from "./config/ThemeContext.jsx";
import { router } from "./config/RoutesConfig.jsx";
import SocketProvider from "./context/SocketContext.jsx";
import { PhoneAuthProvider } from "./context/PhoneAuthContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <PhoneAuthProvider>
            <SocketProvider>
              <RouterProvider router={router} />
            </SocketProvider>
          </PhoneAuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
