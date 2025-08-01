import { useConnect, useAccount, useDisconnect } from "wagmi";

function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, error } = useConnect();
  const { disconnect } = useDisconnect();

  const injectedConnector = connectors.find((c) => c.id === "injected");

  return (
    <>
      {isConnected ? (
        <div className="flex items-center space-x-3">
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
          <div className="px-6 py-2.5 rounded-lg bg-primary text-white transition-all transform hover:scale-105 hover:shadow-lg font-medium border-1"> 
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
          )}{" "}
        </>
      )}
    </>
  );
}

export default ConnectButton;
