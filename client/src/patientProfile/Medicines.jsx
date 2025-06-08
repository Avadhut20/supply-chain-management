// Medicines.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get("http://localhost:8080/patient/medicines", {
          headers: { authorization: localStorage.getItem("PATIENT") },
        });
        setMedicines(res.data);
      } catch (err) {
        console.error("Failed to fetch medicines", err);
      }
    };

    fetchMedicines();
  }, []);

  const handleBuy = async (medicineId) => {
    try {
      await axios.post(
        `http://localhost:8080/patient/buy/${medicineId}`,
        {},
        {
          headers: { authorization: localStorage.getItem("PATIENT") },
        }
      );
      alert("Medicine purchased successfully!");
    } catch {
      alert("Failed to buy medicine.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Your Prescribed Medicines</h2>
      {medicines.length === 0 ? (
        <p>No medicines prescribed yet.</p>
      ) : (
        medicines.map((med) => (
          <div key={med.id} className="my-4 p-4 border rounded flex justify-between items-center">
            <div>
              <p><strong>Name:</strong> {med.name}</p>
              <p><strong>Price:</strong> ₹{med.price}</p>
              <p><strong>Manufacturer:</strong> {med.manufacturer.name}</p>
            </div>
            <button
              onClick={() => handleBuy(med.id)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Buy
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Medicines;
