const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const router = express.Router();
router.use(cors());
const prisma = new PrismaClient();



// Signup route
router.post("/signup", async (req, res) => {
  // Make sure the client sends "hospitalName" (exactly matching the variable)

  try {
    const { First_Name, Last_Name, Date_of_Birth, Email_ID, phone, address, Password, Gender, hospitalName } = req.body;
    // Check if the hospital exists using the correct field name
    // const foundHospital = await prisma.hospital.findFirst({
    //   where: { Hosptial_Name: hospitalName }
    // });
    
    // Check if the patient already exists
    // const existingPatient = await prisma.patient.findFirst({
    //   where: { Email_ID }
    // });

    // if (existingPatient) {
    //   return res.status(400).json({ message: "Patient already exists" });
    // }
    // if (!foundHospital) {
    //   return res.status(400).json({ message: "Hospital does not exist" });
    // }

    if (!First_Name || !Last_Name || !Date_of_Birth || !Email_ID || !phone || !address || !Password || !Gender || !hospitalName) {
      return res.status(400).json({ message: "All fields are required." });
  }
    
    const dateOfBirthObj = new Date(Date_of_Birth);

    // Create a new patient and connect to the hospital
    const patient = await prisma.patient.create({
      data: {
        First_Name,
        Last_Name,
        Date_of_Birth: dateOfBirthObj,
        Email_ID,
        phone,
        address,
        Password,
        Gender,
        Hospital: {
          connect: {
            Hosptial_Name: hospitalName  
          }
        }
      }
    });

    res.status(201).json({ message: "Patient registered successfully", patient });
  } catch (error) {
    
    console.error("Error in signup:", error);

        if (error.code === "P2002") {
            return res.status(400).json({
                message: ` A Patient with this ${error.meta?.target} already exists.`,
                field: error.meta?.target
            });
        }
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
  }
});

module.exports=router

