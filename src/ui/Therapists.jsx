const Therapists = ({ setSelectedTherapist }) => {
  const list = [
    { id: 1, name: "John" },
    { id: 2, name: "Peter" },
  ];
  return (
    <div>
      {list.map((e) => (
        <div key={e.name} onClick={() => setSelectedTherapist(e.name)}>
          {e.name}
        </div>
      ))}
    </div>
  );
};

export default Therapists;
