import { useState } from "react"
import { useParams } from "react-router"
import { useAccount } from "wagmi"
import { useSocket } from "../context/SocketContext"

function ChatComponent() {
  const { therapistId } = useParams()
  const { address, isConnected } = useAccount()
  const { messages, sendChatMessage } = useSocket()
  const [input, setInput] = useState("")

  const send = () => {
    if (!therapistId || !address || !isConnected) return
    sendChatMessage({ from: address, to: therapistId, message: input })
    setInput("")
  }

  return (
    <div>
      {(messages ?? []).map((m, i) => (
        <div key={i}>
          <b>{m.from}:</b> {m.message}
        </div>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={send} disabled={!input.trim()}>Send</button>
    </div>
  )
}

export default ChatComponent
