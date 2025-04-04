
import './App.css'


import {Routes, Route, BrowserRouter,Link,Outlet,useNavigate} from "react-router-dom"

import PatientSignup from "./SignUps/patientSignup"
import HospitalSignup from './SignUps/HospitalSignup';
import InsuranceSignup from './SignUps/InsuranceSignup';
import AdminSignup from './SignUps/AdminSignup';
import DealerSignup from './SignUps/DealerSignup';
import SignIn from './components/SignIn'
import Layout from './components/Layout'
import LandingPage from './components/Landing'
import PatientUserProfile from './patientProfile/patientUserProfile'
import PatientInsurence from './patientProfile/patientInsurence'
import PatientInsuHistory from './patientProfile/PatientInsuHistory'
import PatientMedTrack from './patientProfile/PatientMedTrack'


import HospUserProfile from './hospitalProfile/hospUserProfile'
import UserProfileSearch from './hospitalProfile/userProfileSearch'
import ShowBlockChain from './hospitalProfile/ShowBlockChain'

import InsurenceDetails from './insurenceProfile/InsurenceDetails';
import UserInsurenceHistory from './insurenceProfile/UserInsurenceHistory';

function App() {
 
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
        <Route path='/' element={<LandingPage />} />

           {/* SingUps  */}
          <Route path='/PatientSignup' element={<PatientSignup />} />
          <Route path='/HospitalSignup' element={<HospitalSignup />} />
          <Route path='/InsuranceSignup' element={<InsuranceSignup />} />
          <Route path='/AdminSignup' element={<AdminSignup />} />
          <Route path='/DealerSignup' element={<DealerSignup />} />

          <Route path='/SignIn' element={<SignIn />} />

           {/* Patients Routes */}
          <Route path='/PatientUserProfile' element={<PatientUserProfile/>} />
          <Route path='/PatientInsurence' element={<PatientInsurence/>} />
          <Route path='/PatientInsuHistory' element={<PatientInsuHistory/>} />
          <Route path='/PatientMedTrack' element={<PatientMedTrack/>} />

          {/* Hospital Routes */}

          <Route path='/HospUserProfile' element={<HospUserProfile/>} />
          <Route path='/UserProfileSearch' element={<UserProfileSearch/>} />
          <Route path='/ShowBlockChain' element={<ShowBlockChain/>} />


              {/* Insurence Routes */}
              <Route path={"/InsurenceDetails"} element={<InsurenceDetails/>} />
              <Route path={"/UserInsurenceHistory"} element={<UserInsurenceHistory/>} />

          
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
       )
}

export default App
