import React, { useState } from 'react'

function UserProfileSearch() {
  const [patients, setPatients] = useState([
    { id: 1, firstName: "Aniket", lastName: "Kaygude", mobile: "9939192", dob: "12/12/12" },
    { id: 2, firstName: "Vedant", lastName: "Patil", mobile: "9876543", dob: "05/07/99" },
    { id: 3, firstName: "Mehul", lastName: "Shah", mobile: "9123456", dob: "21/03/00" },
    { id: 4, firstName: "Aarav", lastName: "Singh", mobile: "8987654", dob: "17/08/95" },
    { id: 5, firstName: "Isha", lastName: "Gupta", mobile: "8765432", dob: "29/11/98" },
    { id: 6, firstName: "Rohan", lastName: "Desai", mobile: "7654321", dob: "14/06/97" },
    { id: 7, firstName: "Nidhi", lastName: "Verma", mobile: "6543210", dob: "01/04/94" },
    { id: 8, firstName: "Yash", lastName: "Kulkarni", mobile: "5432109", dob: "10/02/96" },
    { id: 9, firstName: "Sanya", lastName: "Chopra", mobile: "4321098", dob: "23/12/99" },
    { id: 10, firstName: "Kunal", lastName: "Joshi", mobile: "3210987", dob: "16/05/93" }
  ]);

  function getData(e) {
    console.log(e.currentTarget); // Logs the entire clicked row
  
    const children = e.currentTarget.children; // Access child elements
  
    console.log(children[0].textContent); // ID
    console.log(children[1].textContent); // First Name
    console.log(children[2].textContent); // Last Name
    console.log(children[3].textContent); // Mobile Number
    console.log(children[4].textContent); // D.O.B
  }
  

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='w-[1000px] h-[600px] flex flex-col justify-start gap-5'>

        <div className="flex justify-center p-4">
          <input
            type="text"
            placeholder="Search Patients"
            className="w-full max-w-md px-4 py-2 text-black bg-white/20 backdrop-blur-lg border border-white/30 rounded-full focus:outline-none focus:ring-1 focus:ring-white placeholder-gray-500 text-center text-lg shadow-lg transition-all duration-300"
          />
        </div>

        <div className="border h-[510px] rounded-lg overflow-y-auto max-h-[510px]">
          <div className="grid grid-cols-5 font-semibold text-black bg-white/30 p-3 sticky top-0 z-10">
            <div>ID</div>
            <div>First Name</div>
            <div>Last Name</div>
            <div>Mobile Number</div>
            <div>D.O.B</div>
          </div>

          {patients.map((patient) => (
            <div key={patient.id} onClick={getData} className="grid grid-cols-5 border-t p-3 hover:bg-blue-400">
              <div>{patient.id}</div>
              <div>{patient.firstName}</div>
              <div>{patient.lastName}</div>
              <div>{patient.mobile}</div>
              <div>{patient.dob}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default UserProfileSearch;
