const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();
router.use(cors());
router.use(express());
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");



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


const verifyPatientToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    if (decoded.role !== "PATIENT") {
      return res.status(403).json({ message: "Access denied" });
    }
    req.P_ID = decoded.id;
    console.log("Patient ID from token:", req.P_ID);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

  router.get("/medicines", verifyPatientToken, async (req, res) => {
    const P_ID = req.P_ID ;

    try {
      const prescriptions = await prisma.prescription.findMany({
        where: {
        patientId : P_ID ,
        },
        include: {
          medicines: {
            include: {
              product: {
                include: {
                  manufacturer: true,
                },
              },
            },
          },
        },
      });

      // Flatten medicines from all prescriptions
      const allMedicines = prescriptions.flatMap(p =>
        p.medicines.map(m => ({
          id: m.product.id,
          name: m.product.name,
          price: m.product.price,
          manufacturer: {
            name: m.product.manufacturer.name,
          },
          quantity: m.quantity,
        }))
      );

      res.status(200).json(allMedicines);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      res.status(500).json({ message: "Failed to fetch prescribed medicines" });
    }
  });
router.get("/receive-orders", verifyPatientToken, async (req, res) => {
  try {
    const patientId = req.P_ID;

    const deliveredOrders = await prisma.orderItem.findMany({
      where: {
        status: "SHIPPED_DEALER",
        patientOrder: {
          patientId,
        },
      },
      include: {
        product: true,
        dealer: true,
      },
    });

    const orders = deliveredOrders.map((item) => ({
      id: item.id,
      medicineName: item.product.name,
      quantity: item.quantity,
      dealerName: `${item.dealer.FirstName} ${item.dealer.LastName}`,
    }));

    res.json({ orders });
  } catch (err) {
    console.error("Error fetching receive-orders:", err);
    res.status(500).json({ error: "Failed to fetch receive-orders" });
  }
});
router.post("/receive/:orderItemId", verifyPatientToken, async (req, res) => {
  try {
    const orderItemId = parseInt(req.params.orderItemId);

    const order = await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        status: "DELIVERED",
      },
    });

    await prisma.shipmentLog.create({
      data: {
        orderItemId,
        fromRole: "DEALER",
        toRole: "PATIENT",
        statusNote: "Order received by patient",
      },
    });

    res.json({ message: "Order marked as received." });
  } catch (error) {
    console.error("Error receiving order:", error);
    res.status(500).json({ error: "Failed to mark as received." });
  }
});
// GET /patient/purchase-history
router.get("/purchase-history", verifyPatientToken, async (req, res) => {
  try {
    const patientId = req.P_ID;

    const receivedOrders = await prisma.orderItem.findMany({
      where: {
        status: "DELIVERED",
        patientOrder: {
          patientId,
        },
      },
      include: {
        product: true,
        dealer: true,
      },
      
    });

    const orders = receivedOrders.map((item) => ({
      id: item.id,
      medicineName: item.product.name,
      quantity: item.quantity,
      dealerName: `${item.dealer.FirstName} ${item.dealer.LastName}`,
      
    }));

    res.json({ orders });
  } catch (err) {
    console.error("Error fetching purchase history:", err);
    res.status(500).json({ error: "Failed to fetch purchase history" });
  }
});



 router.post("/buy/:productId", verifyPatientToken, async (req, res) => {
  const productId = parseInt(req.params.productId);

  try {
    // Use the patient ID from token middleware
    const patient = await prisma.patient.findUnique({
      where: { P_ID: req.P_ID },
    });
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    // Rest of your code as is...
    let order = await prisma.patientOrder.findFirst({
      where: { patientId: patient.P_ID, status: "Placed" },
    });

    if (!order) {
      order = await prisma.patientOrder.create({
        data: {
          patientId: patient.P_ID,
          status: "Placed",
        },
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { manufacturer: true },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    const dealer = await prisma.dealer.findFirst();
    if (!dealer) return res.status(400).json({ error: "No dealer found" });

    const orderItem = await prisma.orderItem.create({
      data: {
        patientOrderId: order.id,
        productId: product.id,
        quantity: 1,
        dealerId: dealer.id,
        manufacturerId: product.manufacturerId,
        status: "PENDING",
      },
    });

    await prisma.shipmentLog.create({
      data: {
        orderItemId: orderItem.id,
        fromRole: "PATIENT",
        toRole: "DEALER",
        statusNote: "Order placed by patient",
      },
    });

    return res.json({ success: true, message: "Order placed successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
});


module.exports=router

