import { useConnect, useAccount, useDisconnect } from "wagmi";

function ConnectButton() {
  const { connect, connectors, isLoading, error } = useConnect();
  const { disconnect } = useDisconnect();

  const injectedConnector = connectors.find((c) => c.id === "injected");

  return (
    <>
      <button
        onClick={() => injectedConnector && connect({ connector: injectedConnector })}
        disabled={isLoading || !injectedConnector}
        className="px-6 py-2.5 rounded-lg bg-primary text-white transition-all transform hover:scale-105 hover:shadow-lg font-medium"
      >
        {isLoading ? "Connecting..." : "Connect MetaMask"}
      </button>

      {error && (
        <p className="mt-2 text-red-400 text-sm">
          ⚠️ {error.message}
        </p>
      )}
    </>
  );
}

export default ConnectButton;
