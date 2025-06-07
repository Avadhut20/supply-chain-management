const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    const token = jwt.sign({ dealerId: dealer.id }, "your-secret-key", {
      expiresIn: "1d",
    });

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

module.exports = router;
