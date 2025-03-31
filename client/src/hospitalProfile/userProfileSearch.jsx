import React, { useState,useEffect } from 'react'
import axios from 'axios';
import Close from '../icons/Close';
import {QRCode} from 'react-qr-code';
function UserProfileSearch() {
    
   const [patients, setPatients] = useState([ ]);
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
                    <div className="backdrop-blur-md w-[1100px]  left-36 p-6 rounded-lg shadow-lg  relative">
                      <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-black"
                        onClick={handleCloseModal}
                      >
                        <Close/>
                      </button>
                      <GeneratePrescription all_patientData={all_patientData} patient={selectedPatient}  handleCloseModal ={handleCloseModal} />
                    </div>
                  </div>
                )}

      </div>
    </div>
  )
}

function GeneratePrescription({ all_patientData, patient, handleCloseModal }) {
  const [types, setTypes] = useState([]);
  const diseaseOptions = ["Diabetes", "Hypertension", "Asthma", "Cardiovascular Disease", "Arthritis", "Cancer"];
  const [qrData, setQrData] = useState(null);
  const [formData, setFormData] = useState({
    PID: "",
    First_Name: "",
    Last_Name: "",
    Date_of_Birth:"",
    Email_ID:"",
    mobileNumber: "",
    birthDate: "",
    diseases: Array(6).fill(""),
    medicines: [{ medicineName: "", disease: "", companyName: "", quantity: "" }],
  });

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
          formData.Email_ID = ReqPatient.Email_ID;
          setFormData((prevData)=>({
            ...prevData,
            Email_ID: ReqPatient.Email_ID,
          }))
        }
      } catch (e) {
        console.error("Error fetching blockchain data:", e);
      }
    };

    fetchData();
  }, [all_patientData, patient.id]);

  useEffect(() => {
    // PID,
    //     First_Name,
    //     Last_Name,
    //     Date_of_Birth:dob,
    //     Mobile_No,
    //     Email_ID,
    //     Hospital,
    //     Medicine: parsedMedicine,
    if (patient) {
      setFormData((prevData) => ({
        ...prevData,
        PID: parseInt(patient.id )|| "",
        First_Name: patient.firstName || "",
        Last_Name: patient.lastName || "",
        Mobile_No: patient.mobileNumber || "",
        Date_of_Birth: patient.birthDate || "",
        Hospital:"na",
        Medicine:formData.medicines || "",
        diseases: types ? types.slice(0, 6) : Array(6).fill(""),
      }));
    }
  }, [patient, types]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      updatedMedicines[index][field] = value;
      return { ...prevData, medicines: updatedMedicines };
    });
  };

  const addMedicine = () => {
    setFormData((prevData) => ({
      ...prevData,
      medicines: [...prevData.medicines, { medicineName: "", disease: "", companyName: "", quantity: "" }],
    }));
  };

  const removeMedicine = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      medicines: prevData.medicines.filter((_, i) => i !== index),
    }));
  };

  const handleTransaction = async () => {
    
    try {
      
      const response = await axios.post("http://localhost:8080/hospital/prescription", formData,{
        Email_ID: patient.Email_ID,
      }, {
        
        headers: { authorization: localStorage.getItem("HOSPITAL") },
      });
      console.log("Prescription response:", response.data);

      setQrData(JSON.stringify(response.data));
      alert("Prescription created successfully.");
    } catch (e) {
      console.error("Error submitting prescription:", e);
      alert("Failed to generate prescription. Please try again.");
    }
  };

  return (
    <div className="h-auto flex items-center justify-center p-4">
      <div className="w-full max-w-5xl p-6 shadow-xl rounded-xl border relative">
        <h2 className="text-3xl font-semibold text-center mb-6">PATIENT PRESCRIPTION</h2>

        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            name="id"
            value={formData.PID}
            onChange={handleChange}
            placeholder="ID"
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="text"
            name="firstName"
            value={formData.First_Name}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="text"
            name="lastName"
            value={formData.Last_Name}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="text"
            name="mobileNumber"
            value={formData.Mobile_No}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="date"
            name="birthDate"
            value={formData.Date_of_Birth}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-4">Diseases</h3>
        <div className="grid grid-cols-3 gap-4">
          {formData.diseases.map((disease, index) => (
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

        <h3 className="text-xl font-semibold mt-6 mb-4">Generate Prescription</h3>
        <div className="max-h-64 overflow-y-auto border rounded-lg p-4">
          {formData.medicines.map((medicine, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 mb-4 items-center">
              <input
                type="text"
                value={medicine.medicineName}
                onChange={(e) => handleMedicineChange(index, "medicineName", e.target.value)}
                placeholder="Medicine Name"
                className="w-full p-2 border rounded-lg"
              />
              <select
                value={medicine.disease}
                onChange={(e) => handleMedicineChange(index, "disease", e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Disease</option>
                {types.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={medicine.companyName}
                onChange={(e) => handleMedicineChange(index, "companyName", e.target.value)}
                placeholder="Company Name"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                value={medicine.quantity}
                onChange={(e) => handleMedicineChange(index, "quantity", e.target.value)}
                placeholder="Quantity"
                className="w-full p-2 border rounded-lg"
              />
              <button
                onClick={() => removeMedicine(index)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className='flex justify-between gap-5'>

        <button
          onClick={addMedicine}
          className="w-full p-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Medicine
        </button>

        <button
          onClick={handleTransaction}
          className="w-full p-3 mt-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Generate Prescription
        </button>
        </div>
        {qrData && <QRCode value={qrData} size={256} className="mt-4" />}
      </div>
    </div>
  );
}



  

export default UserProfileSearch;
