const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

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
module.exports = router; // Export the route
  