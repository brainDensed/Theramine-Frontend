import { useSocket } from "../context/SocketContext";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router";
import { useState } from "react";
import SessionRequestPopup from "./SessionRequestPopup";

const Therapists = () => {
  const { socket } = useSocket();
  const { address } = useAccount();
  const navigate = useNavigate();

  const list = [
    {
      id: 1,
      name: "Test Account",
      address: "0x100b564Cce2DBdc5dc6D84Fa43c466601473DB1C",
    },
    {
      id: 2,
      name: "Edge Account",
      address: "0x419863485eb5057BF1B1a54C54d990f452551d5f",
    },
    {
      id: 3,
      name: "Chrome Account",
      address: "0x58a7857870919c6F3153B0A2e55AB0D7A603fF8C",
    }
  ];

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
        {list.map((therapist) => (
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