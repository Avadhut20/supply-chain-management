-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DEALER', 'HOSPITAL', 'INSURANCE', 'PATIENT');

-- CreateTable
CREATE TABLE "Patient" (
    "P_ID" SERIAL NOT NULL,
    "First_Name" TEXT NOT NULL,
    "Middle_Name" TEXT,
    "Last_Name" TEXT NOT NULL,
    "Date_of_Birth" TIMESTAMP(3) NOT NULL,
    "Email_ID" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("P_ID")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "ID" SERIAL NOT NULL,
    "Email_ID" TEXT NOT NULL,
    "Username" TEXT NOT NULL DEFAULT 'admin',
    "Password" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Dealer" (
    "id" SERIAL NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "DOB" TIMESTAMP(3) NOT NULL,
    "Gender" TEXT NOT NULL,
    "Mobile" TEXT NOT NULL,
    "Password" VARCHAR(8) NOT NULL DEFAULT 'ot',
    "Status" TEXT NOT NULL,

    CONSTRAINT "Dealer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "Patient_ID" INTEGER NOT NULL,
    "Email_ID" TEXT NOT NULL,
    "Mobile" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "Gender" TEXT NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("Patient_ID")
);

-- CreateTable
CREATE TABLE "HospitalInfo" (
    "Patient_ID" INTEGER NOT NULL,
    "PatientEmail" TEXT NOT NULL,
    "InsuranceCompany" TEXT NOT NULL,
    "PolicyName" TEXT NOT NULL,
    "Months" INTEGER NOT NULL,
    "CoverageMsg" TEXT NOT NULL,
    "HospitalEmailID" TEXT NOT NULL,

    CONSTRAINT "HospitalInfo_pkey" PRIMARY KEY ("Patient_ID")
);

-- CreateTable
CREATE TABLE "Blockchain" (
    "Transaction_ID" SERIAL NOT NULL,
    "HospitalEmailID" TEXT NOT NULL,
    "BlockData" TEXT NOT NULL,
    "CurrentTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blockchain_pkey" PRIMARY KEY ("Transaction_ID")
);

-- CreateTable
CREATE TABLE "Insurance" (
    "T_ID" SERIAL NOT NULL,
    "PatientName" TEXT NOT NULL,
    "PatientEmail" TEXT NOT NULL,
    "CompanyName" TEXT NOT NULL,
    "Mobile_Number" TEXT NOT NULL,
    "Website" TEXT,
    "Address" TEXT NOT NULL,
    "Policy_No" TEXT NOT NULL,
    "Policy_Name" TEXT NOT NULL,
    "Policy_Tenue" INTEGER NOT NULL,
    "Base_Premium" DOUBLE PRECISION NOT NULL,
    "Coverage_Info" TEXT NOT NULL,
    "Policy_Amount" DOUBLE PRECISION NOT NULL,
    "Email_IDs" TEXT NOT NULL,

    CONSTRAINT "Insurance_pkey" PRIMARY KEY ("T_ID")
);

-- CreateTable
CREATE TABLE "InsuranceInfo" (
    "I_IDs" SERIAL NOT NULL,
    "PatientName" TEXT NOT NULL,
    "PatientEmail" TEXT NOT NULL,
    "InsuranceCompany" TEXT NOT NULL,
    "Policy_Name" TEXT NOT NULL,
    "Months" INTEGER NOT NULL,
    "Coverage_Msg" TEXT NOT NULL,

    CONSTRAINT "InsuranceInfo_pkey" PRIMARY KEY ("I_IDs")
);

-- CreateTable
CREATE TABLE "PatientInsurance" (
    "ID_Patient" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Email_IDs" TEXT NOT NULL,
    "Mobile_No" TEXT NOT NULL,
    "Passwords" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "Gender" TEXT NOT NULL,

    CONSTRAINT "PatientInsurance_pkey" PRIMARY KEY ("ID_Patient")
);

-- CreateTable
CREATE TABLE "InsuranceDetails" (
    "T_ID" SERIAL NOT NULL,
    "Email_IDs" TEXT NOT NULL,
    "CompanyName" TEXT NOT NULL,
    "Mobile_Number" TEXT NOT NULL,
    "Website" TEXT,
    "Address" TEXT NOT NULL,
    "Policy_No" TEXT NOT NULL,
    "Policy_Name" TEXT NOT NULL,
    "Policy_Tenue" INTEGER NOT NULL,
    "Base_Premium" DOUBLE PRECISION NOT NULL,
    "Coverage_Info" TEXT NOT NULL,
    "Policy_Amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "InsuranceDetails_pkey" PRIMARY KEY ("T_ID")
);

-- CreateTable
CREATE TABLE "Master" (
    "Trans_ID" SERIAL NOT NULL,
    "Transaction_Hash" TEXT NOT NULL,
    "FromName" TEXT NOT NULL,
    "ToName" TEXT NOT NULL,
    "NonceData" TEXT NOT NULL,
    "PreViewHash" TEXT NOT NULL,
    "DiseaseFirst" TEXT NOT NULL,
    "DiseaseSecond" TEXT NOT NULL,
    "DiseaseThird" TEXT NOT NULL,
    "DiseaseFour" TEXT NOT NULL,
    "DiseaseFive" TEXT NOT NULL,
    "DiseaseSix" TEXT NOT NULL,

    CONSTRAINT "Master_pkey" PRIMARY KEY ("Trans_ID")
);

-- CreateTable
CREATE TABLE "NewPatients" (
    "PID" SERIAL NOT NULL,
    "First_Name" TEXT NOT NULL,
    "Middle_Name" TEXT NOT NULL,
    "Last_Name" TEXT NOT NULL,
    "Birth_Of_Date" TIMESTAMP(3) NOT NULL,
    "DiseaseFirst" TEXT NOT NULL,
    "DiseaseSecond" TEXT NOT NULL,
    "DiseaseThird" TEXT NOT NULL,
    "DiseaseFour" TEXT NOT NULL,
    "DiseaseFive" TEXT NOT NULL,
    "DiseaseSix" TEXT NOT NULL,
    "Email_ID" TEXT NOT NULL,
    "Date_Show" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewPatients_pkey" PRIMARY KEY ("PID")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "M_ID" SERIAL NOT NULL,
    "OrderId" TEXT NOT NULL,
    "Email_ID" TEXT NOT NULL,
    "Hospital" TEXT NOT NULL,
    "MedName" TEXT NOT NULL,
    "SubMedName" TEXT,
    "Company" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "CreateDate" TIMESTAMP(3) NOT NULL,
    "CreateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Cost" DOUBLE PRECISION NOT NULL,
    "TrackingId" TEXT NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("M_ID")
);

-- CreateTable
CREATE TABLE "Register" (
    "Patient_ID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Email_IDs" TEXT NOT NULL,
    "Mobile_No" TEXT NOT NULL,
    "Passwords" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "Gender" TEXT NOT NULL,
    "Hospital_Name" TEXT NOT NULL,

    CONSTRAINT "Register_pkey" PRIMARY KEY ("Patient_ID")
);

-- CreateTable
CREATE TABLE "ShipProduct" (
    "id" SERIAL NOT NULL,
    "TrackingId" TEXT NOT NULL,
    "Email_ID" TEXT NOT NULL,
    "HospitalName" TEXT NOT NULL,
    "TotalProduct" INTEGER NOT NULL,
    "Cost" DOUBLE PRECISION NOT NULL,
    "Status" TEXT NOT NULL,
    "DealerName" TEXT NOT NULL,
    "OTP" INTEGER NOT NULL,
    "Payment" TEXT NOT NULL,

    CONSTRAINT "ShipProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tracking" (
    "id" SERIAL NOT NULL,
    "TrackingId" TEXT NOT NULL,
    "DealerName" TEXT NOT NULL,
    "TotalProduct" INTEGER NOT NULL,
    "CDate" TIMESTAMP(3) NOT NULL,
    "Time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Status" TEXT NOT NULL,

    CONSTRAINT "Tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_Email_ID_key" ON "Patient"("Email_ID");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_Email_ID_key" ON "Admin"("Email_ID");

-- CreateIndex
CREATE UNIQUE INDEX "Dealer_Email_key" ON "Dealer"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Dealer_Mobile_key" ON "Dealer"("Mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_Patient_ID_key" ON "Hospital"("Patient_ID");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_Email_ID_key" ON "Hospital"("Email_ID");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_Mobile_key" ON "Hospital"("Mobile");

-- CreateIndex
CREATE UNIQUE INDEX "HospitalInfo_Patient_ID_key" ON "HospitalInfo"("Patient_ID");

-- CreateIndex
CREATE UNIQUE INDEX "HospitalInfo_PatientEmail_key" ON "HospitalInfo"("PatientEmail");

-- CreateIndex
CREATE UNIQUE INDEX "HospitalInfo_HospitalEmailID_key" ON "HospitalInfo"("HospitalEmailID");

-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_HospitalEmailID_key" ON "Blockchain"("HospitalEmailID");

-- CreateIndex
CREATE UNIQUE INDEX "Insurance_PatientEmail_key" ON "Insurance"("PatientEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Insurance_Policy_No_key" ON "Insurance"("Policy_No");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceInfo_PatientEmail_key" ON "InsuranceInfo"("PatientEmail");

-- CreateIndex
CREATE UNIQUE INDEX "PatientInsurance_Email_IDs_key" ON "PatientInsurance"("Email_IDs");

-- CreateIndex
CREATE UNIQUE INDEX "PatientInsurance_Mobile_No_key" ON "PatientInsurance"("Mobile_No");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceDetails_Email_IDs_key" ON "InsuranceDetails"("Email_IDs");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceDetails_Mobile_Number_key" ON "InsuranceDetails"("Mobile_Number");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceDetails_Policy_No_key" ON "InsuranceDetails"("Policy_No");

-- CreateIndex
CREATE UNIQUE INDEX "Master_Transaction_Hash_key" ON "Master"("Transaction_Hash");

-- CreateIndex
CREATE UNIQUE INDEX "NewPatients_Email_ID_key" ON "NewPatients"("Email_ID");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_OrderId_key" ON "Medicine"("OrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_TrackingId_key" ON "Medicine"("TrackingId");

-- CreateIndex
CREATE UNIQUE INDEX "Register_Email_IDs_key" ON "Register"("Email_IDs");

-- CreateIndex
CREATE UNIQUE INDEX "Register_Mobile_No_key" ON "Register"("Mobile_No");

-- CreateIndex
CREATE UNIQUE INDEX "ShipProduct_TrackingId_key" ON "ShipProduct"("TrackingId");

-- CreateIndex
CREATE UNIQUE INDEX "Tracking_TrackingId_key" ON "Tracking"("TrackingId");
