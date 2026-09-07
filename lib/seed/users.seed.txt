// lib/seed/users.seed.ts

import bcrypt from "bcryptjs";
import { Types } from "mongoose";

import { connectToDB } from "@/lib/connectToDB";

import {
  User,
  type SupplierApprovalStatus,
  type SupplierType,
  type UserRole,
} from "@/models/User";

import { Product } from "@/models/Product";
import {
  SupplierProduct,
  type SupplierProductStatus,
} from "@/models/SupplierProduct";

import { Wallet } from "@/models/Wallet";
import { WalletTransaction } from "@/models/WalletTransaction";

/* ============================================================
   CONFIG
============================================================ */

const SEED_PASSWORD =
  process.env.SEED_USER_PASSWORD || "password123";

export const SEED_USER_PASSWORD = SEED_PASSWORD;

const SEED_BUYER_USERNAME = "luth-procurement";

/* ============================================================
   BUYER WALLET SEED
============================================================ */

const SEED_BUYER_WALLET = {
  buyerName: "Lagos University Teaching Hospital (LUTH)",
  balance: 1_450_000,
  currency: "NGN" as const,
  status: "ACTIVE" as const,
  createdAt: new Date("2025-01-10T08:30:00.000Z"),
  updatedAt: new Date("2025-01-15T10:00:00.000Z"),
};

const SEED_BUYER_WALLET_TRANSACTIONS = [
  {
    type: "TOPUP" as const,
    amount: 2_000_000,
    direction: "CREDIT" as const,
    balanceBefore: 0,
    balanceAfter: 2_000_000,
    reference: "PSTK_TOPUP_88492019",
    description:
      "Paystack Direct Bank Gateway Settlement — Wallet Funding",
    status: "SUCCESS" as const,
    metadata: {
      gateway: "Paystack",
      channel: "card_or_bank",
    },
    createdAt: new Date("2025-01-10T09:15:00.000Z"),
  },

  {
    type: "PURCHASE" as const,
    amount: 550_000,
    direction: "DEBIT" as const,
    balanceBefore: 2_000_000,
    balanceAfter: 1_450_000,
    reference: "MS_PUR_ORD-8821",
    description:
      "Payment for Order #ORD-8821 (Amoxicillin 500mg Batch EMB-44)",
    status: "SUCCESS" as const,
    metadata: {
      orderReference: "ORD-8821",
      orderId: "ord-8821",
    },
    createdAt: new Date("2025-01-12T14:20:00.000Z"),
  },
] as const;

/* ============================================================
   USERS
============================================================ */

export const users = [
  /* ============================================================
     BUYER
  ============================================================ */

  {
    username: "luth-procurement",
    fullName:
      "Dr. Tunde Fashola (Procurement Director)",
    email: "procurement@luth.edu.ng",
    role: "BUYER",
    status: "ACTIVE",
    organization:
      "Lagos University Teaching Hospital (LUTH)",
    phone: "+234 802 334 9911",
    address:
      "Idi-Araba, Surulere, Lagos State, Nigeria",
  },

  /* ============================================================
     APPROVED IMPORTERS
  ============================================================ */

  {
    username: "may-baker",
    fullName: "May & Baker Nigeria Plc",
    email: "sales@may-baker.com",
    role: "SUPPLIER",
    status: "ACTIVE",
    organization: "May & Baker Nigeria Plc",
    supplierType: "importer",
    supplierApprovalStatus: "APPROVED",
    phone: "+234 1 270 4780",
    address:
      "1 May & Baker Avenue, Ikeja Industrial Estate, Lagos",
    state: "Lagos",
    lga: "Ikeja",
    licenseNumber: "PCN-IMP-2024-0012",
    pcnPremisesLicense:
      "PCN-PREM-LAG-2024-0012",
    nafdacGdpLicense:
      "NAFDAC/GDP/2024/091",
    coldChainCapacityM3: 450,
    backupPowerSpec:
      "500kVA Dual Cummins Generator with Automatic Transfer Switch (ATS)",
    settlementBankName: "Zenith Bank Plc",
    settlementAccountNumber: "1014892841",
    settlementAccountName:
      "MAY & BAKER NIGERIA PLC / MEDISUPPLY ESCROW",
    taxIdentificationNumber:
      "TIN-00192847-0001",
    isColdChainCertified: true,
    creditRatingTier: "A",
    assignedCreditLimit: 15_000_000,
    kycApprovedAt:
      new Date("2024-03-01T10:00:00.000Z"),
    kycReviewNotes:
      "Full GMP and GDP compliance verified. Cold room calibrated with continuous digital data logger.",
  },

  {
    username: "fidson-healthcare",
    fullName: "Fidson Healthcare Plc",
    email: "orders@fidson.com",
    role: "SUPPLIER",
    status: "ACTIVE",
    organization: "Fidson Healthcare Plc",
    supplierType: "importer",
    supplierApprovalStatus: "APPROVED",
    phone: "+234 1 740 6817",
    address:
      "268 Ikorodu Road, Obanikoro, Lagos",
    state: "Lagos",
    lga: "Somolu",
    licenseNumber: "PCN-IMP-2024-0019",
    pcnPremisesLicense:
      "PCN-PREM-LAG-2024-0019",
    nafdacGdpLicense:
      "NAFDAC/GDP/2024/082",
    coldChainCapacityM3: 600,
    backupPowerSpec:
      "800kVA Perkins Diesel Gen + Solar Hybrid Backup",
    settlementBankName: "Access Bank Plc",
    settlementAccountNumber: "0039281726",
    settlementAccountName:
      "FIDSON HEALTHCARE PLC - COMMERCIAL SETTLEMENT",
    taxIdentificationNumber:
      "TIN-00281944-0001",
    isColdChainCertified: true,
    creditRatingTier: "A",
    assignedCreditLimit: 20_000_000,
    kycApprovedAt:
      new Date("2024-03-05T11:00:00.000Z"),
  },

  {
    username: "neimeth-pharmaceuticals",
    fullName:
      "Neimeth International Pharmaceuticals Plc",
    email: "b2b@neimethplc.com.ng",
    role: "SUPPLIER",
    status: "ACTIVE",
    organization: "Neimeth Pharmaceuticals",
    supplierType: "importer",
    supplierApprovalStatus: "APPROVED",
    phone: "+234 1 496 3804",
    address:
      "1 Henry Carr Street, Industrial Estate, Ikeja, Lagos",
    state: "Lagos",
    lga: "Ikeja",
    licenseNumber: "PCN-IMP-2024-0033",
    pcnPremisesLicense:
      "PCN-PREM-LAG-2024-0033",
    nafdacGdpLicense:
      "NAFDAC/GDP/2024/044",
    coldChainCapacityM3: 320,
    settlementBankName: "First Bank of Nigeria",
    settlementAccountNumber: "2019485732",
    settlementAccountName:
      "NEIMETH INT PHARM PLC",
    taxIdentificationNumber:
      "TIN-00394811-0001",
    isColdChainCertified: true,
    creditRatingTier: "A",
    assignedCreditLimit: 12_000_000,
    kycApprovedAt:
      new Date("2024-03-12T09:00:00.000Z"),
  },

  /* ============================================================
     APPROVED DISTRIBUTORS
  ============================================================ */

  {
    username: "emzor-pharmaceuticals",
    fullName:
      "Emzor Pharmaceutical Industries Ltd",
    email: "distributors@emzorpharma.com",
    role: "SUPPLIER",
    status: "ACTIVE",
    organization: "Emzor Pharmaceuticals",
    supplierType: "distributor",
    supplierApprovalStatus: "APPROVED",
    phone: "+234 1 497 4410",
    address:
      "Plot 3C, Block A, Ajao Estate, Isolo, Lagos",
    state: "Lagos",
    lga: "Oshodi-Isolo",
    licenseNumber: "PCN-DIS-2024-0105",
    pcnPremisesLicense:
      "PCN-PREM-LAG-2024-0105",
    nafdacGdpLicense:
      "NAFDAC/GDP/2024/119",
    coldChainCapacityM3: 280,
    settlementBankName:
      "Guaranty Trust Bank (GTBank)",
    settlementAccountNumber: "0129384756",
    settlementAccountName:
      "EMZOR PHARMACEUTICAL IND LTD",
    taxIdentificationNumber:
      "TIN-00449102-0001",
    isColdChainCertified: true,
    creditRatingTier: "A",
    assignedCreditLimit: 10_000_000,
    kycApprovedAt:
      new Date("2024-04-01T08:30:00.000Z"),
  },

  {
    username: "swipha",
    fullName:
      "Swiss Pharma Nigeria Ltd (Swipha)",
    email: "orders@swiphanigeria.com",
    role: "SUPPLIER",
    status: "ACTIVE",
    organization: "Swiss Pharma Nigeria",
    supplierType: "distributor",
    supplierApprovalStatus: "APPROVED",
    phone: "+234 1 492 0543",
    address:
      "5 Dopemu Road, Agege, Lagos",
    state: "Lagos",
    lga: "Agege",
    licenseNumber: "PCN-DIS-2024-0118",
    pcnPremisesLicense:
      "PCN-PREM-LAG-2024-0118",
    nafdacGdpLicense:
      "NAFDAC/GDP/2024/133",
    coldChainCapacityM3: 400,
    settlementBankName: "Stanbic IBTC Bank",
    settlementAccountNumber: "0029384711",
    settlementAccountName:
      "SWISS PHARMA NIGERIA LTD",
    taxIdentificationNumber:
      "TIN-00551092-0001",
    isColdChainCertified: true,
    creditRatingTier: "A",
    assignedCreditLimit: 10_000_000,
    kycApprovedAt:
      new Date("2024-04-15T14:00:00.000Z"),
  },

  {
    username: "juhel-nigeria",
    fullName: "Juhel Nigeria Limited",
    email: "sales@juhelpharma.com",
    role: "SUPPLIER",
    status: "ACTIVE",
    organization: "Juhel Nigeria Ltd",
    supplierType: "distributor",
    supplierApprovalStatus: "APPROVED",
    phone: "+234 42 258 871",
    address:
      "35 Awka Road, Trans-Ekulu, Enugu / Ikeja Branch",
    state: "Enugu",
    lga: "Enugu North",
    licenseNumber: "PCN-DIS-2024-0142",
    pcnPremisesLicense:
      "PCN-PREM-ENU-2024-0142",
    nafdacGdpLicense:
      "NAFDAC/GDP/2024/187",
    coldChainCapacityM3: 150,
    settlementBankName:
      "United Bank for Africa (UBA)",
    settlementAccountNumber: "1029384755",
    settlementAccountName:
      "JUHEL NIGERIA LIMITED",
    taxIdentificationNumber:
      "TIN-00662910-0001",
    isColdChainCertified: false,
    creditRatingTier: "B",
    assignedCreditLimit: 8_000_000,
    kycApprovedAt:
      new Date("2024-05-02T10:00:00.000Z"),
  },

  /* ============================================================
     APPROVED RETAILERS
  ============================================================ */

  {
    username: "healthplus-b2b",
    fullName:
      "HealthPlus Pharmacy B2B Fleet",
    email: "fleet@healthplus.com.ng",
    role: "SUPPLIER",
    status: "ACTIVE",
    organization: "HealthPlus Pharmacy",
    supplierType: "retailer",
    supplierApprovalStatus: "APPROVED",
    phone: "+234 816 687 2300",
    address:
      "11B Admiralty Way, Lekki Phase 1, Lagos",
    state: "Lagos",
    lga: "Eti-Osa",
    licenseNumber: "PCN-RET-2024-0801",
    pcnPremisesLicense:
      "PCN-PREM-LAG-2024-0801",
    nafdacGdpLicense:
      "NAFDAC/GDP/2024/204",
    coldChainCapacityM3: 85,
    settlementBankName: "Zenith Bank Plc",
    settlementAccountNumber: "1019283746",
    settlementAccountName:
      "HEALTHPLUS PHARMACY LTD",
    taxIdentificationNumber:
      "TIN-00773918-0001",
    isColdChainCertified: true,
    creditRatingTier: "B",
    assignedCreditLimit: 5_000_000,
    kycApprovedAt:
      new Date("2024-06-01T12:00:00.000Z"),
  },

  {
    username: "medplus-pharmacy",
    fullName:
      "MedPlus Pharmacy Chain Distribution",
    email: "wholesale@medplus.ng",
    role: "SUPPLIER",
    status: "ACTIVE",
    organization: "MedPlus Pharmacy",
    supplierType: "retailer",
    supplierApprovalStatus: "APPROVED",
    phone: "+234 803 333 4455",
    address:
      "45 Saka Tinubu Street, Victoria Island, Lagos",
    state: "Lagos",
    lga: "Eti-Osa",
    licenseNumber: "PCN-RET-2024-0844",
    pcnPremisesLicense:
      "PCN-PREM-LAG-2024-0844",
    nafdacGdpLicense:
      "NAFDAC/GDP/2024/218",
    coldChainCapacityM3: 110,
    settlementBankName:
      "Guaranty Trust Bank",
    settlementAccountNumber: "0192837465",
    settlementAccountName:
      "MEDPLUS PHARMACY CHAIN NIG",
    taxIdentificationNumber:
      "TIN-00881920-0001",
    isColdChainCertified: true,
    creditRatingTier: "B",
    assignedCreditLimit: 5_000_000,
    kycApprovedAt:
      new Date("2024-06-10T13:00:00.000Z"),
  },

  {
    username: "mopheth-pharmacy",
    fullName: "Mopheth Pharmacy Group",
    email: "commercial@mophethgroup.com",
    role: "SUPPLIER",
    status: "ACTIVE",
    organization: "Mopheth Pharmacy",
    supplierType: "retailer",
    supplierApprovalStatus: "APPROVED",
    phone: "+234 809 999 1234",
    address:
      "30 Victoria Island / Ikoyi Link Corridor, Lagos",
    state: "Lagos",
    lga: "Eti-Osa",
    licenseNumber: "PCN-RET-2024-0902",
    pcnPremisesLicense:
      "PCN-PREM-LAG-2024-0902",
    nafdacGdpLicense:
      "NAFDAC/GDP/2024/255",
    coldChainCapacityM3: 65,
    settlementBankName:
      "First City Monument Bank (FCMB)",
    settlementAccountNumber: "3019284756",
    settlementAccountName:
      "MOPHETH PHARMACY ENTERPRISE",
    taxIdentificationNumber:
      "TIN-00992019-0001",
    isColdChainCertified: false,
    creditRatingTier: "C",
    assignedCreditLimit: 3_000_000,
    kycApprovedAt:
      new Date("2024-06-20T09:00:00.000Z"),
  },

  /* ============================================================
     PENDING SUPPLIERS
  ============================================================ */

  {
    username: "afrab-chem",
    fullName:
      "Afrab-Chem Limited (Pharmaceutical Manufacturers)",
    email: "regulatory@afrabchem.com",
    role: "SUPPLIER",
    status: "ACTIVE",
    organization: "Afrab-Chem Limited",
    supplierType: "importer",
    supplierApprovalStatus: "PENDING",
    phone: "+234 1 774 2901",
    address:
      "22 Abimbola Street, Isolo Industrial Estate, Lagos",
    state: "Lagos",
    lga: "Oshodi-Isolo",
    licenseNumber: "PCN-IMP-2025-0044",
    pcnPremisesLicense:
      "PCN-PREM-LAG-2025-0044",
    nafdacGdpLicense:
      "NAFDAC/GDP/2025/012",
    coldChainCapacityM3: 500,
    backupPowerSpec:
      "650kVA Cummins Turbocharged Diesel Gen with synchronized auto mains failure panel",
    settlementBankName: "Zenith Bank Plc",
    settlementAccountNumber: "1018273645",
    settlementAccountName:
      "AFRAB-CHEM LIMITED / COMMERCIAL REVENUE",
    taxIdentificationNumber:
      "TIN-01002938-0001",
    isColdChainCertified: true,
    creditRatingTier: "A",
    assignedCreditLimit: 15_000_000,
    kycSubmittedAt:
      new Date("2025-01-08T14:20:00.000Z"),
    kycReviewNotes:
      "Submitted complete CAC RC-129481, NAFDAC GDP Audit Form 04B, and Superintendent Pharmacist annual license.",
  },

  {
    username: "chi-pharmaceuticals",
    fullName:
      "Chi Pharmaceuticals Logistics Limited",
    email: "compliance@chipharm.com.ng",
    role: "SUPPLIER",
    status: "ACTIVE",
    organization: "Chi Pharmaceuticals Limited",
    supplierType: "distributor",
    supplierApprovalStatus: "PENDING",
    phone: "+234 1 280 5500",
    address:
      "14 Chivita Avenue, Ajao Estate, Lagos",
    state: "Lagos",
    lga: "Oshodi-Isolo",
    licenseNumber: "PCN-DIS-2025-0189",
    pcnPremisesLicense:
      "PCN-PREM-LAG-2025-0189",
    nafdacGdpLicense:
      "NAFDAC/GDP/2025/028",
    coldChainCapacityM3: 220,
    backupPowerSpec:
      "350kVA Cat Diesel Gen with 48V Inverter Rack",
    settlementBankName:
      "Standard Chartered Bank Nigeria",
    settlementAccountNumber: "0002938471",
    settlementAccountName:
      "CHI PHARMACEUTICALS LTD",
    taxIdentificationNumber:
      "TIN-01118273-0001",
    isColdChainCertified: true,
    creditRatingTier: "B",
    assignedCreditLimit: 7_500_000,
    kycSubmittedAt:
      new Date("2025-01-12T09:15:00.000Z"),
    kycReviewNotes:
      "NAFDAC certificate uploaded. Physical cold room thermometer log audit scheduled with compliance inspector.",
  },

  /* ============================================================
     SUSPENDED SUPPLIER
  ============================================================ */

  {
    username: "apex-wholesale",
    fullName:
      "Apex Wholesale Drug Depot Ltd",
    email: "depot@apexmeds.com.ng",
    role: "SUPPLIER",
    status: "SUSPENDED",
    organization: "Apex Wholesale Drug Depot",
    supplierType: "distributor",
    supplierApprovalStatus: "SUSPENDED",
    phone: "+234 802 888 7766",
    address:
      "Plot 18 Commercial Layout, Port Harcourt, Rivers State",
    state: "Rivers",
    lga: "Port Harcourt",
    licenseNumber: "PCN-DIS-2023-0912",
    pcnPremisesLicense:
      "PCN-PREM-RIV-2023-0912",
    nafdacGdpLicense:
      "NAFDAC/GDP/2023/110",
    coldChainCapacityM3: 40,
    settlementBankName: "Fidelity Bank Plc",
    settlementAccountNumber: "4019283746",
    settlementAccountName:
      "APEX WHOLESALE DRUG DEPOT",
    taxIdentificationNumber:
      "TIN-01229384-0001",
    isColdChainCertified: false,
    creditRatingTier: "C",
    assignedCreditLimit: 0,
    kycApprovedAt:
      new Date("2023-11-10T10:00:00.000Z"),
    kycSuspensionReason:
      "Cold chain temperature excursion (+14.2°C recorded during insulin transit). Pending corrective action report.",
  },

  /* ============================================================
     PHARMACIST
  ============================================================ */

  {
    username: "amaka-obi",
    fullName:
      "Pharm. Dr. Amaka Obi (B.Pharm, PharmD, FPSN)",
    email: "amaka.obi@medsupply.com",
    role: "PHARMACIST",
    status: "ACTIVE",
    organization:
      "MediSupply Quality Assurance & Compliance Dept",
    phone: "+234 803 712 4490",
    pharmacistLicense:
      "PCN-REG-2016-44912",
    address:
      "MediSupply Central Inspection Hub, Ikeja, Lagos",
  },

  /* ============================================================
     ADMIN
  ============================================================ */

  {
    username: "admin",
    fullName:
      "Engr. Randal Wilson (Super Admin)",
    email: "admin@medsupply.com",
    role: "ADMIN",
    status: "ACTIVE",
    organization:
      "MediSupply Global Infrastructure",
    phone: "+234 800 633 4787",
    address:
      "MediSupply Headquarters, Victoria Island, Lagos",
  },
] as const;

type SeedUser = (typeof users)[number];

/* ============================================================
   MASTER PRODUCT CATALOGUE
   ------------------------------------------------------------
   NOTE:
   NAFDAC numbers supplied in the original mock data are NOT
   stored on Product because NAFDAC belongs to SupplierProduct.
============================================================ */

const MASTER_PRODUCTS = [
  {
    seedId: "prod-paracetamol-500",
    name: "Paracetamol 500mg Tablets",
    genericName: "Paracetamol",
    brandName: "Paracetamol",
    activeIngredient: "Paracetamol (Acetaminophen)",
    strength: "500mg",
    dosageForm: "Oral Tablet",
    category: "Analgesics & Antipyretics",
    unit: "Packs of 100 Tablets (10x10 Blister)",
    packSize: "100 tablets/pack",
    referenceBasePrice: 1000,
    commissionPercent: 10,
    maxMarkupPercent: 25,
    status: "ACTIVE" as const,
    storageCondition:
      "Store below 30°C in a dry place, protected from direct sunlight.",
    requiresColdChain: false,
    controlledDrug: false,
    prescriptionRequired: false,
    description:
      "Standard fast-acting acetaminophen analgesic for pain relief and fever reduction in hospital wards and clinical dispensaries.",
    createdAt: new Date("2024-01-10T00:00:00.000Z"),
  },

  {
    seedId: "prod-amoxicillin-500",
    name: "Amoxicillin 500mg Capsules",
    genericName: "Amoxicillin",
    brandName: "Amoxicillin",
    activeIngredient: "Amoxicillin Trihydrate",
    strength: "500mg",
    dosageForm: "Hard Gelatin Capsule",
    category: "Antibiotics & Antimicrobials",
    unit: "Packs of 100 Capsules (10x10 Blister)",
    packSize: "100 capsules/pack",
    referenceBasePrice: 2800,
    commissionPercent: 10,
    maxMarkupPercent: 30,
    status: "ACTIVE" as const,
    storageCondition:
      "Store below 25°C in original packaging. Keep dry.",
    requiresColdChain: false,
    controlledDrug: false,
    prescriptionRequired: true,
    description:
      "Broad-spectrum beta-lactam bactericidal antibiotic for susceptible bacterial infections.",
    createdAt: new Date("2024-01-10T00:00:00.000Z"),
  },

  {
    seedId: "prod-ibuprofen-400",
    name: "Ibuprofen 400mg Film-Coated Tablets",
    genericName: "Ibuprofen",
    brandName: "Ibuprofen",
    activeIngredient: "Ibuprofen",
    strength: "400mg",
    dosageForm: "Film-Coated Tablet",
    category: "NSAIDs & Anti-Inflammatory",
    unit: "Packs of 100 Tablets (10x10)",
    packSize: "100 tablets/pack",
    referenceBasePrice: 1800,
    commissionPercent: 10,
    maxMarkupPercent: 25,
    status: "ACTIVE" as const,
    storageCondition: "Store at 15–30°C.",
    requiresColdChain: false,
    controlledDrug: false,
    prescriptionRequired: false,
    description:
      "NSAID indicated for acute inflammatory pain, post-surgical dental pain and arthritis.",
    createdAt: new Date("2024-01-10T00:00:00.000Z"),
  },

  {
    seedId: "prod-artemether-lumefantrine",
    name:
      "Artemether 80mg + Lumefantrine 480mg (ACT Forte)",
    genericName: "Artemether + Lumefantrine",
    brandName: "ACT Forte",
    activeIngredient:
      "Artemether + Lumefantrine",
    strength: "80mg/480mg",
    dosageForm: "Oral Tablet",
    category: "Antimalarials",
    unit: "Dispenser Box of 30 Treatment Packs",
    packSize: "30 patient courses/box",
    referenceBasePrice: 14500,
    commissionPercent: 10,
    maxMarkupPercent: 20,
    status: "ACTIVE" as const,
    storageCondition:
      "Store below 30°C in moisture-proof packaging.",
    requiresColdChain: false,
    controlledDrug: false,
    prescriptionRequired: false,
    description:
      "First-line ACT for uncomplicated P. falciparum malaria in adults and children.",
    createdAt: new Date("2024-01-10T00:00:00.000Z"),
  },

  {
    seedId: "prod-vitamin-c-1000",
    name: "Vitamin C 1000mg Effervescent Tablets",
    genericName: "Vitamin C",
    brandName: "Vitamin C + Zinc",
    activeIngredient:
      "Ascorbic Acid (Vitamin C) + Zinc 10mg",
    strength: "1000mg",
    dosageForm: "Effervescent Tablet",
    category: "Vitamins & Supplements",
    unit: "Tubes of 20 Tablets (Pack of 10 Tubes)",
    packSize: "200 tablets (10 tubes)",
    referenceBasePrice: 8500,
    commissionPercent: 10,
    maxMarkupPercent: 25,
    status: "ACTIVE" as const,
    storageCondition:
      "Keep tube tightly closed in a cool dry place.",
    requiresColdChain: false,
    controlledDrug: false,
    prescriptionRequired: false,
    description:
      "High-potency ascorbic acid effervescent formulation with zinc.",
    createdAt: new Date("2024-01-10T00:00:00.000Z"),
  },

  {
    seedId: "prod-metformin-500",
    name: "Metformin Hydrochloride 500mg Tablets",
    genericName: "Metformin",
    brandName: "Metformin",
    activeIngredient: "Metformin HCl",
    strength: "500mg",
    dosageForm: "Oral Tablet",
    category: "Endocrine & Diabetes Care",
    unit: "Packs of 100 Tablets (10x10 Blister)",
    packSize: "100 tablets/pack",
    referenceBasePrice: 2200,
    commissionPercent: 10,
    maxMarkupPercent: 25,
    status: "ACTIVE" as const,
    storageCondition: "Store at 20–25°C.",
    requiresColdChain: false,
    controlledDrug: false,
    prescriptionRequired: true,
    description:
      "Biguanide oral antihyperglycemic medicine used in diabetes care.",
    createdAt: new Date("2024-01-10T00:00:00.000Z"),
  },

  {
    seedId: "prod-omeprazole-20",
    name:
      "Omeprazole 20mg Delayed-Release Capsules",
    genericName: "Omeprazole",
    brandName: "Omeprazole",
    activeIngredient:
      "Omeprazole (Enteric Coated Pellets)",
    strength: "20mg",
    dosageForm: "Delayed-Release Capsule",
    category: "Gastroenterology",
    unit: "Packs of 100 Capsules (10x10 Alu-Alu)",
    packSize: "100 capsules/pack",
    referenceBasePrice: 3200,
    commissionPercent: 10,
    maxMarkupPercent: 25,
    status: "ACTIVE" as const,
    storageCondition:
      "Store in a moisture-resistant container below 25°C.",
    requiresColdChain: false,
    controlledDrug: false,
    prescriptionRequired: true,
    description:
      "PPI for gastric and duodenal ulcers, GERD and NSAID protection.",
    createdAt: new Date("2024-01-10T00:00:00.000Z"),
  },

  {
    seedId: "prod-cough-syrup",
    name:
      "Expectorant Cough Syrup with Menthol (100ml)",
    genericName: "Expectorant Cough Syrup",
    brandName: "Menthol Expectorant",
    activeIngredient:
      "Diphenhydramine HCl + Ammonium Chloride + Menthol",
    strength: "14mg/135mg per 5ml",
    dosageForm: "Oral Liquid / Syrup",
    category: "Respiratory & ENT",
    unit: "Carton of 48 Bottles (100ml Amber Glass)",
    packSize: "48 bottles/carton",
    referenceBasePrice: 24000,
    commissionPercent: 10,
    maxMarkupPercent: 25,
    status: "ACTIVE" as const,
    storageCondition:
      "Do not freeze. Keep away from light.",
    requiresColdChain: false,
    controlledDrug: false,
    prescriptionRequired: false,
    description:
      "Soothes throat, loosens secretions and relieves dry/productive cough.",
    createdAt: new Date("2024-01-10T00:00:00.000Z"),
  },

  {
    seedId: "prod-ors-sachets",
    name: "Oral Rehydration Salts (ORS) WHO Formula",
    genericName: "Oral Rehydration Salts",
    brandName: "WHO ORS",
    activeIngredient:
      "Sodium Chloride + Potassium Chloride + Sodium Citrate + Anhydrous Glucose",
    strength: "20.5g powder per sachet (for 1 Litre solution)",
    dosageForm: "Soluble Powder Sachet",
    category: "Emergency & Critical Fluids",
    unit: "Box of 100 Sachets",
    packSize: "100 sachets/box",
    referenceBasePrice: 6500,
    commissionPercent: 10,
    maxMarkupPercent: 20,
    status: "ACTIVE" as const,
    storageCondition: "Store in a dry place below 30°C.",
    requiresColdChain: false,
    controlledDrug: false,
    prescriptionRequired: false,
    description:
      "WHO low-osmolarity oral rehydration formulation.",
    createdAt: new Date("2024-01-10T00:00:00.000Z"),
  },

  {
    seedId: "prod-amlodipine-5",
    name: "Amlodipine Besylate 5mg Tablets",
    genericName: "Amlodipine",
    brandName: "Amlodipine",
    activeIngredient: "Amlodipine Besylate",
    strength: "5mg",
    dosageForm: "Oral Tablet",
    category: "Cardiovascular & Hypertension",
    unit: "Packs of 100 Tablets (10x10 Blister)",
    packSize: "100 tablets/pack",
    referenceBasePrice: 2500,
    commissionPercent: 10,
    maxMarkupPercent: 30,
    status: "ACTIVE" as const,
    storageCondition:
      "Protect from moisture and light.",
    requiresColdChain: false,
    controlledDrug: false,
    prescriptionRequired: true,
    description:
      "Long-acting dihydropyridine calcium-channel blocker for hypertension.",
    createdAt: new Date("2024-01-10T00:00:00.000Z"),
  },
] as const;

/* ============================================================
   SUPPLIER PRODUCT / INVENTORY SEED
============================================================ */

const SUPPLIER_PRODUCTS = [
  {
    productSeedId: "prod-paracetamol-500",
    supplierUsername: "may-baker",
    nafdacRegNumber: "NAFDAC-04-1294",
    basePrice: 950,
    stock: 12000,
    minOrderQuantity: 50,
    maxOrderQuantity: 10000,
    batchNumber: "MB-PCM-2401",
    expiryDate: "2027-08-30",
    manufacturingDate: "2024-08-01",
    rating: 4.9,
    fulfillmentRate: 99.4,
    estimatedDeliveryDays: 1,
  },
  {
    productSeedId: "prod-paracetamol-500",
    supplierUsername: "fidson-healthcare",
    nafdacRegNumber: "NAFDAC-04-1294",
    basePrice: 980,
    stock: 8500,
    minOrderQuantity: 40,
    maxOrderQuantity: 8000,
    batchNumber: "FD-PCM-2409",
    expiryDate: "2027-05-15",
    manufacturingDate: "2024-07-10",
    rating: 4.8,
    fulfillmentRate: 98.8,
    estimatedDeliveryDays: 2,
  },
  {
    productSeedId: "prod-paracetamol-500",
    supplierUsername: "neimeth-pharmaceuticals",
    nafdacRegNumber: "NAFDAC-04-1294",
    basePrice: 1020,
    stock: 6000,
    minOrderQuantity: 20,
    maxOrderQuantity: 5000,
    batchNumber: "NM-PCM-2404",
    expiryDate: "2027-01-20",
    manufacturingDate: "2024-06-15",
    rating: 4.7,
    fulfillmentRate: 97.5,
    estimatedDeliveryDays: 2,
  },
  {
    productSeedId: "prod-paracetamol-500",
    supplierUsername: "emzor-pharmaceuticals",
    nafdacRegNumber: "NAFDAC-04-1294",
    basePrice: 1100,
    stock: 15000,
    minOrderQuantity: 10,
    maxOrderQuantity: 12000,
    batchNumber: "EM-PCM-2412",
    expiryDate: "2027-11-10",
    manufacturingDate: "2024-09-01",
    rating: 4.9,
    fulfillmentRate: 99.1,
    estimatedDeliveryDays: 1,
  },
  {
    productSeedId: "prod-paracetamol-500",
    supplierUsername: "swipha",
    nafdacRegNumber: "NAFDAC-04-1294",
    basePrice: 1140,
    stock: 4500,
    minOrderQuantity: 10,
    maxOrderQuantity: 4000,
    batchNumber: "SW-PCM-2402",
    expiryDate: "2027-04-18",
    manufacturingDate: "2024-05-20",
    rating: 4.6,
    fulfillmentRate: 96.9,
    estimatedDeliveryDays: 2,
  },
  {
    productSeedId: "prod-paracetamol-500",
    supplierUsername: "juhel-nigeria",
    nafdacRegNumber: "NAFDAC-04-1294",
    basePrice: 1180,
    stock: 7000,
    minOrderQuantity: 10,
    maxOrderQuantity: 6000,
    batchNumber: "JH-PCM-2407",
    expiryDate: "2026-12-05",
    manufacturingDate: "2024-04-10",
    rating: 4.5,
    fulfillmentRate: 95.0,
    estimatedDeliveryDays: 3,
  },
  {
    productSeedId: "prod-paracetamol-500",
    supplierUsername: "healthplus-b2b",
    nafdacRegNumber: "NAFDAC-04-1294",
    basePrice: 1280,
    stock: 1200,
    minOrderQuantity: 2,
    maxOrderQuantity: 1000,
    batchNumber: "HP-PCM-2410",
    expiryDate: "2027-09-12",
    manufacturingDate: "2024-09-05",
    rating: 4.4,
    fulfillmentRate: 94.2,
    estimatedDeliveryDays: 1,
  },

  {
    productSeedId: "prod-amoxicillin-500",
    supplierUsername: "may-baker",
    nafdacRegNumber: "NAFDAC-04-3319",
    basePrice: 2700,
    stock: 5000,
    minOrderQuantity: 20,
    maxOrderQuantity: 4000,
    batchNumber: "MB-AMX-2403",
    expiryDate: "2027-06-30",
    manufacturingDate: "2024-07-01",
    rating: 4.9,
    fulfillmentRate: 99.3,
    estimatedDeliveryDays: 1,
  },
  {
    productSeedId: "prod-amoxicillin-500",
    supplierUsername: "emzor-pharmaceuticals",
    nafdacRegNumber: "NAFDAC-04-3319",
    basePrice: 2850,
    stock: 8000,
    minOrderQuantity: 10,
    maxOrderQuantity: 7000,
    batchNumber: "EM-AMX-2408",
    expiryDate: "2027-10-15",
    manufacturingDate: "2024-08-10",
    rating: 4.9,
    fulfillmentRate: 99.0,
    estimatedDeliveryDays: 1,
  },
  {
    productSeedId: "prod-amoxicillin-500",
    supplierUsername: "fidson-healthcare",
    nafdacRegNumber: "NAFDAC-04-3319",
    basePrice: 2890,
    stock: 4200,
    minOrderQuantity: 15,
    maxOrderQuantity: 3500,
    batchNumber: "FD-AMX-2405",
    expiryDate: "2027-03-20",
    manufacturingDate: "2024-06-01",
    rating: 4.8,
    fulfillmentRate: 98.5,
    estimatedDeliveryDays: 2,
  },

  {
    productSeedId: "prod-artemether-lumefantrine",
    supplierUsername: "may-baker",
    nafdacRegNumber: "NAFDAC-04-8841",
    basePrice: 13800,
    stock: 2500,
    minOrderQuantity: 5,
    maxOrderQuantity: 2000,
    batchNumber: "MB-ACT-2408",
    expiryDate: "2027-09-30",
    manufacturingDate: "2024-08-15",
    rating: 4.9,
    fulfillmentRate: 99.5,
    estimatedDeliveryDays: 1,
  },
  {
    productSeedId: "prod-artemether-lumefantrine",
    supplierUsername: "swipha",
    nafdacRegNumber: "NAFDAC-04-8841",
    basePrice: 14200,
    stock: 1800,
    minOrderQuantity: 5,
    maxOrderQuantity: 1500,
    batchNumber: "SW-ACT-2404",
    expiryDate: "2027-02-14",
    manufacturingDate: "2024-05-10",
    rating: 4.7,
    fulfillmentRate: 97.8,
    estimatedDeliveryDays: 2,
  },
  {
    productSeedId: "prod-artemether-lumefantrine",
    supplierUsername: "healthplus-b2b",
    nafdacRegNumber: "NAFDAC-04-8841",
    basePrice: 15100,
    stock: 600,
    minOrderQuantity: 1,
    maxOrderQuantity: 500,
    batchNumber: "HP-ACT-2411",
    expiryDate: "2027-11-20",
    manufacturingDate: "2024-09-01",
    rating: 4.5,
    fulfillmentRate: 95.5,
    estimatedDeliveryDays: 1,
  },

  {
    productSeedId: "prod-ibuprofen-400",
    supplierUsername: "neimeth-pharmaceuticals",
    nafdacRegNumber: "NAFDAC-04-2281",
    basePrice: 1750,
    stock: 4500,
    minOrderQuantity: 20,
    maxOrderQuantity: 4000,
    batchNumber: "NM-IBU-2401",
    expiryDate: "2027-07-15",
    manufacturingDate: "2024-07-01",
    rating: 4.8,
    fulfillmentRate: 98.2,
    estimatedDeliveryDays: 2,
  },
  {
    productSeedId: "prod-ibuprofen-400",
    supplierUsername: "emzor-pharmaceuticals",
    nafdacRegNumber: "NAFDAC-04-2281",
    basePrice: 1820,
    stock: 9000,
    minOrderQuantity: 10,
    maxOrderQuantity: 8000,
    batchNumber: "EM-IBU-2405",
    expiryDate: "2027-12-01",
    manufacturingDate: "2024-08-20",
    rating: 4.9,
    fulfillmentRate: 99.0,
    estimatedDeliveryDays: 1,
  },

  {
    productSeedId: "prod-vitamin-c-1000",
    supplierUsername: "fidson-healthcare",
    nafdacRegNumber: "NAFDAC-04-9104",
    basePrice: 8100,
    stock: 2200,
    minOrderQuantity: 5,
    maxOrderQuantity: 1800,
    batchNumber: "FD-VTC-2406",
    expiryDate: "2027-04-10",
    manufacturingDate: "2024-06-01",
    rating: 4.8,
    fulfillmentRate: 98.6,
    estimatedDeliveryDays: 2,
  },
  {
    productSeedId: "prod-vitamin-c-1000",
    supplierUsername: "medplus-pharmacy",
    nafdacRegNumber: "NAFDAC-04-9104",
    basePrice: 8900,
    stock: 850,
    minOrderQuantity: 1,
    maxOrderQuantity: 500,
    batchNumber: "MP-VTC-2410",
    expiryDate: "2027-08-15",
    manufacturingDate: "2024-08-01",
    rating: 4.5,
    fulfillmentRate: 95.0,
    estimatedDeliveryDays: 1,
  },

  {
    productSeedId: "prod-metformin-500",
    supplierUsername: "may-baker",
    nafdacRegNumber: "NAFDAC-04-4412",
    basePrice: 2100,
    stock: 6500,
    minOrderQuantity: 15,
    maxOrderQuantity: 5000,
    batchNumber: "MB-MET-2404",
    expiryDate: "2027-05-20",
    manufacturingDate: "2024-06-10",
    rating: 4.9,
    fulfillmentRate: 99.4,
    estimatedDeliveryDays: 1,
  },
  {
    productSeedId: "prod-metformin-500",
    supplierUsername: "swipha",
    nafdacRegNumber: "NAFDAC-04-4412",
    basePrice: 2280,
    stock: 3500,
    minOrderQuantity: 10,
    maxOrderQuantity: 3000,
    batchNumber: "SW-MET-2407",
    expiryDate: "2027-01-30",
    manufacturingDate: "2024-05-15",
    rating: 4.7,
    fulfillmentRate: 97.1,
    estimatedDeliveryDays: 2,
  },

  {
    productSeedId: "prod-omeprazole-20",
    supplierUsername: "neimeth-pharmaceuticals",
    nafdacRegNumber: "NAFDAC-04-5509",
    basePrice: 3050,
    stock: 4000,
    minOrderQuantity: 10,
    maxOrderQuantity: 3500,
    batchNumber: "NM-OMP-2402",
    expiryDate: "2027-08-10",
    manufacturingDate: "2024-07-20",
    rating: 4.7,
    fulfillmentRate: 98.0,
    estimatedDeliveryDays: 2,
  },
  {
    productSeedId: "prod-omeprazole-20",
    supplierUsername: "juhel-nigeria",
    nafdacRegNumber: "NAFDAC-04-5509",
    basePrice: 3300,
    stock: 2800,
    minOrderQuantity: 5,
    maxOrderQuantity: 2500,
    batchNumber: "JH-OMP-2405",
    expiryDate: "2027-03-15",
    manufacturingDate: "2024-06-05",
    rating: 4.5,
    fulfillmentRate: 96.0,
    estimatedDeliveryDays: 3,
  },

  {
    productSeedId: "prod-cough-syrup",
    supplierUsername: "emzor-pharmaceuticals",
    nafdacRegNumber: "NAFDAC-04-6631",
    basePrice: 23200,
    stock: 950,
    minOrderQuantity: 2,
    maxOrderQuantity: 800,
    batchNumber: "EM-CSY-2409",
    expiryDate: "2026-11-20",
    manufacturingDate: "2024-08-10",
    rating: 4.9,
    fulfillmentRate: 99.2,
    estimatedDeliveryDays: 1,
  },

  {
    productSeedId: "prod-ors-sachets",
    supplierUsername: "may-baker",
    nafdacRegNumber: "NAFDAC-04-7718",
    basePrice: 6100,
    stock: 4000,
    minOrderQuantity: 10,
    maxOrderQuantity: 3500,
    batchNumber: "MB-ORS-2405",
    expiryDate: "2027-09-10",
    manufacturingDate: "2024-07-15",
    rating: 4.9,
    fulfillmentRate: 99.5,
    estimatedDeliveryDays: 1,
  },

  {
    productSeedId: "prod-amlodipine-5",
    supplierUsername: "fidson-healthcare",
    nafdacRegNumber: "NAFDAC-04-8802",
    basePrice: 2400,
    stock: 5200,
    minOrderQuantity: 10,
    maxOrderQuantity: 4500,
    batchNumber: "FD-AML-2407",
    expiryDate: "2027-06-25",
    manufacturingDate: "2024-06-20",
    rating: 4.8,
    fulfillmentRate: 98.7,
    estimatedDeliveryDays: 2,
  },
] as const;

/* ============================================================
   USER TRANSFORMATION
============================================================ */

function toUserDocument(
  seedUser: SeedUser,
  passwordHash: string
) {
  const seedRecord = seedUser as SeedUser & {
    supplierApprovalStatus?: string;
  };

  const {
    username,
    fullName,
    role,
    status,
    organization,
    supplierApprovalStatus: rawSupplierApprovalStatus,
    ...profile
  } = seedRecord;

  const parts = fullName
    .trim()
    .split(/\s+/);

  const firstName =
    parts.shift() || "User";

  const lastName =
    parts.join(" ") || firstName;

  return {
    username,
    firstName,
    lastName,
    ...profile,
    organizationName: organization,
    password: passwordHash,

    role: role.toLowerCase() as UserRole,

    status: status.toLowerCase() as
      | "active"
      | "suspended"
      | "pending",

    ...(rawSupplierApprovalStatus
      ? {
          supplierApprovalStatus:
            rawSupplierApprovalStatus.toLowerCase() as SupplierApprovalStatus,
        }
      : {}),
  };
}

/* ============================================================
   SEED USERS
============================================================ */

async function seedAllUsers(
  passwordHash: string
) {
  const results = {
    created: [] as string[],
    updated: [] as string[],
    failed: [] as {
      username: string;
      email: string;
      error: string;
    }[],
  };

  for (const seedUser of users) {
    try {
      const userDocument =
        toUserDocument(
          seedUser,
          passwordHash
        );

      const existingUser =
        await User.findOne({
          $or: [
            { email: seedUser.email },
            { username: seedUser.username },
          ],
        });

      if (existingUser) {
        await User.updateOne(
          { _id: existingUser._id },
          {
            $set: userDocument,
          }
        );

        results.updated.push(
          seedUser.email
        );
      } else {
        await User.create(
          userDocument
        );

        results.created.push(
          seedUser.email
        );
      }
    } catch (error) {
      results.failed.push({
        username:
          seedUser.username,
        email: seedUser.email,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    }
  }

  return results;
}

/* ============================================================
   SEED MASTER PRODUCTS
============================================================ */

async function seedMasterProducts() {
  const results = {
    created: [] as string[],
    updated: [] as string[],
    failed: [] as {
      seedId: string;
      name: string;
      error: string;
    }[],
  };

  const productMap =
    new Map<
      string,
      Types.ObjectId
    >();

  for (const product of MASTER_PRODUCTS) {
    try {
      const existing =
        await Product.findOne({
          name: product.name,
        });

      const productDocument = {
        name: product.name,
        genericName:
          product.genericName,
        brandName:
          product.brandName,
        activeIngredient:
          product.activeIngredient,
        strength:
          product.strength,
        dosageForm:
          product.dosageForm,
        category:
          product.category,
        unit:
          product.unit,
        packSize:
          product.packSize,
        referenceBasePrice:
          product.referenceBasePrice,
        commissionPercent:
          product.commissionPercent,
        maxMarkupPercent:
          product.maxMarkupPercent,
        status:
          product.status,
        storageCondition:
          product.storageCondition,
        requiresColdChain:
          product.requiresColdChain,
        controlledDrug:
          product.controlledDrug,
        prescriptionRequired:
          product.prescriptionRequired,
        description:
          product.description,
        createdAt:
          product.createdAt,
      };

      let savedProduct;

      if (existing) {
        savedProduct =
          await Product.findByIdAndUpdate(
            existing._id,
            {
              $set: productDocument,
            },
            {
              new: true,
            }
          );

        results.updated.push(
          product.name
        );
      } else {
        savedProduct =
          await Product.create(
            productDocument
          );

        results.created.push(
          product.name
        );
      }

      if (!savedProduct) {
        throw new Error(
          "Unable to create or retrieve product."
        );
      }

      productMap.set(
        product.seedId,
        savedProduct._id
      );
    } catch (error) {
      results.failed.push({
        seedId: product.seedId,
        name: product.name,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    }
  }

  return {
    results,
    productMap,
  };
}

/* ============================================================
   SEED SUPPLIER PRODUCTS
============================================================ */

async function seedSupplierProducts(
  productMap: Map<
    string,
    Types.ObjectId
  >
) {
  const results = {
    created: [] as string[],
    updated: [] as string[],
    failed: [] as {
      productSeedId: string;
      supplierUsername: string;
      error: string;
    }[],
  };

  const supplierMap =
    new Map<
      string,
      {
        _id: Types.ObjectId;
        supplierType: SupplierType;
        supplierApprovalStatus?: string;
        status: string;
      }
    >();

  const supplierUsers =
    await User.find({
      role: "supplier",
    }).select(
      "_id username supplierType supplierApprovalStatus status"
    );

  for (const supplier of supplierUsers) {
    if (
      !supplier.username ||
      !supplier.supplierType ||
      !supplier.status
    ) {
      continue;
    }

    supplierMap.set(
      supplier.username,
      {
        _id: supplier._id,
        supplierType:
          supplier.supplierType,
        supplierApprovalStatus:
          supplier.supplierApprovalStatus,
        status:
          supplier.status,
      }
    );
  }

  for (const item of SUPPLIER_PRODUCTS) {
    try {
      const productId =
        productMap.get(
          item.productSeedId
        );

      if (!productId) {
        throw new Error(
          `Master product "${item.productSeedId}" was not found.`
        );
      }

      const supplier =
        supplierMap.get(
          item.supplierUsername
        );

      if (!supplier) {
        throw new Error(
          `Supplier "${item.supplierUsername}" was not found.`
        );
      }

      /*
       * Supplier inventory is only published to the marketplace
       * when the supplier is active and approved.
       *
       * We still keep this validation here so accidental inventory
       * cannot be created for pending/suspended suppliers.
       */
      if (
        supplier.status !== "active" ||
        supplier.supplierApprovalStatus !==
          "approved"
      ) {
        throw new Error(
          `Supplier "${item.supplierUsername}" is not an active approved supplier.`
        );
      }

      const product =
        await Product.findById(
          productId
        ).select(
          "commissionPercent unit status"
        );

      if (!product) {
        throw new Error(
          `Product "${item.productSeedId}" was not found in database.`
        );
      }

      /*
       * Commission is controlled by the Master Product Catalogue.
       * SupplierProduct must not supply its own commission percentage.
       */
      const commissionPercent =
        product.commissionPercent;

      const commission =
        Number(
          (
            item.basePrice *
            (commissionPercent / 100)
          ).toFixed(2)
        );

      const finalPrice =
        Number(
          (
            item.basePrice +
            commission
          ).toFixed(2)
        );

      const supplierType: SupplierType =
        supplier.supplierType;

      const inventoryStatus: SupplierProductStatus =
        item.stock <= 0
          ? "OUT_OF_STOCK"
          : item.stock <= item.minOrderQuantity * 10
            ? "LOW_STOCK"
            : "AVAILABLE";

      /*
       * Marketplace matching should use SupplierProduct.
       * productId points back to the Admin-controlled master catalogue.
       */
      const supplierProductDocument = {
        productId,
        supplierId:
          supplier._id,

        supplierType,

        nafdacRegNumber:
          item.nafdacRegNumber,

        basePrice:
          item.basePrice,

        commission,

        commissionPercent,

        finalPrice,

        stock:
          item.stock,

        minOrderQuantity:
          item.minOrderQuantity,

        maxOrderQuantity:
          item.maxOrderQuantity,

        unit:
          product.unit,

        batchNumber:
          item.batchNumber,

        expiryDate:
          new Date(
            `${item.expiryDate}T23:59:59.000Z`
          ),

        manufacturingDate:
          new Date(
            `${item.manufacturingDate}T00:00:00.000Z`
          ),

        status: inventoryStatus,

        isFlagged: false,

        rating:
          item.rating,

        fulfillmentRate:
          item.fulfillmentRate,

        estimatedDeliveryDays:
          item.estimatedDeliveryDays,

        lastStockUpdatedAt:
          new Date(),
      };

      const existing =
        await SupplierProduct.findOne({
          productId,
          supplierId:
            supplier._id,
        });

      if (existing) {
        await SupplierProduct.updateOne(
          {
            _id: existing._id,
          },
          {
            $set:
              supplierProductDocument,
          }
        );

        results.updated.push(
          `${item.productSeedId}:${item.supplierUsername}`
        );
      } else {
        await SupplierProduct.create(
          supplierProductDocument
        );

        results.created.push(
          `${item.productSeedId}:${item.supplierUsername}`
        );
      }
    } catch (error) {
      results.failed.push({
        productSeedId:
          item.productSeedId,
        supplierUsername:
          item.supplierUsername,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    }
  }

  return {
    results,
    supplierMap,
  };
}

/* ============================================================
   BUYER WALLET
============================================================ */

async function seedBuyerWallet(
  buyerId: Types.ObjectId
) {
  const existingWallet =
    await Wallet.findOne({
      buyerId,
    });

  const walletDocument = {
    buyerId,

    buyerName:
      SEED_BUYER_WALLET.buyerName,

    balance:
      SEED_BUYER_WALLET.balance,

    currency:
      SEED_BUYER_WALLET.currency,

    status:
      SEED_BUYER_WALLET.status,

    createdAt:
      SEED_BUYER_WALLET.createdAt,

    updatedAt:
      SEED_BUYER_WALLET.updatedAt,
  };

  let wallet;

  if (existingWallet) {
    wallet =
      await Wallet.findByIdAndUpdate(
        existingWallet._id,
        {
          $set: walletDocument,
        },
        {
          new: true,
        }
      );
  } else {
    wallet =
      await Wallet.create(
        walletDocument
      );
  }

  if (!wallet) {
    throw new Error(
      "Unable to create or retrieve buyer wallet."
    );
  }

  return wallet;
}

/* ============================================================
   BUYER WALLET TRANSACTIONS
============================================================ */

async function seedBuyerWalletTransactions(
  buyerId: Types.ObjectId,
  walletId: Types.ObjectId
) {
  const results = {
    created: [] as string[],
    updated: [] as string[],
    failed: [] as {
      reference: string;
      error: string;
    }[],
  };

  for (
    const transaction of
      SEED_BUYER_WALLET_TRANSACTIONS
  ) {
    try {
      const transactionDocument = {
        walletId,
        buyerId,

        type:
          transaction.type,

        amount:
          transaction.amount,

        direction:
          transaction.direction,

        balanceBefore:
          transaction.balanceBefore,

        balanceAfter:
          transaction.balanceAfter,

        reference:
          transaction.reference,

        description:
          transaction.description,

        status:
          transaction.status,

        metadata:
          transaction.metadata,

        createdAt:
          transaction.createdAt,
      };

      const existing =
        await WalletTransaction.findOne({
          reference:
            transaction.reference,
        });

      if (existing) {
        await WalletTransaction.updateOne(
          {
            _id: existing._id,
          },
          {
            $set:
              transactionDocument,
          }
        );

        results.updated.push(
          transaction.reference
        );
      } else {
        await WalletTransaction.create(
          transactionDocument
        );

        results.created.push(
          transaction.reference
        );
      }
    } catch (error) {
      results.failed.push({
        reference:
          transaction.reference,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    }
  }

  return results;
}

/* ============================================================
   MAIN SYSTEM SEED
============================================================ */

export async function seedUsers() {
  await connectToDB();

  /*
   * Hash once and reuse for all development users.
   */
  const passwordHash =
    await bcrypt.hash(
      SEED_PASSWORD,
      12
    );

  /* ============================================================
     1. USERS
  ============================================================ */

  const userResults =
    await seedAllUsers(
      passwordHash
    );

  /* ============================================================
     2. RESOLVE BUYER
  ============================================================ */

  const buyer =
    await User.findOne({
      username:
        SEED_BUYER_USERNAME,
      role: "buyer",
    }).select(
      "_id username email firstName lastName organizationName"
    );

  if (!buyer) {
    throw new Error(
      `Seed buyer "${SEED_BUYER_USERNAME}" was not found after user seeding.`
    );
  }

  /* ============================================================
     3. RESOLVE ALL SUPPLIERS
  ============================================================ */

  const supplierDocuments =
    await User.find({
      role: "supplier",
    }).select(
      "_id username email firstName lastName organizationName supplierType supplierApprovalStatus status"
    );

  /* ============================================================
     4. MASTER PRODUCTS
  ============================================================ */

  const masterProducts =
    await seedMasterProducts();

  /* ============================================================
     5. SUPPLIER PRODUCTS
  ============================================================ */

  const supplierProductSeed =
    await seedSupplierProducts(
      masterProducts.productMap
    );

  /* ============================================================
     6. BUYER WALLET
  ============================================================ */

  const wallet =
    await seedBuyerWallet(
      buyer._id
    );

  /* ============================================================
     7. WALLET TRANSACTIONS
  ============================================================ */

  const walletTransactions =
    await seedBuyerWalletTransactions(
      buyer._id,
      wallet._id
    );

  /* ============================================================
     8. RETURN SEEDED USERS
  ============================================================ */

  const seededUsers =
    await User.find({
      username: {
        $in: users.map(
          (user) => user.username
        ),
      },
    }).select(
      "_id username email firstName lastName organizationName role status supplierType supplierApprovalStatus"
    );

  /* ============================================================
     9. RETURN PRODUCT IDS
  ============================================================ */

  const seededProducts =
    await Product.find({
      name: {
        $in: MASTER_PRODUCTS.map(
          (product) => product.name
        ),
      },
    }).select(
      "_id name category status referenceBasePrice commissionPercent"
    );

  /* ============================================================
     10. FINAL RESULT
  ============================================================ */

  const hasErrors =
    userResults.failed.length > 0 ||
    masterProducts.results.failed.length > 0 ||
    supplierProductSeed.results.failed.length > 0 ||
    walletTransactions.failed.length > 0;

  return {
    success: !hasErrors,

    summary: {
      totalUsers:
        users.length,

      totalProducts:
        MASTER_PRODUCTS.length,

      totalSupplierProducts:
        SUPPLIER_PRODUCTS.length,

      totalSuppliers:
        supplierDocuments.length,

      buyerSeeded:
        Boolean(buyer),

      walletSeeded:
        Boolean(wallet),

      walletTransactionsSeeded:
        SEED_BUYER_WALLET_TRANSACTIONS.length,
    },

    /* ==========================================================
       USERS
    ========================================================== */

    users: seededUsers.map(
      (user) => ({
        _id:
          user._id.toString(),

        username:
          user.username,

        email:
          user.email,

        firstName:
          user.firstName,

        lastName:
          user.lastName,

        organizationName:
          user.organizationName,

        role:
          user.role,

        status:
          user.status,

        supplierType:
          user.supplierType,

        supplierApprovalStatus:
          user.supplierApprovalStatus,
      })
    ),

    userResults,

    /* ==========================================================
       BUYER
    ========================================================== */

    buyer: {
      _id:
        buyer._id.toString(),

      username:
        buyer.username,

      email:
        buyer.email,

      firstName:
        buyer.firstName,

      lastName:
        buyer.lastName,

      organizationName:
        buyer.organizationName,
    },

    /* ==========================================================
       SUPPLIERS
    ========================================================== */

    suppliers:
      supplierDocuments.map(
        (supplier) => ({
          _id:
            supplier._id.toString(),

          username:
            supplier.username,

          email:
            supplier.email,

          organizationName:
            supplier.organizationName,

          supplierType:
            supplier.supplierType,

          supplierApprovalStatus:
            supplier.supplierApprovalStatus,

          status:
            supplier.status,
        })
      ),

    /* ==========================================================
       MASTER PRODUCTS
    ========================================================== */

    products:
      seededProducts.map(
        (product) => ({
          _id:
            product._id.toString(),

          name:
            product.name,

          category:
            product.category,

          status:
            product.status,

          referenceBasePrice:
            product.referenceBasePrice,

          commissionPercent:
            product.commissionPercent,
        })
      ),

    productSeedMap:
      Object.fromEntries(
        Array.from(
          masterProducts.productMap.entries()
        ).map(
          ([seedId, objectId]) => [
            seedId,
            objectId.toString(),
          ]
        )
      ),

    productResults:
      masterProducts.results,

    /* ==========================================================
       SUPPLIER PRODUCTS
    ========================================================== */

    supplierProductResults:
      supplierProductSeed.results,

    /* ==========================================================
       BUYER WALLET
    ========================================================== */

    wallet: {
      _id:
        wallet._id.toString(),

      buyerId:
        buyer._id.toString(),

      buyerName:
        wallet.buyerName,

      balance:
        wallet.balance,

      currency:
        wallet.currency,

      status:
        wallet.status,
    },

    /* ==========================================================
       WALLET TRANSACTIONS
    ========================================================== */

    walletTransactions,

    /* ==========================================================
       CONVENIENT IDS FOR OTHER SEEDS
    ========================================================== */

    ids: {
      buyerId:
        buyer._id.toString(),

      walletId:
        wallet._id.toString(),

      users:
        Object.fromEntries(
          seededUsers.map(
            (user) => [
              user.username,
              user._id.toString(),
            ]
          )
        ),

      suppliers:
        Object.fromEntries(
          supplierDocuments.map(
            (supplier) => [
              supplier.username,
              supplier._id.toString(),
            ]
          )
        ),

      products:
        Object.fromEntries(
          Array.from(
            masterProducts.productMap.entries()
          ).map(
            ([seedId, objectId]) => [
              seedId,
              objectId.toString(),
            ]
          )
        ),
    },
  };
}