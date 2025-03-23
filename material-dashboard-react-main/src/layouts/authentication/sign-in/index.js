/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { Link ,useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";


function Cover() {

  
const [name, setName] = useState("");
const [password, setPassword] = useState("");
const [userRole, setRole] = useState("PATIENT");
const navigate = useNavigate();
async function signIp() {
  try{
  const response=   await axios.post("http://localhost:8080/auth/signin",{
    username:name,
    password,
    role:userRole
   })
    
    localStorage.setItem(response.data.role,response.data.token);
    alert(`${response.data.role}'S  ${response.data.message}`)
   
  }
  catch(err){
    console.log(err.response.data.message);
    alert( +err.response.data.message );
  }
}



  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            SIGN IN
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput onChange={(e) => setName(e.target.value)} type="text" label="Name" variant="standard" fullWidth />
            </MDBox>
           
            <MDBox mb={2}>
              <MDInput onChange={(e) => setPassword(e.target.value)} type="password" label="Password" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth variant="standard">
                <InputLabel>Role</InputLabel>
                <Select value={userRole} onChange={(e) => setRole(e.target.value)} defaultValue="PATIENT">
                  <MenuItem value="PATIENT">PATIENT</MenuItem>
                  <MenuItem value="HOSPITAL">HOSPITAL</MenuItem>
                  <MenuItem value="INSURANCE">INSURANCE</MenuItem>
                  <MenuItem value="DEALER">DEALER</MenuItem>
                </Select>
              </FormControl>
            </MDBox>
            
            <MDBox mt={4} mb={1}>
              <MDButton onClick={signIp} variant="gradient" color="info" fullWidth>
                sign in
              </MDButton>
            </MDBox>
            
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
