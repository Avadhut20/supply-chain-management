const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const router = express.Router();
router.use(cors());


const prisma = new PrismaClient();

router.post("/signup", async (req, res) => {
    const { Hosptial_Name,Email_ID, Mobile, Password, Address, Patients } = req.body;
    try {
        // Check if the hospital already exists
        const existingHospital = await prisma.hospital.findFirst({
            where: { Email_ID: req.body.Email_ID }
        });

        if (existingHospital) {
            return res.status(400).json({ message: "Hospital already exists" });
        }

        // Create a new hospital
        const hospital = await prisma.hospital.create({
            data: {
                Hosptial_Name,
                Email_ID,
                Mobile,
                Password,
                Address,
                Patients:{ create: [] }
            }
        });

        res.status(201).json({ message: "Hospital registered successfully", hospital });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const verifyHospitalToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
        if (decoded.role !== "HOSPITAL") {
            return res.status(403).json({ message: "Access denied" });
        }
        req.hospitalId = decoded.id; // Assign hospital ID to the request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

router.get("/patients", verifyHospitalToken, async (req, res) => {
    try {
        const id = req.hospitalId; // Get hospital ID from the request object
        console.log(id);
        // Fetch the hospital name using the hospital ID
        const hospital = await prisma.hospital.findUnique({
            where: { Hosptial_id: id },
            select: { Hosptial_Name: true }, // Only select the hospital name
        });

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        // Fetch patients associated with the hospital name
        const patients = await prisma.patient.findMany({
            where: {
                hospitalName: hospital.Hosptial_Name, // Filter by hospital name
            },
            select: {
                P_ID: true,
                First_Name: true,
                Last_Name: true,
                Date_of_Birth: true,
                Email_ID: true,
                phone: true,
                address: true,
                Gender: true,
            },
        });

        // Handle the case where no patients are found
        if (patients.length === 0) {
            return res.status(404).json({ message: "No patients found for this hospital" });
        }

        // Return the list of patients
        return res.status(200).json({
            message: `Patients for hospital ${hospital.Hosptial_Name} retrieved successfully`,
            patients,
        });
    } catch (error) {
        console.error("Error fetching patients:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/hospitalsnames", async (req, res) => {
    try {
        const hospitals = await prisma.hospital.findMany({
            select: {
                Hosptial_Name: true,
            },
        });
        res.status(200).json(hospitals);
    } catch (error) {
        console.error("Error fetching hospitals:", error);
        res.status(500).json({ error: "An error occurred while fetching hospitals." });
    }
});
module.exports = router; 
  