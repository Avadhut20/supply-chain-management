import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Close from '../icons/Close';

function HospUserProfile() {
  const [patients, setPatients] = useState([  ]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 const [all_patientData , setAllPatientData] = useState([ ]);
  // Fetch patients from the database
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/hospital/patients', {
          headers: {
            authorization: localStorage.getItem("HOSPITAL")
          }
        });
        const data_arr = response.data.patients;
        console.log(data_arr +"sdsdsds");
        setAllPatientData(data_arr);
        const obj = data_arr.map((i) => {
          return {
            id: i.P_ID,
            name: i.First_Name + " " + i.Last_Name,
            email: i.Email_ID
          };
        });
        console.log(obj);
        setPatients(obj);
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
    <div className='flex justify-center items-center h-screen'>
      <div className='w-[1000px] h-[600px] flex flex-col justify-start gap-5'>
        <h2 className='text-2xl font-semibold text-black text-center mb-4'>Info Insurance</h2>

        <div className='border h-[510px] rounded-lg overflow-hidden'>
          {/* Fixed Header */}
          <div className='grid grid-cols-4 font-semibold text-black bg-blue-100 p-3 sticky top-0 z-10'>
            <div>Select</div>
            <div>ID</div>
            <div>Patient Name</div>
            <div>Email</div>
          </div>

          {/* Scrollable Content */}
          <div className='overflow-y-auto max-h-[460px]'>
            {patients.map((patient) => (
              <div key={patient.id} className='grid grid-cols-4 border-t p-3 hover:bg-blue-400 items-center'>
                <div>
                  <input
                    type='radio'
                    name='selectedPatient'
                    checked={selectedPatient?.id === patient.id}
                    onChange={() => handleSelect(patient)}
                    className='mr-2 size-4'
                  />
                </div>
                <div>{patient.id}</div>
                <div>{patient.name}</div>
                <div>{patient.email}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <div className='flex justify-center mt-6'>
          <button
            onClick={handleNext}
            className='px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition'
          >
            NEXT
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-0 flex justify-center items-center z-50'>
            <div className='backdrop-blur-md left-36 p-6 rounded-lg shadow-lg w-74 relative'>
              <button
                className='absolute top-2 right-2 text-gray-600 hover:text-black'
                onClick={handleCloseModal}
              >
                <Close />
              </button>
              <CreateBlockChain all_patientData={all_patientData} patient={selectedPatient} handleCloseModal={handleCloseModal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




function CreateBlockChain({all_patientData, patient, handleCloseModal }) {
   console.log("allpatient -->  " , all_patientData)
   const [Dob,setDob] = useState();

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
 
 

  // fetch DOB
  useEffect(() => {
    const fetchData = async () => {
      const ReqPatient = all_patientData.find((i) => i.P_ID == patient.id);
      console.log(ReqPatient);
      try {
        if (ReqPatient) {
          setDob(new Date(ReqPatient.Date_of_Birth).toISOString().split("T")[0]);

        }
      } catch (e) {
        alert(e);
      }
    };
  
    fetchData();
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
        birthDate: Dob || '',
        diseases: patient.diseases ? patient.diseases.slice(0, 6) : Array(6).fill(''),
      }));
    }
  }, [patient,Dob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDiseaseChange = (index, value) => {
    const updatedDiseases = [...formData.diseases];
    updatedDiseases[index] = value;
    setFormData({ ...formData, diseases: updatedDiseases });
  };

  const handleTransaction = async () => {
   
    try{
    console.log('Form Data:', formData.diseases[0]);
    
    const response = await axios.post("http://localhost:8080/hospital/createblockchain",
     
      {
        EmailID:formData.email,
        BirthDate:formData.birthDate,
        DiseaseFirst: formData.diseases[0] || "",
DiseaseSecond: formData.diseases[1] || "",
DiseaseThird: formData.diseases[2] || "",
DiseaseFour: formData.diseases[3] || "",
DiseaseFive: formData.diseases[4] || "",
DiseaseSix: formData.diseases[5] || ""

      }, {
        headers:{
          authorization:localStorage.getItem("HOSPITAL")
        }
      }
    )

    alert(response.data.message);
    handleCloseModal();
   }  
   catch(e){
    alert(e);
    // console.log("Sdmksdkskdmskdm")
   }

    
  };

 
  return (
    <div className="h-[600px] flex  w-[1000px] items-center justify-center p-4">
      <div className="w-full max-w-5xl p-6 shadow-xl rounded-xl border relative">
       
          
        <h2 className="text-3xl  font-semibold text-center mb-6">Create Blockchain</h2>

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