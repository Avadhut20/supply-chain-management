const express= require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/signin", async (req, res) => {
    const {email,password, role}= req.body;
    if(role =='PATIENT'){
        const patient = await prisma.patient.findUnique({
            where:{
                Email_ID: email,
            },
        });
        if(!patient){
            return res.status(404).json({message:"User not found"});
        }
        if(patient.Password !== password){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const token = jwt.sign({id:patient. P_ID ,email:patient.Email_ID,role:"PATIENT"},process.env.JWT_SECRET || "your_jwt_secret",{
            expiresIn:"1h",
        });
        return res.status(200).json({message:"User signed in",token});
    }
    if (role =="HOSPITAL"){
        const hospital = await prisma.hospital.findUnique({
            where:{
                Email_ID: email,
            },
        });
        if(!hospital){
            return res.status(404).json({message:"User not found"});
        }
        if(hospital.Password !== password){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const token = jwt.sign({id:hospital.Hosptial_id,email:hospital.Email_ID,name:hospital.Hosptial_Name,role:"HOSPITAL"},process.env.JWT_SECRET || "your_jwt_secret",{
            expiresIn:"1h",
        });
        return res.status(200).json({message:"User signed in",token});
    }
})

module.exports = router;