import { useAccount } from "wagmi";
import { useWallet } from "./hooks/useWallet";
import "./App.css";
import ConnectButton from "./ui/ConnectButton";
import ConnectedAddress from "./ui/ConnectedAddress";

function App() {
  const { connectMetaMask, isLoading } = useWallet();
  const { address, isConnected } = useAccount();

  const therapyOptions = [
    { title: "User", description: "Register as User" },
    { title: "Therapist", description: "Register as Therapist" },
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="glass-navbar w-full px-6 py-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              Theramine
            </h1>
            <span className="hidden md:block text-sm pl-4 ml-4 border-l border-white/20 text-white/60">
              Blockchain Therapy Platform
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {!isConnected ? (
              <ConnectButton />
            ) : (
              <ConnectedAddress address={address} />
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-text mb-12">
          Choose Your Therapy Type
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {therapyOptions.map((option) => (
            <div
              key={option.title}
              className="bg-accent/30 border border-primary/20 rounded-xl p-6 hover:transform hover:scale-105 transition-transform cursor-pointer"
            >
              <h3 className="text-2xl font-semibold text-primary mb-4">
                {option.title}
              </h3>
              <p className="text-text/80">{option.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
