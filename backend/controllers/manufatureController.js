const express= require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require("@prisma/client");
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
const prisma = new PrismaClient();

router.use(cors());
router.use(express.json());

router.post("/signup", async (req, res) => {
  const { name, email, password, walletAddress } = req.body;

  try {
    // Only check for email, not walletAddress
    const existingManufacturer = await prisma.manufacturer.findUnique({
      where: { email },
    });

    if (existingManufacturer) {
      return res.status(400).json({ message: "Manufacturer with this email already exists" });
    }

    const newManufacturer = await prisma.manufacturer.create({
      data: {
        name,
        email,
        password, // not hashed as per your request
        walletAddress,
      }
    });

    res.status(201).json({ message: "Manufacturer registered successfully", manufacturer: newManufacturer });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



const authenticateManufacturer = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Check if token is provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Received token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    if (decoded.role !== "MANUFACTURE") {
      return res.status(403).json({ message: "Access denied. Not a manufacturer." });
    }

    // Optional: fetch and attach manufacturer object to request
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id: decoded.id },
    });

    if (!manufacturer) {
      return res.status(404).json({ message: "Manufacturer not found" });
    }

    req.manufacturer = manufacturer; // ✅ attach to request for downstream use
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};


router.post("/medicine/create", authenticateManufacturer, async (req, res) => {
  const { name, description, price, stock, category } = req.body;

  try {
    // Manufacturer is attached from middleware
    const manufacturerId = req.manufacturer.id;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        category,
        manufacturerId,
      },
    });

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/medicine/all", authenticateManufacturer, async (req, res) => {
  try {
    const manufacturerId = req.manufacturer.id;

    const products = await prisma.product.findMany({
      where: { manufacturerId },
      orderBy: { id: "desc" },
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/pending-orders", authenticateManufacturer, async (req, res) => {
  try {
    const manufacturerId = req.manufacturer.id;

    const pendingOrders = await prisma.orderItem.findMany({
      where: {
        manufacturerId,
        status: "BOUGHT",
      },
      include: {
        product: true,
        patientOrder: {
          include: {
            patient: true,
          },
        },
        dealer: true,
      },
    });

    const formatted = pendingOrders.map(order => ({
      id: order.id,
      medicineName: order.product.name,
      quantity: order.quantity,
      dealerName: order.dealer?.FirstName + " " + order.dealer?.LastName,
      hospitalName: order.patientOrder.patient.hospitalName || "N/A",
    }));

    res.json({ orders: formatted });
  } catch (err) {
    console.error("Error fetching manufacturer orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------- MARK ORDER AS SHIPPED ----------------------- */
router.post("/ship/:orderItemId", authenticateManufacturer, async (req, res) => {
  try {
    const orderItemId = parseInt(req.params.orderItemId);

    const orderItem = await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        status: "SHIPPED",
      },
    });

    await prisma.shipmentLog.create({
      data: {
        orderItemId: orderItem.id,
        fromRole: "MANUFACTURER",
        toRole: "DEALER",
        statusNote: "Order shipped by manufacturer",
      },
    });

    res.json({ success: true, message: "Order marked as shipped" });
  } catch (err) {
    console.error("Error shipping order:", err);
    res.status(500).json({ message: "Failed to update shipment status" });
  }
});


module.exports = router;

module.exports=router