import { useNavigate } from "react-router";
import { useIdentityStore } from "../lib/store/identityStore";
import { requestTherapySession } from "../lib/actions/requestTherapySession";
import { usePublicClient } from "wagmi";

const Therapists = () => {
  const publicClient = usePublicClient();
  const navigate = useNavigate();
  const commitment = useIdentityStore((state) => state.commitment);
  const identity = useIdentityStore((state) => state.identity);
  const list = [
    {
      id: 1,
      name: "Test Account",
      address: "0x22B5fd86AA1eaB897294eF94B166e85105B708C6",
    },
  ];

  console.log("commitment", commitment);
  console.log("identity", identity);
  console.log("typeof identity", typeof identity);

  const handleRequestSession = async (therapist) => {
    try {
      const response = await requestTherapySession({
        therapist: therapist.address,
      }, publicClient);

      if (response.success) {
        const { sessionId } = response;
        console.log("Session requested successfully:", sessionId);
        navigate(`/chat/${therapist.name}`);
      } else {
        console.error("Failed to request session:", response.error);
      }
    } catch (err) {
      console.error("Error requesting session:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Available Therapists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((therapist) => (
          <div
            key={therapist.id}
            className="bg-accent/30 border border-primary/20 rounded-xl p-6 cursor-pointer hover:transform hover:scale-105 transition-transform"
            onClick={() => handleRequestSession(therapist)}
          >
            <h3 className="text-xl font-semibold text-primary">
              {therapist.name}
            </h3>
            <button>
              Request Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Therapists;
