
import React, { createContext, useContext, useEffect, useState } from "react";
import { usePhoneAuth } from "./PhoneAuthContext";
import { useAccount } from "wagmi";
const SocketContext = createContext();

function SocketProvider({ children }) {
  const { address } = useAccount();
  const { isPhoneVerified, idToken, phoneNumber } = usePhoneAuth();
  const [socket, setSocket] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [acceptedRequest, setAcceptedRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userDID, setUserDID] = useState(null);

  useEffect(() => {
    if (!address) return;

    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      // Send connection message with walletAddress, userId, idToken if available
      if (isPhoneVerified && idToken && phoneNumber) {
        ws.send(
          JSON.stringify({
            type: "connection",
            userId: phoneNumber,
            idToken,
            walletAddress: address,
            time: Date.now(),
          })
        );
      } else {
        // Fallback: therapist or not phone verified
        ws.send(
          JSON.stringify({
            type: "connection",
            therapistId: address,
            time: Date.now(),
          })
        );
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Incoming:", data);

      // DID registration response (new or already registered)
      if (
        data.did &&
        (data.status === "DID registered" || data.status === "DID already registered")
      ) {
        setUserDID(data.did);
      }

      // appointment request
      if (
        data.message === "appoinment_request" &&
        data.therapistId === address
      ) {
        setPendingRequest(data);
      }

      if (data.message === "appoinment_fixed") {
        // Check if current user is either the therapist or user involved
        if (address === data.therapistId || address === data.userId) {
          setAcceptedRequest(data);
        }
      }

      // chat message
      if (data.type === "chat") {
        const msg = {
          message: data.message,
          sender: data.userId !== address ? data.userId : data.therapistId,
          time: data.time,
          type: "chat",
        };

        setMessages((prev) => [...prev, msg]);
      }
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    ws.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [address, isPhoneVerified, idToken, phoneNumber]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        pendingRequest,
        setPendingRequest,
        acceptedRequest,
        messages,
        setMessages,
        userDID,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

function useSocket() {
  return useContext(SocketContext);
}

// ✅ Default export the Provider, named export the hook
export default SocketProvider;
export { useSocket };
