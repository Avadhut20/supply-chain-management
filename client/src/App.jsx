
import './App.css'

import { useState } from 'react'
import {Routes, Route, BrowserRouter,Link,Outlet,useNavigate} from "react-router-dom"
import Dashboard from './components/Dashboard'
import PatientSignup from "./SignUps/patientSignup"
import HospitalSignup from './SignUps/HospitalSignup';
import InsuranceSignup from './SignUps/InsuranceSignup';
import AdminSignup from './SignUps/AdminSignup';
import DealerSignup from './SignUps/DealerSignup';
import SignIn from './SignUps/SignIn'
import Layout from './components/Layout'
function App() {
 
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/PatientSignup' element={<PatientSignup />} />
          <Route path='/HospitalSignup' element={<HospitalSignup />} />
          <Route path='/InsuranceSignup' element={<InsuranceSignup />} />
          <Route path='/AdminSignup' element={<AdminSignup />} />
          <Route path='/DealerSignup' element={<DealerSignup />} />
          <Route path='/SignIn' element={<SignIn />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
       )
}

export default App
