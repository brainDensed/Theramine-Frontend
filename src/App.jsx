import { useState, useEffect } from "react";
import PhoneVerification from "./components/PhoneVerification";
import { usePhoneAuth } from "./context/PhoneAuthContext";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";
import { useAccount } from "wagmi";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { isPhoneVerified, verify } = usePhoneAuth();

  useEffect(() => {
    if (isConnected) {
      navigate("/therapists", { replace: true });
    }
  }, [isConnected, navigate]);

  const handleRegister = async (role) => {
    if (role === "User") {
      setIsOpen(false);
      // Show phone verification modal or inline
    } else {
      navigate("/therapists");
    }
  };

  const therapyOptions = [
    { title: "User", description: "Register as User", role: "User" },
    { title: "Therapist", description: "Register as Therapist", role: "Therapist" },
  ];

  // If registering as user and not verified, show phone verification
  if (isOpen && !isPhoneVerified) {
    return <PhoneVerification onVerified={verify} />;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:scale-105 transition-transform border-2"
        >
          {isOpen ? "Close" : "Register"}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
            >
              <motion.h2 layout>What brings you here?</motion.h2>
              {therapyOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="bg-accent/30 border border-primary/20 rounded-xl p-6 hover:transform hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => handleRegister(option.role)}
                >
                  <h3 className="text-2xl font-semibold text-primary mb-4">
                    {option.title}
                  </h3>
                  <p className="text-text/80">{option.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
