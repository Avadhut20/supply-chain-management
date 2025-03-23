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
import { Link ,useNavigate } from "react-router-dom";
import { useState } from "react";
// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import axios from "axios";

function Cover() {
 
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [userRole, setRole] = useState("PATIENT");
const navigate = useNavigate();
async function signUp() {
  try{
  const response=   await axios.post("http://localhost:8080/auth/signup",{
    username:name,
    email,
    password,
    role:userRole
   })
   
   alert(`${response.data.role}'S  ${response.data.message}`)

   if(response.data.role =="PATIENT" ||response.data.role =="HOSPITAL" || response.data.role =="INSURANCE" ){
      navigate("/authentication/sign-in")
   }
  
  }
  catch(err){
    console.log(err.response.data.message);
    alert(err.response.data.message);
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
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput onChange={(e) => setName(e.target.value)} type="text" label="Name" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput  onChange={(e) => setEmail(e.target.value)}  type="email" label="Email" variant="standard" fullWidth />
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
              <MDButton onClick={signUp} variant="gradient" color="info" fullWidth>
                sign up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
