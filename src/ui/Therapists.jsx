import { useNavigate } from 'react-router';
import { useIdentityStore } from '../lib/store/identityStore';

const Therapists = () => {
  const navigate = useNavigate();
  const commitment = useIdentityStore(state => state.commitment);
  const list = [
    { id: 1, name: "John" },
    { id: 2, name: "Peter" },
  ];

  console.log("commitment", commitment);

  const handleTherapistSelect = (therapistName) => {
    navigate(`/chat/${therapistName}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Available Therapists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((therapist) => (
          <div
            key={therapist.id}
            onClick={() => handleTherapistSelect(therapist.name)}
            className="bg-accent/30 border border-primary/20 rounded-xl p-6 cursor-pointer hover:transform hover:scale-105 transition-transform"
          >
            <h3 className="text-xl font-semibold text-primary">{therapist.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Therapists;