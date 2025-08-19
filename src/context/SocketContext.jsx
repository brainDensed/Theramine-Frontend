import { createContext, useContext, useEffect, useState } from "react"
import { useAccount } from "wagmi"

const SocketContext = createContext()

function SocketProvider({ children }) {
  const { address } = useAccount()
  const [socket, setSocket] = useState(null)
  const [pendingRequest, setPendingRequest] = useState(null)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (!address) return

    const ws = new WebSocket("ws://localhost:8080")

    ws.onopen = () => {
      console.log("✅ WebSocket connected")
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("📩 Incoming:", data)

      // appointment request
      if (data.message === "appoinment_request" && data.therapistId === address) {
        setPendingRequest(data)
      }

      // chat message
      if (data.type === "chat_message") {
        setMessages((prev) => [...prev, data])
      }
    }

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected")
    }

    ws.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err)
    }

    setSocket(ws)

    return () => {
      ws.close()
    }
  }, [address])

  return (
    <SocketContext.Provider value={{ socket, pendingRequest, setPendingRequest, messages }}>
      {children}
    </SocketContext.Provider>
  )
}

function useSocket() {
  return useContext(SocketContext)
}

// ✅ Default export the Provider, named export the hook
export default SocketProvider
export { useSocket }
