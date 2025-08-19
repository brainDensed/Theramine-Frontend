import { useSocket } from "../context/SocketContext";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useNavigate } from "react-router";

const SessionRequestPopup = () => {
  const { socket, pendingRequest, setPendingRequest } = useSocket();
  const navigate = useNavigate();

  if (!pendingRequest) return null;

  const handleResponse = (accepted) => {
    if (!socket || !pendingRequest) return;

    const roomId = `${pendingRequest.userId}_${pendingRequest.therapistId}_${Date.now()}`;

    if (accepted) {
      socket.send(
        JSON.stringify({
          type: "appoinment_fixed",
          userId: pendingRequest.userId,
          therapistId: pendingRequest.therapistId,
          roomId,
          time: new Date().toISOString(),
        })
      );
      navigate(`/chat/${roomId}`);
    } else {
      socket.send(
        JSON.stringify({
          type: "appoinment_rejected",
          userId: pendingRequest.userId,
          therapistId: pendingRequest.therapistId,
          time: new Date().toISOString(),
        })
      );
    }
    setPendingRequest(null);
  };

  return (
    <Dialog open={!!pendingRequest} onOpenChange={() => setPendingRequest(null)}>
      <DialogContent 
        className="fixed top-[50%] left-[50%] max-w-md w-full translate-x-[-50%] translate-y-[-50%] 
        bg-accent/30 border border-primary/20 rounded-xl p-6 shadow-lg
        backdrop-blur-md"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderColor: "var(--color-primary)",
        }}
      >
        <DialogTitle 
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--color-primary)" }}
        >
          New Session Request
        </DialogTitle>
        <p className="mb-6 text-white/80">
          User <span className="font-mono bg-primary/20 px-2 py-1 rounded">{pendingRequest.userId}</span> wants
          to start a session.
        </p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => handleResponse(false)}
            className="px-6 py-2.5 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg font-medium"
            style={{ 
              backgroundColor: "var(--color-error)",
              color: "var(--color-text)" 
            }}
          >
            Reject
          </button>
          <button
            onClick={() => handleResponse(true)}
            className="px-6 py-2.5 rounded-lg bg-primary text-white transition-all transform hover:scale-105 hover:shadow-lg font-medium"
            style={{ 
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text)" 
            }}
          >
            Accept
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionRequestPopup;