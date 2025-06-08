// Medicines.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";


const Medicines = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        console.log(localStorage.getItem("PATIENT"));
        const res = await axios.get("http://localhost:8080/patient/medicines", {
          headers: { Authorization: localStorage.getItem("PATIENT") },
        });
        setMedicines(res.data);
      } catch (err) {
        console.error("Failed to fetch medicines", err);
      }
    };

    fetchMedicines();
  }, []);

//   const handleBuy = async (medicineId) => {
//     try {
//       await axios.post(
//         `http://localhost:8080/patient/buy/${medicineId}`,
//         {},
//         {
//           headers: { authorization: localStorage.getItem("PATIENT") },
//         }
//       );
//       alert("Medicine purchased successfully!");
//     } catch {
//       alert("Failed to buy medicine.");
//     }
//   };

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
                    // onClick={() => handleBuy(med.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Buy
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
