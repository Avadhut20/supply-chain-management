const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const {
      FirstName,
      LastName,
      Email,
      DOB,
      Gender,
      Mobile,
      Password,
      WalletAddress,
    } = req.body;

    if (
      !FirstName ||
      !LastName ||
      !Email ||
      !DOB ||
      !Gender ||
      !Mobile ||
      !Password ||
      !WalletAddress
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingDealer = await prisma.dealer.findFirst({
      where: { OR: [{ Email }, { WalletAddress }] },
    });

    if (existingDealer) {
      return res
        .status(400)
        .json({ message: "Dealer with same email or wallet already exists." });
    }

    // const hashedPassword = await bcrypt.hash(Password, 10);

    const dealer = await prisma.dealer.create({
      data: {
        FirstName,
        LastName,
        Email,
        DOB: new Date(DOB),
        Gender,
        Mobile,
        Password,
        WalletAddress,
      },
    });

    res.status(201).json({ message: "Dealer registered successfully", dealer });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// SIGNIN
router.post("/signin", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const dealer = await prisma.dealer.findUnique({
      where: { Email },
    });

    if (!dealer) {
      return res.status(400).json({ message: "Dealer not found." });
    }

    const isMatch = await bcrypt.compare(Password, dealer.Password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const name = `${dealer.FirstName} ${dealer.LastName}`;
    const token = jwt.sign({ dealerId: dealer.id }, process.env.JWT_SECRET|| "secret");

    res.status(200).json({
      message: "Signin successful",
      dealer: {
        id: dealer.id,
        name: dealer.FirstName + " " + dealer.LastName,
        wallet: dealer.WalletAddress,
      },
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const dealerAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log("Authorization Header:", authHeader);

    if (!authHeader ) {
      return res.status(401).json({ message: "Authorization header missing or malformed" });
    }
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET || "secret");
    // console.log("Decoded JWT:", decoded);
    if (decoded.role !== "DEALER") {
      return res.status(403).json({ message: "Access denied. Not a dealer." });
    }
       console.log("sdsd");
    // Optional: Fetch dealer from DB if you want to attach it to req
    const dealer = await prisma.dealer.findUnique({
      where: { id: decoded.id },
    });

    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }
   
    console.log(dealer);
    req.dealer = dealer; // Attach dealer data to request object
    next();
  } catch (err) {
    console.error("Dealer Auth Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};



router.post("/deliver/:orderItemId",dealerAuthMiddleware,async (req,res)=>{
  const orderItemId = parseInt(req.params.orderItemId);

  try {
    const orderItem = await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        status: "DELIVERED",
      },
    });

    await prisma.shipmentLog.create({
      data: {
        orderItemId: orderItem.id,
        fromRole: "DEALER",
        toRole: "PATIENT",
        statusNote: "Medicine delivered by dealer",
      },
    });

    return res.json({ success: true, message: "Order marked as delivered" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update delivery status." });
  }
});




router.get("/pending-orders", dealerAuthMiddleware, async (req, res) => {
  try {
    const dealerId = req.dealer.id;
    console.log("✅ Dealer ID:", dealerId);

    const pendingOrders = await prisma.orderItem.findMany({
      where: {
        dealerId,
        status: "PENDING",
      },
      include: {
        patientOrder: {
          include: {
            patient: {
              include: {
                Hospital: true,
              },
            },
          },
        },
        product: {
          include: {
            manufacturer: true,
          },
        },
      },
    });

    console.log("🔍 Raw pending orders:", JSON.stringify(pendingOrders, null, 2));

    const orders = pendingOrders.map((order, idx) => {
      const patient = order.patientOrder?.patient;
      const hospital = patient?.Hospital;
      const manufacturer = order.product?.manufacturer;

      console.log(`🔹 Order #${idx + 1}`);
      console.log("📦 Medicine:", order.product?.name);
      console.log("🏭 Manufacturer ID:", manufacturer?.id);
      console.log("🏭 Manufacturer wallet:", manufacturer?.walletAddress);
      console.log("🏥 Hospital wallet:", hospital?.Wallet_Address);

      return {
        id: order.id,
        onChainOrderId: order.onChainOrderId, // ✅ Include this
        patientName: `${patient?.First_Name || "Unknown"} ${patient?.Last_Name || ""}`,
        medicineName: order.product?.name || "Unknown",
        hospitalName: hospital?.Hosptial_Name || "N/A", // ✅ Fixed name
        quantity: order.quantity,
        price: order.product?.price || 0,
        manufacturerWalletAddress: manufacturer?.walletAddress || "",
        hospitalWalletAddress: hospital?.Wallet_Address || "",
      };
    });

    return res.json({ orders });
  } catch (error) {
    console.error("❌ Error fetching pending orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});





// POST /dealer/buy/:orderItemId
// POST /dealer/buy/:orderItemId
router.post("/buy/:orderItemId", dealerAuthMiddleware, async (req, res) => {
  try {
    const dealerId = req.dealer.id;
    const orderItemId = parseInt(req.params.orderItemId);
    const { onChainOrderId } = req.body;

    console.log("Dealer ID:", dealerId);
    console.log("Order Item ID:", orderItemId);
    console.log("onChainOrderId:", onChainOrderId);

    // Validate that it's a non-empty string
    if (!onChainOrderId || typeof onChainOrderId !== "string") {
      return res
        .status(400)
        .json({ error: "onChainOrderId is required and must be a string" });
    }

    // Step 1: Validate the order item
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        manufacturer: true,
        patientOrder: true,
      },
    });

    if (!orderItem)
      return res.status(404).json({ error: "Order item not found" });

    if (orderItem.dealerId !== dealerId)
      return res
        .status(403)
        .json({ error: "Not authorized to buy this order item" });

    if (
      orderItem.status !== "PENDING" &&
      orderItem.status?.toUpperCase() !== "PENDING"
    ) {
      return res
        .status(400)
        .json({ error: `Order item is not pending (status: ${orderItem.status})` });
    }

    // Step 2: Save the onChainOrderId as string and update status
    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        status: "BOUGHT",
        onChainOrderId, // Save directly as string
      },
    });

    // Step 3: Log the shipment to notify manufacturer
    await prisma.shipmentLog.create({
      data: {
        orderItemId: orderItemId,
        fromRole: "MANUFACTURER",
        toRole: "DEALER",
        statusNote: "Order bought by dealer, please ship medicines",
      },
    });

    return res.json({
      success: true,
      message: "Order item marked as bought and shipment requested.",
    });
  } catch (error) {
    console.error("Error processing order item buy:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});




// GET /dealer/receive-orders - fetch orders shipped by manufacturer
router.get("/receive-orders", dealerAuthMiddleware, async (req, res) => {
  try {
    const dealerId = req.dealer.id;

    // Fetch all shipped orders assigned to this dealer
    const shippedOrders = await prisma.orderItem.findMany({
      where: {
        dealerId,
        status: "SHIPPED",
      },
      include: {
        patientOrder: {
          include: {
            patient: true,
          },
        },
        product: true,
      },
    });


      // Optional debug log
    if (shippedOrders.length > 0) {
      console.log("Sample patient info:", shippedOrders[0]?.patientOrder?.patient);
    } else {
      console.log("No pending orders found.");
    }

   

    const formatted = shippedOrders.map((order) => ({
      id: order.id,
      patientName:  `${order.patientOrder.patient.First_Name} ${order.patientOrder.patient.Last_Name}`,
      patientEmail: req.dealer.Email,
      medicineName: order.product.name,
       price: order.product.price,
      quantity: order.quantity,
      onChainOrderId: order.onChainOrderId, // Include this for on-chain tracking
    }));

    return res.json({ orders: formatted });
  } catch (err) {
    console.error("Error fetching dealer receive orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// POST /dealer/ship/:orderItemId
router.post("/ship/:orderItemId", dealerAuthMiddleware, async (req, res) => {
  try {
    const dealerId = req.dealer.id;
    const orderItemId = parseInt(req.params.orderItemId);

    // Get the order item
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
    });

    if (!orderItem) {
      return res.status(404).json({ error: "Order item not found" });
    }

    if (orderItem.dealerId !== dealerId) {
      return res.status(403).json({ error: "Not authorized to ship this order" });
    }

    if (orderItem.status !== "SHIPPED") {
      return res.status(400).json({ error: "Order must be bought before shipping" });
    }

    // Update status to DELIVERED
    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        status: "SHIPPED_DEALER",
      },
    });

    // Create shipment log
    await prisma.shipmentLog.create({
      data: {
        orderItemId,
        fromRole: "DEALER",
        toRole: "PATIENT",
        statusNote: "Order shipped to patient",
      },
    });

    res.json({ success: true, message: "Order shipped to patient successfully" });
  } catch (error) {
    console.error("Error in shipping order:", error);
    res.status(500).json({ error: "Failed to ship the order" });
  }
});


module.exports = router;
