import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./App.css";
import ConnectButton from "./ui/ConnectButton";
import Therapists from "./ui/Therapists";
import ChatRoom from "./ui/ChatRoom";
import { RegisterUser } from "./lib/actions/RegisterUser";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState("");

  const handleRegister = async () => {
    const result = await RegisterUser();
    if (result.success) {
      console.log("✅ Commitment:", result.commitment);
    } else {
      console.log("❌ Error:", result.error);
    }
  };

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
            <ConnectButton />
          </div>
        </div>
      </nav>

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
                  onClick={handleRegister}
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
        <Therapists setSelectedTherapist={setSelectedTherapist} />
        {selectedTherapist && (
          <ChatRoom
            roomId={`room-${selectedTherapist}`}
            username={"Anonymous"}
          />
        )}
      </main>
    </div>
  );
}

export default App;
