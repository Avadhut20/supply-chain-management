const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// const bcrypt = require("bcrypt")
const dotenv = require("dotenv");
dotenv.config();

router.post("/signin", async (req, res) => {
  const { email, password, role, walletOnly } = req.body;

  try {
    if (role === "PATIENT") {
      const patient = await prisma.patient.findUnique({ where: { Email_ID: email } });
      if (!patient) return res.status(404).json({ message: "User not found" });
      if (walletOnly) return res.status(200).json({ walletAddress: null }); // No wallet

      if (patient.Password !== password) return res.status(401).json({ message: "Invalid credentials" });

      const name = `${patient.First_Name} ${patient.Last_Name}`;
      const token = jwt.sign({ id: patient.P_ID, email, name, role }, process.env.JWT_SECRET || "secret");
      return res.status(200).json({ message: "User signed in", token });
    }

    if (role === "HOSPITAL") {
      const hospital = await prisma.hospital.findUnique({ where: { Email_ID: email } });
      if (!hospital) return res.status(404).json({ message: "User not found" });
      if (walletOnly) return res.status(200).json({ walletAddress: hospital.Wallet_Address });

      if (hospital.Password !== password) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: hospital.Hosptial_id, email, name: hospital.Hosptial_Name, role },
        process.env.JWT_SECRET || "secret"
      );
      return res.status(200).json({ message: "User signed in", token, walletAddress: hospital.Wallet_Address });
    }

    if (role === "INSURANCE") {
      const insurance = await prisma.insurance.findUnique({ where: { Email_id: email } });
      if (!insurance) return res.status(404).json({ message: "User not found" });
      if (walletOnly) return res.status(200).json({ walletAddress: null }); // No wallet

      if (insurance.Passwords !== password) return res.status(401).json({ message: "Invalid credentials" });
      console.log(process.env.JWT_SECRET)
      const token = jwt.sign(
        { id: insurance.T_ID, email, name: insurance.Name, role },
        process.env.JWT_SECRET || "secret"
      );
      
      return res.status(200).json({ message: "User signed in", token });
    }




    if (role === "DEALER") {
      const dealer = await prisma.dealer.findUnique({ where: { Email: email } });
      if (!dealer) return res.status(404).json({ message: "User not found" });
      if (walletOnly) return res.status(200).json({ walletAddress: dealer.WalletAddress });

      if (dealer.Password !== password) return res.status(401).json({ message: "Invalid credentials" });

      const name = `${dealer.FirstName} ${dealer.LastName}`;
      const token = jwt.sign({ id: dealer.id, email, name, role }, process.env.JWT_SECRET || "secret");
      return res.status(200).json({ message: "User signed in", token, walletAddress: dealer.WalletAddress });
    }

          
    if (role === "MANUFACTURE") {
  const manufacturer = await prisma.manufacturer.findUnique({ where: { email } });
  if (!manufacturer) return res.status(404).json({ message: "User not found" });

  if (walletOnly) return res.status(200).json({ walletAddress: manufacturer.walletAddress });

  if (manufacturer.password !== password) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: manufacturer.id, email, name: manufacturer.name, role },
    process.env.JWT_SECRET || "secret"
  );

  return res.status(200).json({ message: "User signed in", token, walletAddress: manufacturer.walletAddress });
}



    return res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    console.error("Sign-in error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
