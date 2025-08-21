import { Outlet, useNavigate } from "react-router";
import ConnectButton from "./ConnectButton";
import { useSocket } from "../context/SocketContext";
import SessionRequestPopup from "./SessionRequestPopup";
import { useEffect } from "react";

export default function Layout() {
  const {acceptedRequest} = useSocket();
  const navigate = useNavigate();
  useEffect(() => {
    if (acceptedRequest) {
      // Navigate to the chat room or perform any other action
      navigate(`/chat/${acceptedRequest.roomId}`);
    }
  }, [acceptedRequest]);

  return (
    <div className="min-h-screen">
      <nav className="glass-navbar w-full px-6 py-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
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

      <main className="container mx-auto px-4 py-12">
        <Outlet />
      </main>

      <SessionRequestPopup />
    </div>
  );
}
