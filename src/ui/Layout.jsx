import { Outlet, useNavigate, useLocation, Link } from "react-router";
import ConnectButton from "./ConnectButton";
import { useSocket } from "../context/SocketContext";
import SessionRequestPopup from "./SessionRequestPopup";
import { useEffect } from "react";

export default function Layout() {
  const { acceptedRequest } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route is a chat route or chat history route
  const isChatRoute = location.pathname.startsWith("/chat/");
  const isChatHistoryRoute = location.pathname === "/chat-history";

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
            <img
              src="theramine.png"
              alt="Theramine Logo"
              className="h-20 w-auto cursor-pointer"
              onClick={() => navigate("/")}
            />
            <span className="hidden md:block text-sm pl-4 ml-4 border-l border-white/20 text-white/60">
              Blockchain Therapy Platform
            </span>
          </div>

          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/therapists"
                className="text-white/70 hover:text-white transition-colors"
              >
                👩‍⚕️ Therapists
              </Link>
              <Link
                to="/chat-history"
                className="text-white/70 hover:text-white transition-colors"
              >
                📚 Chat History
              </Link>
            </div>

            <ConnectButton />
          </div>
        </div>
      </nav>

      <main
        className={`${
          isChatRoute || isChatHistoryRoute
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
