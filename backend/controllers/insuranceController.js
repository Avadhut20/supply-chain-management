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
  try {
    const { name, email, mobile, address, password, walletAddress } = req.body;

    if (!name || !email || !mobile || !address || !password || !walletAddress) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const insurance = await prisma.insurance.create({
      data: {
        Name: name,
        Email_id: email,
        Mobile_No: mobile,
        Address: address,
        Passwords: password,
        walletAddress,
      }
    });

    res.status(201).json({ message: "Insurance registered successfully", insurance });
  } catch (error) {
    console.error("Error in signup:", error);

    if (error.code === "P2002") {
      return res.status(400).json({
        message: `An insurance with this ${error.meta?.target} already exists.`,
        field: error.meta?.target
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
});



function verifyInsuranceToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        
        return res.status(401).json({ message: "No token provided" });
    }
console.log(token)
    try {
        console.log(process.env.JWT_SECRET)
        const decoded = jwt.verify(token,  process.env.JWT_SECRET|| "secret");
        console.log("hi")
        if (decoded.role !== "INSURANCE") {
            return res.status(403).json({ message: "Access denied" });
        }
        req.insuranceId = decoded.id; // Assign insurance ID to the request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}


 function patientAuth(req,res,next){
   
    const token = req.headers.authorization;
    console.log("into auth")
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
        
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        if (decoded.role !== "PATIENT") {
            return res.status(403).json({ message: "Access denied" });
        }
        console.log("decoded info " + decoded.name)
        req.patientId = decoded.id; // Assign insurance ID to the request
        req.patientEmail = decoded.email;
        req.patientName =  decoded.name;
        
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


router.get("/insurenceHistory",verifyInsuranceToken,async (req, res) => {

    try{
        const data= await prisma.patientInsuranceInfo.findMany({
            where:{
                CompanyID:req.insuranceId
            },
            select:{
         PatientName:true,
          PatientID:true,
          PatientEmail:true,
          CompanyName:true ,
          CompanyID:true ,
          Mobile_Number:true ,
          Website:true ,
          Address:true ,
          Policy_No:true ,
          Policy_Name:true ,
          Policy_Tenue:true ,
          Base_Premium:true ,
          Coverage_Info:true ,
          Policy_Amount:true ,
          CompanyEmail_ID:true 

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




router.get("/PatientinsurenceHistory",patientAuth,async (req, res) => {

    try{
        console.log("dskdmskds  " +  req.patientId )
        const data= await prisma.patientInsuranceInfo.findMany({
            where:{
                PatientID:req.patientId
            },

            select:{
         PatientName:true,
          PatientID:true,
          PatientEmail:true,
          CompanyName:true ,
          CompanyID:true ,
          Mobile_Number:true ,
          Website:true ,
          Address:true ,
          Policy_No:true ,
          Policy_Name:true ,
          Policy_Tenue:true ,
          Base_Premium:true ,
          Coverage_Info:true ,
          Policy_Amount:true ,
          CompanyEmail_ID:true 
            }
            
        })
        if(data.length===0){
            return res.status(404).json({message:"No insurance companies found"});
            console.log("smdkskd")
        }
        res.status(200).json({ message: "Insurance companies retrieved successfully", data });
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "Internal server error" });
    }
})



router.post("/patientInsurenceInfo",patientAuth, async (req,res)=>{
    try{
        // console.log(req.body)
     const PatientEmail=req.patientEmail;
     const PatientID  = req.patientId;
     const PatientName = req.patientName;
   
      const response = await prisma.patientInsuranceInfo.create({
        data:{
          PatientName,
          PatientID,
          PatientEmail,
          CompanyName:   req.body.CompanyName,
          CompanyID:     req.body.CompanyID,
          Mobile_Number: req.body.Mobile_Number,
          Website:       req.body.Website,
          Address:       req.body.Address,
          Policy_No:     req.body.Policy_No,
          Policy_Name:   req.body.Policy_Name,
          Policy_Tenue: parseInt( req.body.Policy_Tenue),
          Base_Premium: parseFloat( req.body.Base_Premium),
          Coverage_Info: req.body.Coverage_Info,
          Policy_Amount:  parseFloat(req.body.Policy_Amount),
          CompanyEmail_ID: req.body.CompanyEmail_ID
        }
      })
      
      res.status(200).json({ message: " Insurance Purchased Successfully ", response });
   

   }
   catch(error){
    console.error("Error purchasing insurance:", error);  // Log full error
  res.status(500).json({ message: "Failed to purchase insurance", error: error.message });
   }

} )

module.exports = router;