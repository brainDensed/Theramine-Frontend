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
import ErrorBoundary from "./components/ErrorBoundary.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
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
    </ErrorBoundary>
  </StrictMode>
);
