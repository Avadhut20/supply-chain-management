import React, { useState,useEffect } from 'react'
import axios from 'axios';
import Close from '../icons/Close';
function UserProfileSearch() {

    

   const [patients, setPatients] = useState([ ]);
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
                      <GenreratePriscription patient={selectedPatient} handleCloseModal ={handleCloseModal} />
                    </div>
                  </div>
                )}

      </div>
    </div>
  )
}

// function GenreratePriscription({patient, handleCloseModal}){
//     return <div>msmkds</div>
// }


function GenreratePriscription({ patient, handleCloseModal }) {
  
    const [formData, setFormData] = useState({
      id: '',
      firstName: '',
      lastName: '',
      mobileNumber: '',
      birthDate: '',
      diseases: Array(6).fill(''),
      medicineName: '',
      subName: '',
      companyName: '',
      quantity: '',
    });


  
    useEffect(() => {
      if (patient) {
      
        
       console.log("my firsNmae")
        setFormData((prevData) => ({
          ...prevData,
          id: patient.id || '',
          firstName: patient.firstName || '',
          lastName:  patient.lastName || '',
          mobileNumber: patient.mobileNumber || '',
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
      handleCloseModal();
    };
  
    return (
      <div className="h-auto flex items-center justify-center p-4">
        <div className="w-full max-w-5xl p-6 shadow-xl rounded-xl border relative">
          <h2 className="text-3xl font-semibold text-center mb-6">PATIENT PRESCRIPTION</h2>
  
          <div className="grid grid-cols-3 gap-4">
            <input type="text" name="id" value={formData.id} onChange={handleChange} placeholder="ID" className="w-full p-2 border rounded-lg" />
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full p-2 border rounded-lg" />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full p-2 border rounded-lg" />
            <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Mobile Number" className="w-full p-2 border rounded-lg" />
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>
  
          <h3 className="text-xl font-semibold mt-6 mb-4">Diseases</h3>
          <div className="grid grid-cols-3 gap-4">
            {formData.diseases.map((disease, index) => (
              <input key={index} type="text" value={disease} onChange={(e) => handleDiseaseChange(index, e.target.value)} placeholder={`Disease ${index + 1}`} className="w-full p-2 border rounded-lg" />
            ))}
          </div>
  
          <h3 className="text-xl font-semibold mt-6 mb-4">Generate Prescription</h3>
          <div className="grid grid-cols-4 gap-4">
            <input type="text" name="medicineName" value={formData.medicineName} onChange={handleChange} placeholder="Medicine Name" className="w-full p-2 border rounded-lg" />
            <input type="text" name="subName" value={formData.subName} onChange={handleChange} placeholder="Sub Name" className="w-full p-2 border rounded-lg" />
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" className="w-full p-2 border rounded-lg" />
            <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" className="w-full p-2 border rounded-lg" />
          </div>
  
          <button onClick={handleTransaction} className="w-full p-3 mt-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            Generate Prescription
          </button>
        </div>
      </div>
    );
  }
  

export default UserProfileSearch;
