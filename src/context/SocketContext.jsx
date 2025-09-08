
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

    const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

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
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Incoming:", data);

        // Handle errors from server
        if (data.error) {
          console.error("❌ Server error:", data.error);
          return;
        }

        // DID registration response (new or already registered)
        if (
          data.did &&
          (data.status === "DID registered" || data.status === "DID already registered")
        ) {
          setUserDID(data.did);
          console.log("✅ DID registered:", data.did);
        }

        // appointment request
        if (
          data.message === "appoinment_request" &&
          data.therapistId === address
        ) {
          setPendingRequest(data);
          console.log("📞 Appointment request received");
        }

        if (data.message === "appoinment_fixed") {
          // Check if current user is either the therapist or user involved
          if (address === data.therapistId || address === data.userId) {
            setAcceptedRequest(data);
            console.log("✅ Appointment confirmed");
          }
        }

        // chat message
        if (data.type === "chat") {
          const msg = {
            message: data.message,
            sender: data.sender || (data.userId !== address ? data.userId : data.therapistId),
            timestamp: data.timestamp || new Date().toISOString(),
            time: data.time || Date.now(),
            type: "chat",
          };

          setMessages((prev) => [...prev, msg]);
          console.log("💬 Chat message received");
        }

        // message delivery confirmation
        if (data.type === "message_sent") {
          console.log(`📤 Message ${data.status}:`, data.roomId);
        }

      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
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
