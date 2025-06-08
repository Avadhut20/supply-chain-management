import { useLocation } from "react-router-dom";
import React from "react";
import SideBar from "./sideBar";
import DeliveredMedicines from "../DealerProfile/DeliveredMedicines";
import OrdersToDeliver from "../DealerProfile/OrdersToDeliver";

function Dashboard() {
  const location = useLocation();


  // Dynamic menu items based on the current route
  const getMenuItems = () => {
    switch (location.pathname) {
      case "/PatientUserProfile":
        return {
          arr:[
          { label: "User Profile", path: "/PatientUserProfile" },
          { label: "Show insurance List", path: "/PatientInsurence" },
          { label: "Show insurance History", path: "/PatientInsuHistory" },
          { label: "Medicine Tracking", path: "/PatientMedTrack" },
        ],
       name:"Patient Profile"
      }

      case "/PatientInsurence":
        return {
          arr:[
            { label: "User Profile", path: "/PatientUserProfile" },
            { label: "Show insurance List", path: "/PatientInsurence" },
            { label: "Show insurance History", path: "/PatientInsuHistory" },
            { label: "Medicine Tracking", path: "/PatientMedTrack" },
          ],
         name:"Patient Profile"
      }


      case "/PatientInsuHistory":
        return {
          arr:[
            { label: "User Profile", path: "/PatientUserProfile" },
            { label: "Show insurance List", path: "/PatientInsurence" },
            { label: "Show insurance History", path: "/PatientInsuHistory" },
            { label: "Medicine Tracking", path: "/PatientMedTrack" },
          ],
         name:"Patient Profile"
      }

      case "/PatientMedTrack":
        return {
          arr:[
            { label: "User Profile", path: "/PatientUserProfile" },
            { label: "Show insurance List", path: "/PatientInsurence" },
            { label: "Show insurance History", path: "/PatientInsuHistory" },
            { label: "Medicine Tracking", path: "/PatientMedTrack" },
          ],
         name:"Patient Profile"
      }

      
      case "/HospUserProfile":
        return {
          arr:[
          
            { label: "User Profile", path: "/HospUserProfile" },
            { label: "User Profile Search", path: "/UserProfileSearch" },
            { label: "Show Block Chain", path: "/ShowBlockChain" },
          ],
         name:"Hospital Profile"
      }
      case "/UserProfileSearch":
        return {
          arr:[
            
            { label: "User Profile", path: "/HospUserProfile" },
            { label: "User Profile Search", path: "/UserProfileSearch" },
            { label: "Show Block Chain", path: "/ShowBlockChain" },
          ],
         name:"Hospital Profile"
      }


      case "/ShowBlockChain":
        return {
          arr:[
           
            { label: "User Profile", path: "/HospUserProfile" },
            { label: "User Profile Search", path: "/UserProfileSearch" },
            { label: "Show Block Chain", path: "/ShowBlockChain" },
          ],
         name:"Hospital Profile"
      }


      case "/InsurenceDetails":
        return {
          arr:[
           
            { label: "Insurence Details", path: "/InsurenceDetails" },
            { label: "User History Insurence", path: "/UserInsurenceHistory" },
            ],
         name:"Insurence Profile"
      }

      case "/UserInsurenceHistory":
        return {
          arr:[
           
            { label: "Insurence Details", path: "/InsurenceDetails" },
            { label: "User History Insurence", path: "/UserInsurenceHistory" },
            ],
         name:"Insurence Profile"
      }

      case "/DeliveredMedicines":
        return {
          arr:[
           
            { label: "DeliveredMedicines", path: "/DeliveredMedicines" },
            { label: "OrdersToDeliver", path: "/OrdersToDeliver" },
            ],
         name:"Dealer Profile"
      }

       case "/OrdersToDeliver":
        return {
          arr:[
           
            { label: "DeliveredMedicines", path: "/DeliveredMedicines" },
            { label: "OrdersToDeliver", path: "/OrdersToDeliver" },
            ],
         name:"Dealer Profile"
      }


       case "/CreateProduct":
        return {
          arr:[
           
            { label: "CreateProduct", path: "/CreateProduct" },
            { label: "allProducts", path: "/allProducts" },
            { label: "OrdersDeliverd", path: "/OrdersDeliverd" },
            { label: "orders", path: "/orders" },
            ],
         name:"Dealer Profile"
      }

      case "/allProducts":
        return {
          arr:[
           
           { label: "CreateProduct", path: "/CreateProduct" },
            { label: "allProducts", path: "/allProducts" },
            { label: "OrdersDeliverd", path: "/OrdersDeliverd" },
            { label: "orders", path: "/orders" },
            ],
         name:"Dealer Profile"
      }

       case "/orders":
        return {
          arr:[
           
          { label: "CreateProduct", path: "/CreateProduct" },
            { label: "allProducts", path: "/allProducts" },
            { label: "OrdersDeliverd", path: "/OrdersDeliverd" },
            { label: "orders", path: "/orders" },
            ],
         name:"Dealer Profile"
      }
       case "/OrdersDeliverd":
        return {
          arr:[
           
            { label: "CreateProduct", path: "/CreateProduct" },
            { label: "allProducts", path: "/allProducts" },
            { label: "OrdersDeliverd", path: "/OrdersDeliverd" },
            { label: "orders", path: "/orders" },
            ],
         name:"Dealer Profile"
      }

      


      default:
        return{ 
          arr:[
          { label: "PATIENT", path: "/PatientSignup" },
          { label: "HOSPITAL", path: "/HospitalSignup" },
          { label: "INSURANCE", path: "/InsuranceSignup" },
          { label: "DEALER", path: "/DealerSignup" },
          { label: "SIGN IN", path: "/SignIn" },
          { label: "ADMIN", path: "/AdminSignup" },
          { label: "Manufacturer", path: "/Manufacturersignup" },
        ]};
    }
  };

  return (
    <div className="fixed">
      <SideBar items={getMenuItems()} />
    </div>
  );
}

export default Dashboard;
