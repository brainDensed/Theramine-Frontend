import { useConnect, useAccount, useDisconnect } from "wagmi";
import { useSocket } from "../context/SocketContext";
import { useEffect } from "react";

function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { socket } = useSocket(); // 👈 socket is already managed in context

  const injectedConnector = connectors.find((c) => c.id === "injected");

  useEffect(() => {
    if (isConnected && socket?.readyState === 1) {
      socket.send(
        JSON.stringify({
          type: "appoinment",
          userId: address,
          message: "connection",
          time: Date.now(),
        })
      );
    }
  }, [isConnected, socket?.readyState, address]);

  return (
    <>
      {isConnected ? (
        <div className="flex items-center space-x-3">
          {/* Green indicator if socket is active */}
          <div
            className={`h-2 w-2 rounded-full ${
              socket?.readyState === 1 ? "bg-green-400 animate-pulse" : "bg-gray-400"
            }`}
          ></div>

          <div
            onClick={() => disconnect()}
            className="px-6 py-2.5 rounded-lg bg-primary text-white transition-all transform hover:scale-105 hover:shadow-lg font-medium border-1 cursor-pointer"
          >
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={() =>
              injectedConnector && connect({ connector: injectedConnector })
            }
            disabled={isLoading || !injectedConnector}
            className="px-6 py-2.5 rounded-lg bg-primary text-white transition-all transform hover:scale-105 hover:shadow-lg font-medium border-1"
          >
            {isLoading ? "Connecting..." : "Connect MetaMask"}
          </button>
          {error && (
            <p className="mt-2 text-red-400 text-sm">⚠️ {error.message}</p>
          )}
        </>
      )}
    </>
  );
}

export default ConnectButton;
