function ConnectedAddress({ address }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
      <div className="address-box">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </div>
    </div>
  );
}

export default ConnectedAddress;
