const express= require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require("@prisma/client");
const cors = require('cors');
const prisma = new PrismaClient();

router.use(cors());
router.use(express.json());

router.post("/signup",async (req, res) => {
    const { name, email, mobile,address, password } = req.body;
    try {
        // Check if the insurance already exists
        const existingInsurance = await prisma.insurance.findFirst({
            where: { Email_id: req.body.email }
        });

        if (existingInsurance) {
            return res.status(400).json({ message: "Insurance already exists" });
        }

        // Hash the password before storing it
       

        // Create a new insurance
        const insurance = await prisma.insurance.create({
            data: {
                Name:name,
                Email_id:email,
                Mobile_No:mobile,
                Address:address,
                Passwords: password,
                
            }
        });

        res.status(201).json({ message: "Insurance registered successfully", insurance });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

function verifyInsuranceToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
        if (decoded.role !== "INSURANCE") {
            return res.status(403).json({ message: "Access denied" });
        }
        req.insuranceId = decoded.id; // Assign insurance ID to the request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
router.post("/insurancedetails",verifyInsuranceToken,async (req,res)=>{
    const insuranceId = req.insuranceId;
    try {
        const {email,
            companyName,
            mobile,
            website,
            address,
            policyNo,
            policyName,
            policyTenure,
            basePremium,
            coverage,
            policyAmount}= req.body;

            const amt= parseFloat(policyAmount);
            const basepremium= parseFloat(basePremium);
            const tenure= parseInt(policyTenure);
        const insuranceDetail= await prisma.insuranceDetails.create({
            data:{
                T_ID:insuranceId,
                Email_id:email,
                CompanyName:companyName,
                Mobile_Number:mobile,
                Website:website,
                Address:address,
                Policy_No:policyNo, 
                Policy_Name:policyName,
                Policy_Tenure:tenure,
                Base_Premium:basepremium,
                Coverage:coverage,
                Policy_Amount:amt,
            }
        })
        res.status(200).json({ message: "Insurance details retrieved successfully", insuranceDetail, insuranceId });
    } catch (error) {
        console.error("Error in retrieving insurance details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})
router.get("/list",async (req, res) => {
    try{
        const data= await prisma.insuranceDetails.findMany({
            select:{
                T_ID:true,
                Email_id:true,
                Mobile_Number:true,
                Website:true,
                Address:true,
                Policy_No:true,
                Coverage:true,
                CompanyName:true,
                Policy_Name:true,
                Policy_Amount:true,
                Base_Premium:true,
                Policy_Tenure:true,
            }
        })
        if(data.length===0){
            return res.status(404).json({message:"No insurance companies found"});
        }
        res.status(200).json({ message: "Insurance companies retrieved successfully", data });
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = router;