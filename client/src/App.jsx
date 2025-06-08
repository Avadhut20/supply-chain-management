
import './App.css'


import {Routes, Route, BrowserRouter,Link,Outlet} from "react-router-dom"

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

import DeliveredMedicines from './DealerProfile/DeliveredMedicines';
import OrdersToDeliver from './DealerProfile/OrdersToDeliver';
import ManufacturerSignup from './SignUps/ManufacturerSignup';

import CreateProduct from './manufactureProfile/CreatProduct';
import AllProducts from './manufactureProfile/allProducts';
import OrdersDeliverd from './manufactureProfile/OrdersDeliverd';
import Orders from './manufactureProfile/orders';

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
          <Route path={"/Manufacturersignup"} element={<ManufacturerSignup/>} />

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

              {/* Dealer */}
  
              <Route path={"/DeliveredMedicines"} element={<DeliveredMedicines/>} />
              <Route path={"/OrdersToDeliver"} element={<OrdersToDeliver/>} />

                   {/* manufacturer */}
               <Route path={"/CreateProduct"} element={<CreateProduct/>} />
              <Route path={"/AllProducts"} element={<AllProducts/>} />
               <Route path={"/OrdersDeliverd"} element={<OrdersDeliverd/>} />
              <Route path={"/Orders"} element={<Orders/>} />
              

          
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
       )
}

export default App
