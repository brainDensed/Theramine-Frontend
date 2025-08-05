// ui/ChatRoom.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Replace with your backend URL

function ChatRoom() {
  const { therapistId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  

  useEffect(() => {
    socket.emit("join_room", therapistId);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.disconnect();
  }, [therapistId]);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = {
        room: roomId,
        author: username,
        content: message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit("send_message", msgData);
      setMessages((prev) => [...prev, msgData]);
      setMessage("");
    }
  };

  return (
    <div className="rounded-lg p-6 max-w-xl mx-auto shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">Chat</h2>
      <div className="h-64 overflow-y-scroll border p-4 rounded mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <strong>{msg.author}: </strong>
            <span>{msg.content}</span>
            <span className="text-xs text-gray-400 ml-2">({msg.time})</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-4 py-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
