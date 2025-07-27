function ConnectButton({ onClick, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="px-6 py-2.5 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg font-medium"
    >
      {isLoading ? (
        <span className="flex items-center space-x-2 animate-pulse">
          <span>Connecting...</span>
        </span>
      ) : (
        "Connect MetaMask"
      )}
    </button>
  );
}

export default ConnectButton;