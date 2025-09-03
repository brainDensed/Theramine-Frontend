import { Outlet, useNavigate, useLocation } from "react-router";
import ConnectButton from "./ConnectButton";
import { useSocket } from "../context/SocketContext";
import SessionRequestPopup from "./SessionRequestPopup";
import { useEffect } from "react";

export default function Layout() {
  const { acceptedRequest } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route is a chat route
  const isChatRoute = location.pathname.startsWith("/chat/");

  useEffect(() => {
    if (acceptedRequest) {
      // Navigate to the chat room or perform any other action
      navigate(`/chat/${acceptedRequest.roomId}`, {
        state: {
          therapistId: acceptedRequest.therapistId,
          userId: acceptedRequest.userId,
        },
      });
    }
  }, [acceptedRequest]);

  return (
    <div className="min-h-screen overflow-hidden">
      <nav
        className="glass-navbar w-full px-6 py-4 shadow-lg fixed top-0 left-0 right-0 z-50"
        style={{ height: "80px" }}
      >
        <div className="container mx-auto flex items-center justify-between h-full">
          <div className="flex items-center space-x-2">
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              Theramine
            </h1>
            <span className="hidden md:block text-sm pl-4 ml-4 border-l border-white/20 text-white/60">
              Blockchain Therapy Platform
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main
        className={`${
          isChatRoute
            ? "pt-20 h-[calc(100vh-80px)]"
            : "container mx-auto px-4 py-12 pt-32"
        }`}
      >
        <Outlet />
      </main>

      <SessionRequestPopup />
    </div>
  );
}
