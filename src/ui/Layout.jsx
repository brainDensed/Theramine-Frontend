import { Outlet } from "react-router";
import ConnectButton from "./ConnectButton";
import { useSocket } from "../context/SocketContext";
import SessionRequestPopup from "./SessionRequestPopup";

export default function Layout() {
  const { appointmentRequest, setAppointmentRequest, socket } = useSocket();

  const handleDecision = (accepted) => {
    if (!appointmentRequest) return;

    if (accepted) {
      socket?.send(
        JSON.stringify({
          type: "appoinment_fixed",
          userId: appointmentRequest.userId,
          therapistId: appointmentRequest.therapistId,
          roomId: `${appointmentRequest.userId}-${appointmentRequest.therapistId}`,
          time: Date.now(),
        })
      );
      navigate(`/chat/${appointmentRequest.roomId}`);
    }

    setAppointmentRequest(null); // close popup
  };

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
