import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Close from '../icons/Close';

function HospUserProfile() {
  const [patients, setPatients] = useState([

    { id: 101, name: 'John Doe', email: 'john@example.com' },
    { id: 102, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 103, name: 'Michael Brown', email: 'michael@example.com' },
    { id: 104, name: 'Emily Johnson', email: 'emily@example.com' },
  ]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch patients from the database
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/hospital/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, []);

  // Handle patient selection
  const handleSelect = (patient) => {
    setSelectedPatient(patient);
  };

  // Handle Next button click
  const handleNext = () => {
    if (selectedPatient) {
      setIsModalOpen(true);
    } else {
      alert('Please select a patient.');
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r">
      <div className="w-full max-w-2xl p-6 shadow-xl rounded-xl border mt-[-100px]">
        <h2 className="text-2xl font-semibold mb-4 text-black text-center">Info Insurance</h2>

        {/* Patients Table */}
        <div className="border rounded-lg overflow-y-auto max-h-80">
          <table className="w-full text-left text-sm">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-3">Select</th>
                <th className="p-3">ID</th>
                <th className="p-3">Patient Name</th>
                <th className="p-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-t">
                  <td className="p-3 text-center">
                    <input
                      type="radio"
                      name="selectedPatient"
                      checked={selectedPatient?.id === patient.id}
                      onChange={() => handleSelect(patient)}
                    />
                  </td>
                  <td className="p-3">{patient.id}</td>
                  <td className="p-3">{patient.name}</td>
                  <td className="p-3">{patient.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Next Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            NEXT
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black  bg-opacity-0 flex justify-center items-center z-50">
            <div className="backdrop-blur-md   left-36 p-6 rounded-lg shadow-lg w-74 relative">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
                onClick={handleCloseModal}
              >
                <Close/>
              </button>
              <CreateBlockChain patient={selectedPatient} handleCloseModal ={handleCloseModal} />
            </div>
          </div>
        )}

{/* {isModalOpen && (    <CreateBlockChain patient={selectedPatient} /> )} */}

      </div>
    </div>
  );
}



function CreateBlockChain({ patient, handleCloseModal }) {
   console.log("patient -->  " , patient)
 

  const [formData, setFormData] = useState({
    email: '',
    currentDate: '',
    currentTime: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    diseases: Array(6).fill(''),
  });

  // Set current date and time
  useEffect(() => {
    const now = new Date();
    setFormData((prevData) => ({
      ...prevData,
      currentDate: now.toISOString().split('T')[0],
      currentTime: now.toTimeString().split(' ')[0],
    }));
  }, []);

  // Populate patient info if provided
  useEffect(() => {
    if (patient) {

      const firstName = patient.name.split(" ")[0];
      const lastName = patient.name.split(" ")[1];
     
      setFormData((prevData) => ({
        ...prevData,
        email: patient.email || '',
        firstName: firstName || '',
        lastName: lastName || '',
        birthDate: patient.birthDate || '',
        diseases: patient.diseases ? patient.diseases.slice(0, 6) : Array(6).fill(''),
      }));
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDiseaseChange = (index, value) => {
    const updatedDiseases = [...formData.diseases];
    updatedDiseases[index] = value;
    setFormData({ ...formData, diseases: updatedDiseases });
  };

  const handleTransaction = () => {
    console.log('Form Data:', formData);
    // Add transaction logic here
    handleCloseModal();
  };

  const handleClose = () => {
    if (typeof onClose === 'function') onClose();
  };

  return (
    <div className="h-auto flex items-center justify-center p-4">
      <div className="w-full max-w-5xl p-6 shadow-xl rounded-xl border relative">
       
          
        

        <h2 className="text-3xl font-semibold text-center mb-6">Create Blockchain</h2>

        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block mb-1 text-sm font-medium">Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Current Date</label>
            <input
              type="text"
              value={formData.currentDate}
              readOnly
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Current Time</label>
            <input
              type="text"
              value={formData.currentTime}
              readOnly
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-4">Information</h3>

        <div className="grid grid-cols-3 gap-4">
          {formData.diseases.map((disease, index) => (
            <input
              key={index}
              type="text"
              value={disease}
              onChange={(e) => handleDiseaseChange(index, e.target.value)}
              placeholder={`Disease ${index + 1}`}
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
            />
          ))}
        </div>

        <button
          onClick={handleTransaction}
          className="w-full p-3 mt-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          TRANSACTION
        </button>
      </div>
    </div>
  );
}



export default HospUserProfile;