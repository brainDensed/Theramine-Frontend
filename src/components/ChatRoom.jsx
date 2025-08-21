import { useState } from "react";
import { useAccount } from "wagmi";
import { useSocket } from "../context/SocketContext";
import { useLocation, useParams } from "react-router";

function ChatComponent() {
  const { address } = useAccount();
  const { socket, messages, setMessages } = useSocket();
  const { roomId } = useParams();
  const location = useLocation();
  const [input, setInput] = useState("");

  const { therapistId, userId } = location.state || {};

  console.log("messages", messages);

  const handleSend = () => {
    socket.send(
      JSON.stringify({
        type: "chat",
        userId: userId,
        therapistId: therapistId,
        roomId,
        message: input,
        time: new Date().toISOString(),
      })
    );

    const msg = {
      message: input,
      sender: "me",
      time: new Date().toISOString(),
      type: "chat",
    };

    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div>
      {messages.map((m, i) => (
        <div key={i}>
          <b>{m.sender}</b> {m.message}
        </div>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend} disabled={!input.trim()}>
        Send
      </button>
    </div>
  );
}

export default ChatComponent;
