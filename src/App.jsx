import { useState, useEffect } from "react";
import PhoneVerification from "./components/PhoneVerification";
import { usePhoneAuth } from "./context/PhoneAuthContext";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";
import { useAccount } from "wagmi";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { isPhoneVerified, verify } = usePhoneAuth();

  useEffect(() => {
    if (isConnected && isPhoneVerified) {
      navigate("/therapists", { replace: true });
    }
  }, [isConnected, isPhoneVerified, navigate]);

  const handleRegister = async (role) => {
    if (role === "User") {
      if (!isConnected) {
        alert("Please connect your wallet first!");
        return;
      }
      setShowPhoneVerification(true);
      setIsOpen(false);
    } else {
      if (!isConnected) {
        alert("Please connect your wallet first!");
        return;
      }
      navigate("/therapists");
    }
  };

  const handlePhoneVerified = () => {
    verify();
    setShowPhoneVerification(false);
    navigate("/therapists");
  };

  const therapyOptions = [
    { 
      title: "🧑‍💼 User", 
      description: "Seek professional therapy and mental health support",
      role: "User",
      features: ["Book therapy sessions", "Secure chat with therapists", "Track your progress"]
    },
    { 
      title: "👩‍⚕️ Therapist", 
      description: "Provide professional therapy services on the blockchain",
      role: "Therapist",
      features: ["Manage client sessions", "Secure communication", "Decentralized credentials"]
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Phone Verification Modal */}
      {showPhoneVerification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Phone Verification</h2>
              <button 
                onClick={() => setShowPhoneVerification(false)}
                className="text-white/70 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <PhoneVerification onVerified={handlePhoneVerified} />
          </div>
        </div>
      )}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Theramine
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Revolutionizing mental healthcare through blockchain technology and decentralized therapy services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/chat-history")}
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all"
            >
              View Chat History
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
            <p className="text-white/70">End-to-end encrypted communications with blockchain security</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold text-white mb-2">Decentralized</h3>
            <p className="text-white/70">No central authority, powered by blockchain technology</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-semibold text-white mb-2">IPFS Storage</h3>
            <p className="text-white/70">Permanent, distributed storage for your chat history</p>
          </div>
        </motion.div>

        {/* Registration Options */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Choose Your Role</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {therapyOptions.map((option, index) => (
                  <motion.div
                    key={option.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:transform hover:scale-105 transition-all cursor-pointer group"
                    onClick={() => handleRegister(option.role)}
                  >
                    <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                      {option.title}
                    </h3>
                    <p className="text-white/80 mb-6">{option.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {option.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-white/70">
                          <span className="text-green-400 mr-2">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Register as {option.role}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connection Status */}
        {!isConnected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <p className="text-white/60 mb-4">Connect your wallet to get started</p>
            <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg border border-yellow-500/30">
              <span className="mr-2">⚠️</span>
              Wallet not connected
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )}

export default App;
