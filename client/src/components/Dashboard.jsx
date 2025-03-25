import { useLocation } from "react-router-dom";
import React from "react";
import SideBar from "./sideBar";

function Dashboard() {
  const location = useLocation();
  console.log(location);
  console.log(location.pathname);

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

      default:
        return{ 
          arr:[
          { label: "PATIENT", path: "/PatientSignup" },
          { label: "HOSPITAL", path: "/HospitalSignup" },
          { label: "INSURANCE", path: "/InsuranceSignup" },
          { label: "DEALER", path: "/DealerSignup" },
          { label: "SIGN IN", path: "/SignIn" },
          { label: "ADMIN", path: "/AdminSignup" },
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
