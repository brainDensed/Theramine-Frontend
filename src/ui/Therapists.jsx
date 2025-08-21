import { useSocket } from "../context/SocketContext";
import { useAccount } from "wagmi";
import SessionRequestPopup from "./SessionRequestPopup";
import { List } from "../assets/Accounts.";

const Therapists = () => {
  const { socket } = useSocket();
  const { address } = useAccount();

  const handleRequestSession = (therapist) => {
    if (socket?.readyState === 1) {
      socket.send(
        JSON.stringify({
          type: "appoinment",
          userId: address,
          therapistId: therapist.address,
          message: "appoinment_request",
          time: Date.now(),
        })
      );
      alert("Request sent! Waiting for therapist to confirm...");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Available Therapists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {List.map((therapist) => (
          <div
            key={therapist.id}
            className="bg-accent/30 border border-primary/20 rounded-xl p-6 hover:transform hover:scale-105 transition-transform"
          >
            <h3 className="text-xl font-semibold text-primary">
              {therapist.name}
            </h3>
            <button
              onClick={() => handleRequestSession(therapist)}
              className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Request Session
            </button>
          </div>
        ))}
      </div>

      <SessionRequestPopup />
    </div>
  );
};

export default Therapists;