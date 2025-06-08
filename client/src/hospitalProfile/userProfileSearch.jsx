
import React, { useState,useEffect } from 'react'
import axios from 'axios';
import Close from '../icons/Close';
import {QRCode} from 'react-qr-code';

function UserProfileSearch() {
   const [patients, setPatients] = useState([ ]);
   const [visible ,setVisible] = useState(true);
   const [all_patientData , setAllPatientData] = useState([ ]);
   const [selectedPatient, setSelectedPatient] = useState({
    id: '',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    birthDate: ''
   });
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [data, setData] = useState("")
   // Fetch patients from the database
   useEffect(() => {
     const fetchPatients = async () => {
       try {
         const response = await axios.get('http://localhost:8080/hospital/patients',{
           headers:{
             authorization:localStorage.getItem("HOSPITAL")
           }
         });
         const data_arr = response.data.patients; 
         setAllPatientData(response.data.patients);
        
//   { id: 1, firstName: "Aniket", lastName: "Kaygude", mobile: "9939192", dob: "12/12/12" },
         const obj = data_arr.map((i) => {
           return {
             id: i.P_ID,
             firstName: i.First_Name ,
             lastName: i.Last_Name,
             mobile:i.phone,
             dob: i.Date_of_Birth.substring(0, 10)
           };
         });
      
         setPatients(obj);
       } catch (error) {
         console.error('Error fetching patients:', error);
       }
     };
     fetchPatients();
   }, []);
  
    
   function SearchBar(e){
    setData(e.target.value);
    } 
   
    let filterOut = patients.filter((curValue)=>{
        return curValue.firstName.toLowerCase().includes(data) || curValue.lastName.toLowerCase().includes(data) 
         || curValue.mobile.toLowerCase().includes(data) || curValue.dob.toLowerCase().includes(data)
    })
   
 
 
  function getData(e) {
    //  console.log(e.currentTarget); // Logs the entire clicked row
    const children = e.currentTarget.children; // Access child elements
    console.log(children[0].textContent); // ID
    console.log(children[1].textContent); // First Name
    console.log(children[2].textContent); // Last Name
    console.log(children[3].textContent); // Mobile Number
    console.log(children[4].textContent); // D.O.B
   
    setSelectedPatient({
        id: children[0].textContent,
        firstName: children[1].textContent,
        lastName: children[2].textContent,
        mobileNumber: children[3].textContent,
        birthDate:children[4].textContent
    })

    setIsModalOpen(true);
    setVisible(true);
    
  }


  const handleCloseModal = () => {
    setIsModalOpen(false);
  
  };
  

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='w-[1000px] h-[600px] flex flex-col justify-start gap-5'>

        <div className="flex justify-center p-4">
          <input
            onChange={SearchBar}
            type="text"
            placeholder="Search Patients"
            className="w-full max-w-md px-4 py-2 text-black bg-white/20 backdrop-blur-lg border border-white/30 rounded-full focus:outline-none focus:ring-1 focus:ring-white placeholder-gray-500 text-center text-lg shadow-lg transition-all duration-300"
          />
        </div>

        <div className="border h-[510px] rounded-lg overflow-y-auto max-h-[510px]">
          <div className="grid grid-cols-5 font-semibold text-black bg-blue-100 p-3 sticky top-0 z-20">
            <div>ID</div>
            <div>First Name</div>
            <div>Last Name</div>
            <div>Mobile Number</div>
            <div>D.O.B</div>
          </div>

          {filterOut.map((patient) => (
            <div key={patient.id} onClick={getData} className="grid grid-cols-5 border-t p-3 hover:bg-blue-400">
              <div>{patient.id}</div>
              <div>{patient.firstName}</div>
              <div>{patient.lastName}</div>
              <div>{patient.mobile}</div>
              <div>{patient.dob}</div>
            </div>
          ))}
        </div>


        {isModalOpen && (
                  <div className="fixed inset-0 bg-black  bg-opacity-0 flex justify-center items-center z-50">
                    <div className="backdrop-blur-md w-[1100px] mt-8 left-36 p-6 rounded-lg shadow-lg  relative">
                      <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-black"
                        onClick={handleCloseModal}
                      >
                        <Close/>
                      </button>
                      <GeneratePrescription visible={visible} setVisible={setVisible}  all_patientData={all_patientData} patient={selectedPatient}  handleCloseModal ={handleCloseModal} />
                    </div>
                  </div>
                )}

      </div>
    </div>
  )
}



function GeneratePrescription({
  visible,
  setVisible,
  all_patientData,
  patient,
}) {
  const [types, setTypes] = useState([]);
  const [qrData, setQrData] = useState(null);

  // List of manufacturers
  const [manufacturers, setManufacturers] = useState([]);

  // Medicines filtered by selected manufacturer per medicine item
  // We'll store medicines options per medicine index here
  const [medicinesOptions, setMedicinesOptions] = useState({});

  const [formData, setFormData] = useState({
  PID: "",
  First_Name: "",
  Last_Name: "",
  Date_of_Birth: "",
  Email_ID: "",
  mobileNumber: "",
  birthDate: "",
  diseases: Array(6).fill(""),
  medicines: [
    {
      // medicineName: "",
      // companyName: "",
      quantity: "",
      productId: null, // 🆕 added
    },
  ],
});

  // Fetch blockchain data and diseases
  useEffect(() => {
    const fetchData = async () => {
      const ReqPatient = all_patientData.find((i) => i.P_ID == patient.id);

      try {
        if (ReqPatient) {
          const response = await axios.post(
            "http://localhost:8080/hospital/fetchblockchain",
            {
              EmailID: ReqPatient.Email_ID,
              BirthDate: ReqPatient.Date_of_Birth,
            },
            {
              headers: {
                authorization: localStorage.getItem("HOSPITAL"),
              },
            }
          );
          setTypes(response.data.diseases);
          setFormData((prevData) => ({
            ...prevData,
            Email_ID: ReqPatient.Email_ID,
          }));
        }
      } catch (e) {
        console.error("Error fetching blockchain data:", e);
      }
    };

    fetchData();
  }, [all_patientData, patient.id]);

  // Set patient data
  useEffect(() => {
    if (patient) {
      setFormData((prevData) => ({
        ...prevData,
        PID: parseInt(patient.id) || "",
        First_Name: patient.firstName || "",
        Last_Name: patient.lastName || "",
        Mobile_No: patient.mobileNumber || "",
        Date_of_Birth: patient.birthDate || "",
        Hospital: "na",
        Medicine: formData.medicines || "",
        diseases: types ? types.slice(0, 6) : Array(6).fill(""),
      }));
    }
  }, [patient, types]);

  // Fetch manufacturers on mount
  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/hospital/manufacturers", {
          headers: {
            authorization: localStorage.getItem("HOSPITAL"),
          },
        });
        console.log(localStorage.getItem("HOSPITAL"))
        setManufacturers(response.data);
        console.log("manurafurers --> "  );
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch manufacturers:", error);
      }
    };
    fetchManufacturers();
  }, []);

  // Fetch medicines for a particular company/manufacturer and index
const fetchMedicinesByManufacturer = async (companyName, index) => {
  if (!companyName) {
    setMedicinesOptions((prev) => ({
      ...prev,
      [index]: [],
    }));
    return;
  }

  try {
    // Find manufacturer ID from the name
    const selectedManufacturer = manufacturers.find(
      (manuf) => manuf.name === companyName
    );

    if (!selectedManufacturer) {
      console.error("Manufacturer not found for company name:", companyName);
      return;
    }

    const response = await axios.get(
      `http://localhost:8080/hospital/manufacturers/medicines/${selectedManufacturer.id}`,
      {
        headers: {
          authorization: localStorage.getItem("HOSPITAL"),
        },
      }
    );

    setMedicinesOptions((prev) => ({
      ...prev,
      [index]: response.data.medicines || [],
    }));
  } catch (error) {
    console.error("Failed to fetch medicines by manufacturer:", error);
    setMedicinesOptions((prev) => ({
      ...prev,
      [index]: [],
    }));
  }
};

  const handleDiseaseChange = (index, value) => {
    setFormData((prevData) => {
      const updatedDiseases = [...prevData.diseases];
      updatedDiseases[index] = value;
      return { ...prevData, diseases: updatedDiseases };
    });
  };

 const handleMedicineChange = (index, field, value) => {
  setFormData((prevData) => {
    const updatedMedicines = [...prevData.medicines];

    if (field === "companyName") {
      updatedMedicines[index].companyName = value;
      updatedMedicines[index].medicineName = "";
      updatedMedicines[index].productId = null;
      fetchMedicinesByManufacturer(value, index);
    } else if (field === "medicineName") {
      updatedMedicines[index].medicineName = value;
      const selectedMed = (medicinesOptions[index] || []).find(
        (med) => med.name === value
      );
      updatedMedicines[index].productId = selectedMed?.id || null;
    } else {
      updatedMedicines[index][field] = value;
    }

    return { ...prevData, medicines: updatedMedicines };
  });
};


  const addMedicine = () => {
    setFormData((prevData) => ({
      ...prevData,
      medicines: [
        ...prevData.medicines,
        { medicineName: "", disease: "", companyName: "", quantity: "" },
      ],
    }));
  };

  const removeMedicine = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      medicines: prevData.medicines.filter((_, i) => i !== index),
    }));

    // Also remove medicines options for that index
    setMedicinesOptions((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

const handleTransaction = async () => {
  const cleanedDiseases = formData.diseases
    .map((d) => d.trim())
    .filter((d) => d !== "");

  const prescriptionPayload = {
    patientId: formData.PID,
    medicines: formData.medicines.map((med) => ({
     
      
      quantity: parseInt(med.quantity),
      productId: med.productId, // ✅ added
    })),
    diseases: cleanedDiseases,
  };

  try {
    const response = await axios.post(
      "http://localhost:8080/hospital/prescription",
      prescriptionPayload,
      {
        headers: { authorization: localStorage.getItem("HOSPITAL") },
      }
    );

    console.log("Prescription response:", response.data);
    alert("✅ Prescription created successfully.");
    setVisible(false);
  } catch (error) {
    console.error("❌ Error submitting prescription:", error);
    alert("Failed to generate prescription. Please try again.");
  }
};



  return (
    <div className="h-auto flex items-center justify-center p-4">
      <div className="w-full max-w-5xl p-6 shadow-xl rounded-xl border relative">
        <h2 className="text-3xl font-semibold text-center mb-6">
          PATIENT PRESCRIPTION
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            name="id"
            value={formData.PID}
            onChange={(e) => {}}
            placeholder="ID"
            disabled
            className="w-full p-2 border rounded-lg bg-gray-200"
          />
          <input
            type="text"
            name="firstName"
            value={formData.First_Name}
            onChange={(e) => {}}
            placeholder="First Name"
            disabled
            className="w-full p-2 border rounded-lg bg-gray-200"
          />
          <input
            type="text"
            name="lastName"
            value={formData.Last_Name}
            onChange={(e) => {}}
            placeholder="Last Name"
            disabled
            className="w-full p-2 border rounded-lg bg-gray-200"
          />
          <input
            type="text"
            name="mobileNumber"
           value={formData.mobileNumber || ""}
            onChange={(e) => {}}
            placeholder="Mobile Number"
            disabled
            className="w-full p-2 border rounded-lg bg-gray-200"
          />
          <input
            type="date"
            name="birthDate"
            value={formData.Date_of_Birth}
            onChange={(e) => {}}
            disabled
            className="w-full p-2 border rounded-lg bg-gray-200"
          />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-4">Diseases</h3>
        <div className="grid grid-cols-3 gap-4">
          {visible &&
            formData.diseases.map((disease, index) => (
              <input
                key={index}
                type="text"
                value={disease}
                onChange={(e) => handleDiseaseChange(index, e.target.value)}
                placeholder={`Disease ${index + 1}`}
                className="w-full p-2 border rounded-lg"
              />
            ))}
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-4">
          Generate Prescription
        </h3>
        <div className="max-h-64 overflow-y-auto border rounded-lg p-4">
          {visible &&
            formData.medicines.map((medicine, index) => (
              <div
                key={index}
                className="grid grid-cols-5 gap-4 mb-4 items-center"
              >
                {/* Company (Manufacturer) Dropdown */}
                <select
                  value={medicine.companyName}
                  onChange={(e) =>
                    handleMedicineChange(index, "companyName", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Company</option>
                  {manufacturers.map((manuf) => (
                    <option key={manuf.id} value={manuf.name}>
                      {manuf.name}
                    </option>
                  ))}
                </select>

                {/* Medicine dropdown filtered by company */}
                <select
                  value={medicine.medicineName}
                  onChange={(e) =>
                    handleMedicineChange(index, "medicineName", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg"
                  disabled={!medicine.companyName}
                >
                  <option value="">Select Medicine</option>
                  {(medicinesOptions[index] || []).map((med) => (
                    <option key={med.id} value={med.name}>
                      {med.name}
                    </option>
                  ))}
                </select>

                {/* Disease dropdown */}
                <select
                  value={medicine.disease}
                  onChange={(e) =>
                    handleMedicineChange(index, "disease", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Disease</option>
                  {types.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                {/* Quantity */}
                <input
                  type="number"
                  min="1"
                  value={medicine.quantity}
                  onChange={(e) =>
                    handleMedicineChange(index, "quantity", e.target.value)
                  }
                  placeholder="Quantity"
                  className="w-full p-2 border rounded-lg"
                />

                {/* Remove button */}
                <button
                  onClick={() => removeMedicine(index)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        <div className="flex justify-between gap-5">
          <button
            onClick={addMedicine}
            className="w-full p-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            type="button"
          >
            Add Medicine
          </button>

          <button
            onClick={handleTransaction}
            className="w-full p-3 mt-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            type="button"
          >
            Generate Prescription
          </button>
        </div>
        {qrData && <QRCode value={qrData} size={256} className="mt-4" />}
      </div>
    </div>
  );}
export default UserProfileSearch;
