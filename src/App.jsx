import { useAccount } from 'wagmi'
import { useWallet } from "./hooks/useWallet";
import "./App.css";

function App() {
  const { connectMetaMask, isLoading } = useWallet();
  const { address, isConnected } = useAccount()

const therapyOptions = [
    { title: 'User', description: 'Register as User' },
    { title: 'Therapist', description: 'Register as Therapist' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-primary to-secondary/80 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-white">
              Theramine
            </h1>
            <span className="hidden md:block text-white/60 text-sm border-l border-white/20 pl-4 ml-4">
              Blockchain Therapy Platform
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isConnected ? (
              <button
                onClick={connectMetaMask}
                disabled={isLoading}
                className="bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg font-medium"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <span className="animate-pulse">Connecting...</span>
                  </span>
                ) : (
                  "Connect MetaMask"
                )}
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="bg-accent/20 text-white px-6 py-2.5 rounded-lg border border-white/10 backdrop-blur-sm">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-text mb-12">
          Choose Your Therapy Type
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {therapyOptions.map((option) => (
            <div
              key={option.title}
              className="bg-secondary/10 border border-secondary/20 rounded-xl p-6 hover:transform hover:scale-105 transition-transform cursor-pointer"
            >
              <h3 className="text-2xl font-semibold text-secondary mb-4">
                {option.title}
              </h3>
              <p className="text-text/80">
                {option.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;