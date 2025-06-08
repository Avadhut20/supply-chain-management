import React, { useEffect, useState } from "react";
import axios from "axios";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(false);
  const [buyingId, setBuyingId] = useState(null); // to track which medicine is being bought

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem("PATIENT");
        if (!token) {
          alert("Please login first.");
          return;
        }

        const res = await axios.get("http://localhost:8080/patient/medicines", {
          headers: { Authorization: `${token}` },
        });
        setMedicines(res.data);
      } catch (err) {
        console.error("Failed to fetch medicines", err);
        alert("Failed to load medicines.");
      }
    };

    fetchMedicines();
  }, []);

  const handleBuy = async (medicineId) => {
    try {
      setBuyingId(medicineId);
      const token = localStorage.getItem("PATIENT");
      if (!token) {
        alert("Please login first.");
        setBuyingId(null);
        return;
      }

      await axios.post(
        `http://localhost:8080/patient/buy/${medicineId}`,
        {},
        {
          headers: { Authorization: `${token}` },
        }
      );
      alert("Medicine purchased successfully!");
      setBuyingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to buy medicine.");
      setBuyingId(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Prescribed Medicines</h2>
      {medicines.length === 0 ? (
        <p>No medicines prescribed yet.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Price (₹)</th>
              <th className="py-2 px-4 border">Manufacturer</th>
              <th className="py-2 px-4 border">Quantity</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med, index) => (
              <tr key={med.id} className="text-center">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{med.name}</td>
                <td className="py-2 px-4 border">₹{med.price}</td>
                <td className="py-2 px-4 border">{med.manufacturer.name}</td>
                <td className="py-2 px-4 border">{med.quantity}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleBuy(med.id)}
                    disabled={buyingId === med.id}
                    className={`px-4 py-1 rounded text-white ${
                      buyingId === med.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {buyingId === med.id ? "Buying..." : "Buy"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Medicines;
