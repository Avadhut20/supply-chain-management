const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const router = express.Router();
router.use(cors());
router.use(express.json());
const bcrypt = require("bcrypt");
const dotenv  = require("dotenv");
dotenv.config();

const prisma = new PrismaClient();

router.get("/check",(req,res)=>{
    res.send("Dsdsds");
})

router.post('/signup', async (req, res) => {
    console.log("SDsdsd");
   
  const { Hosptial_Name, Email_ID, Mobile, Password, Address, Wallet_Address } = req.body;


  if (!Hosptial_Name || !Email_ID || !Mobile || !Password || !Address || !Wallet_Address) {
     console.log("Sds");
    return res.status(400).json({ message: 'All fields including wallet address are required' });
  }
 
  try {
    // Hash password before storing
    // const hashedPassword = await bcrypt.hash(Password, 10);

    const hospital = await prisma.hospital.create({
      data: {
        Hosptial_Name,
        Email_ID,
        Mobile,
        Password,
        Address,
        Wallet_Address,
      },
    });

    res.status(201).json({ message: 'Hospital registered successfully', hospital });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') { // Prisma unique constraint violation
      return res.status(409).json({ message: 'Hospital with provided details already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});


const verifyHospitalToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        console.log("into auth 2 ")
        return res.status(401).json({ message: "No token provided" });
    }
 
    try {
        console.log("fsdsd--> "+ process.env.JWT_SECRET)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        if (decoded.role !== "HOSPITAL") {
          
            return res.status(403).json({ message: "Access denied" });
        }
        
        
        req.hospitalId = decoded.id; // Assign hospital ID to the request
        // console.log(req.hospitalId);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

router.get("/patients", verifyHospitalToken, async (req, res) => {
    try {
        const id = req.hospitalId; // Get hospital ID from the request object
        
        // Fetch the hospital name using the hospital ID
        const hospital = await prisma.hospital.findUnique({
            where: { Hosptial_id: id },
            select: { Hosptial_Name: true }, // Only select the hospital name
        });
       
          console.log("SDskdmskdmskmdksmdks");
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
        // if (patients.length === 0) {
        //     return res.status(200).json({ message: "No patients found for this hospital" });
        // }

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

router.post("/createblockchain", verifyHospitalToken, async (req, res) => {
    try {
        const {
            EmailID,
            BirthDate,
            DiseaseFirst,
            DiseaseSecond,
            DiseaseThird,
            DiseaseFour,
            DiseaseFive,
            DiseaseSix,
        } = req.body;
        console.log("sdsdsds");
        const birthDate = new Date(BirthDate);
        if (isNaN(birthDate.getTime())) {
            return res.status(400).json({ message: "Invalid BirthDate format" });
        }

        
        const newBlockchainRecord = await prisma.blockchain.create({
            data: {
                EmailID,
                BirthDate: birthDate,
                DiseaseFirst,
                DiseaseSecond,
                DiseaseThird,
                DiseaseFour,
                DiseaseFive,
                DiseaseSix,
            },
        });
        res.status(201).json({ message: "Blockchain record created successfully", data: newBlockchainRecord });
    } catch (error) {
        console.error("Error creating blockchain record:", error);
        console.log("hui hui hui hui ")
        res.status(500).json({ message: "Failed to create blockchain record", error: error.message });
    }
});

// router.post("/prescription",async (req, res) => {
//     const {
//         PID,
//         First_Name,
//         Last_Name,
//         Date_of_Birth,
//         Mobile_No,
//         Email_ID ,  
//         Hospital ,  
//         Medicine  ,       
//         }= req.body;
//     try{
//         const parsedMedicine = typeof Medicine === "string" ? JSON.parse(Medicine) : Medicine;
//         const dob= new Date(Date_of_Birth);
//     // Create prescription in the database
//     const prescription = await prisma.medicine.create({
//       data: {
//         PID,
//         First_Name,
//         Last_Name,
//         Date_of_Birth:dob,
//         Mobile_No,
//         Email_ID,
//         Hospital,
//         Medicine: parsedMedicine, // Store as JSON
//       },
//     });
//         res.status(201).json({message:"Prescription created successfully",data:prescription});
//     }
//     catch(error){
//         console.error("Error creating prescription:", error);
//         res.status(500).json({message:"Failed to create prescription",error:error.message});
//     }
// })
router.get("/prescription/:id", verifyHospitalToken, async (req, res) => {
    const { id } = req.params;
    try {
        const prescription = await prisma.medicine.findUnique({ where: { PID: id } });
        if (!prescription) return res.status(404).json({ message: "Prescription not found" });

        res.json(prescription);
    } catch (error) {
        console.error("Error fetching prescription:", error);
        res.status(500).json({ message: "Failed to fetch prescription" });
    }
});



router.post("/fetchblockchain", verifyHospitalToken, async (req, res) => {
    try {
        const { EmailID, BirthDate } = req.body;
       
        if (!EmailID || !BirthDate) {
            return res.status(400).json({ message: "EmailID and BirthDate are required" });
        }

        // Convert to a JavaScript Date object
        const birthDateObj = new Date(BirthDate);
        if (isNaN(birthDateObj.getTime())) {
            return res.status(400).json({ message: "Invalid BirthDate format" });
        }

        // Query using Date object (not a formatted string)
        const blockchainRecord = await prisma.blockchain.findFirst({
            where: {
                EmailID: EmailID,
                BirthDate: birthDateObj, // ✅ Pass as Date object
            },
            select: {
                DiseaseFirst: true,
                DiseaseSecond: true,
                DiseaseThird: true,
                DiseaseFour: true,
                DiseaseFive: true,
                DiseaseSix: true,
            },
        });
       
        if (!blockchainRecord) {
            return res.status(404).json({ message: "No record found" });
        }

        
        const diseases = [
            blockchainRecord.DiseaseFirst || "",
            blockchainRecord.DiseaseSecond || "",
            blockchainRecord.DiseaseThird || "",
            blockchainRecord.DiseaseFour || "",
            blockchainRecord.DiseaseFive || "",
            blockchainRecord.DiseaseSix || "",
        ].filter(disease => disease.trim() !== "");

        res.status(200).json({ message: "Record found", diseases });

    } catch (error) {
        console.error("Error fetching blockchain record:", error);
        res.status(500).json({ message: "Failed to fetch blockchain record", error: error.message });
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





router.get("/manufacturers", verifyHospitalToken, async (req, res) => {
  try {
    const manufacturers = await prisma.manufacturer.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json(manufacturers);
  } catch (error) {
    console.error("Error fetching manufacturers:", error);
    res.status(500).json({ message: "Failed to fetch manufacturers" });
  }
});

// ✅ Route 2: Get medicines by manufacturerId (existing)
router.get("/manufacturers/medicines/:manufacturerId", verifyHospitalToken, async (req, res) => {
  const manufacturerId = parseInt(req.params.manufacturerId, 10);
  if (isNaN(manufacturerId)) {
    return res.status(400).json({ message: "Invalid manufacturer ID" });
  }

  try {
    const medicines = await prisma.product.findMany({
      where: { manufacturerId: manufacturerId },
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json({ medicines });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ message: "Failed to fetch medicines for manufacturer" });
  }
});

// ✅ Route 3: Get medicines by manufacturer name (NEW for frontend compatibility)
router.get("/medicines", verifyHospitalToken, async (req, res) => {
  const { manufacturer } = req.query;
  if (!manufacturer) {
    return res.status(400).json({ message: "Manufacturer name is required" });
  }

  try {
    const manufacturerRecord = await prisma.manufacturer.findUnique({
      where: { name: manufacturer },
      select: { id: true },
    });

    if (!manufacturerRecord) {
      return res.status(404).json({ message: "Manufacturer not found" });
    }

    const medicines = await prisma.product.findMany({
      where: { manufacturerId: manufacturerRecord.id },
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json({ medicines });
  } catch (error) {
    console.error("Error fetching medicines by manufacturer name:", error);
    res.status(500).json({ message: "Failed to fetch medicines" });
  }
});


router.post("/prescription", verifyHospitalToken, async (req, res) => {
  const hospitalId = req.hospitalId; // assuming token middleware sets req.hospital
  const { patientId, medicines, diseases } = req.body;
  console.log(medicines);
  try {
    const prescription = await prisma.prescription.create({
      data: {
        patientId: parseInt(patientId),
        hospitalId: parseInt(hospitalId),
        diseases, // String[] works as is

        // Nested create for medicines array of MedicineOrderItem
        medicines: {
          create: medicines.map((med) => ({
            disease: med.disease,
            medicineName: med.medicineName,
            companyName: med.companyName,
            quantity: med.quantity,
            productId:med.productId
          })),
        },
      },
      include: {
        medicines: true,
      },
    });

    res.status(201).json({
      message: "Prescription created successfully",
      data: prescription,
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({
      message: "Failed to create prescription",
      error: error.message,
    });
  }
});







module.exports = router; 
  