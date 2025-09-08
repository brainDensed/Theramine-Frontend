import { useSocket } from "../context/SocketContext";
import { useAccount } from "wagmi";
import SessionRequestPopup from "./SessionRequestPopup";
import { List } from "../assets/Accounts.";
import { motion } from "motion/react";

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
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-lg">Available Therapists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {List.map((therapist) => (
          <div
            key={therapist.id}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:scale-105 transition-transform shadow-xl"
          >
            <h3 className="text-xl font-semibold text-white/90 mb-2">
              {therapist.name}
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRequestSession(therapist)}
              className="mt-3 px-5 py-2.5 rounded-xl font-semibold text-black
             bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]
             shadow-lg backdrop-blur-md
             hover:shadow-xl transition"
            >
              Request Session
            </motion.button>
          </div>
        ))}
      </div>

      <SessionRequestPopup />
    </div>
  );
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-lg">Available Therapists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {List.map((therapist) => (
          <div
            key={therapist.id}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:scale-105 transition-transform shadow-xl"
          >
            <h3 className="text-xl font-semibold text-white/90 mb-2">
              {therapist.name}
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRequestSession(therapist)}
              className="mt-3 px-5 py-2.5 rounded-xl font-semibold text-black
             bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]
             shadow-lg backdrop-blur-md
             hover:shadow-xl transition"
            >
              Request Session
            </motion.button>
          </div>
        ))}
      </div>

      <SessionRequestPopup />
    </div>
  );
};

export default Therapists;
