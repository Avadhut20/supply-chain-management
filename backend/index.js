const express = require("express");
const { PrismaClient } = require("@prisma/client");
const user = require("./controllers/userController");
const Patient = require("./controllers/patientController");
const Hospital = require("./controllers/hospitalController");
const Signin = require("./controllers/signincontroller");
const Insurance = require("./controllers/insuranceController");
const cors  = require("cors");
 
const app = express();
app.use(express.json());
app.use(cors());

app.use("/patient", Patient);
app.use("/hospital", Hospital);
app.use("/insurance", Insurance);
app.use("/auth", Signin);


app.get("/protected", async (req, res) => {
  const user = req.headers.authorization;

  if (!user || !user.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = user.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    res.status(200).json({ message: "Access granted", data: decoded });
  } catch (error) {
    console.error("Error in protected route:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
