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
      // case "/PatientSignup":
      //   return [
      //     { label: "Patient Dashboard", path: "PatientSignup" },
      //     { label: "Appointments", path: "PatientSignup" },
      //     { label: "Profile", path: "PatientSignup" },
      //   ];
      case "/HospitalSignup":
        return [
          { label: "Hospital Dashboard", path: "/HospitalDashboard" },
          { label: "Patients", path: "/HospitalPatients" },
        ];
      default:
        return [
          { label: "PATIENT", path: "/PatientSignup" },
          { label: "HOSPITAL", path: "/HospitalSignup" },
          { label: "INSURANCE", path: "/InsuranceSignup" },
          { label: "DEALER", path: "/DealerSignup" },
          { label: "SIGN IN", path: "/SignIn" },
          { label: "ADMIN", path: "/AdminSignup" },
        ];
    }
  };

  return (
    <div className="fixed">
      <SideBar items={getMenuItems()} />
    </div>
  );
}

export default Dashboard;
