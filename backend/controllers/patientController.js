const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
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

// GET /patient/medicines
// const verifyPatientToken = (req, res, next) => {
//   const token = req.headers.authorization;
//   console.log(token)
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     console.log(process.env.JWT_SECRET)
//     const decoded = jwt.verify(token, process.env.JWT_SECRET ||"secret" );
//     console.log("Decoded token:", decoded.id);
//     if (decoded.role !== "PATIENT") {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     req.P_ID  = decoded.id;
//     console.log(req.patientId)
//     next();
//     console.log("hi")
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// router.get("/medicines", verifyPatientToken, async (req, res) => {
//   const P_ID = req.P_ID ;

//   try {
//     const prescriptions = await prisma.prescription.findMany({
//       where: {
//         P_ID : P_ID ,
//       },
//       include: {
//         medicines: {
//           include: {
//             product: {
//               include: {
//                 manufacturer: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     // Flatten medicines from all prescriptions
//     const allMedicines = prescriptions.flatMap(p =>
//       p.medicines.map(m => ({
//         id: m.product.id,
//         name: m.product.name,
//         price: m.product.price,
//         manufacturer: {
//           name: m.product.manufacturer.name,
//         },
//         quantity: m.quantity,
//       }))
//     );

//     res.status(200).json(allMedicines);
//   } catch (error) {
//     console.error("Error fetching prescriptions:", error);
//     res.status(500).json({ message: "Failed to fetch prescribed medicines" });
//   }
// });



module.exports=router

