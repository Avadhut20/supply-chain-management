const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();
const cors = require('cors')
router.use(cors());
const JWT_SECRET = process.env.JWT_SECRET || "secret";

router.post("/signup", async (req, res) => {
  const { username, email,password, role } = req.body;

  console.log(username)
  if (!username || !password || !role || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    
    const existingUser = await prisma.user.findFirst({
      where: {
            email:req.body.email
      }
    
      });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const newUser = await prisma.user.create({
      data: { username, password: password, role,email },
    });

    res.status(201).json({ message: "User registered successfully", user: newUser ,role});
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/signin", async (req, res) => {
  const { email,password, role } = req.body;

  if (!email || !password ||!role ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await prisma.user.findFirst({
        where: {
          AND: [
            { email: req.body.email },
            { role: req.body.role }
          ]
          
          
        },
      });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   
    if(password!==user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: " Signin successful" , token,role });
  } catch (error) {
    console.error("Error in signin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
