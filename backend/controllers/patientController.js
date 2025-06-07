const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const router = express.Router();
router.use(cors());
const prisma = new PrismaClient();



// Signup route
router.post("/signup", async (req, res) => {
  try {
    const {
      First_Name,
      Last_Name,
      Date_of_Birth,
      Email_ID,
      phone,
      address,
      Password,
      Gender,
      hospitalName,
      walletAddress
    } = req.body;

    // Validate all fields including walletAddress
    if (!First_Name || !Last_Name || !Date_of_Birth || !Email_ID || !phone || !address || !Password || !Gender || !hospitalName || !walletAddress) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const dateOfBirthObj = new Date(Date_of_Birth);

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
        walletAddress,           // include walletAddress here
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

    // Handle unique constraint errors, now including walletAddress
    if (error.code === "P2002") {
      return res.status(400).json({
        message: `A Patient with this ${error.meta?.target} already exists.`,
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

