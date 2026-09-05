import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { connectToDB } from "@/lib/connectToDB";
import {
  User,
  type SupplierApprovalStatus,
  type UserRole,
} from "@/models/User";

const SEED_PASSWORD = "password123";

/**
 * ============================================================
 * SEED USERS
 * ============================================================
 *
 * Keep the seed data here or move it to:
 *
 * /lib/seed-data/users.ts
 *
 * if you want to reuse it from another seed operation.
 */
const users = [
  // ============================================================
  // BUYER
  // ============================================================

  {
    username: "luth-procurement",
    fullName: "Dr. Tunde Fashola (Procurement Director)",
    email: "procurement@luth.edu.ng",
    role: "BUYER",
    status: "ACTIVE",
    organization:
      "Lagos University Teaching Hospital (LUTH)",
    phone: "+234 802 334 9911",
    address:
      "Idi-Araba, Surulere, Lagos State, Nigeria",
  },

  // ============================================================
  // APPROVED SUPPLIERS
  // ============================================================

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
    assignedCreditLimit: 15000000,
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
    assignedCreditLimit: 20000000,
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
    assignedCreditLimit: 12000000,
    kycApprovedAt:
      new Date("2024-03-12T09:00:00.000Z"),
  },

  // ============================================================
  // DISTRIBUTORS
  // ============================================================

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
    assignedCreditLimit: 10000000,
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
    assignedCreditLimit: 10000000,
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
    assignedCreditLimit: 8000000,
    kycApprovedAt:
      new Date("2024-05-02T10:00:00.000Z"),
  },

  // ============================================================
  // RETAILERS
  // ============================================================

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
    assignedCreditLimit: 5000000,
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
    assignedCreditLimit: 5000000,
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
    assignedCreditLimit: 3000000,
    kycApprovedAt:
      new Date("2024-06-20T09:00:00.000Z"),
  },

  // ============================================================
  // PENDING SUPPLIERS
  // ============================================================

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
    assignedCreditLimit: 15000000,
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
    assignedCreditLimit: 7500000,
    kycSubmittedAt:
      new Date("2025-01-12T09:15:00.000Z"),
    kycReviewNotes:
      "NAFDAC certificate uploaded. Physical cold room thermometer log audit scheduled with compliance inspector.",
  },

  // ============================================================
  // SUSPENDED SUPPLIER
  // ============================================================

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

  // ============================================================
  // PHARMACIST
  // ============================================================

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

  // ============================================================
  // ADMIN
  // ============================================================

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

/**
 * Convert seed data into the shape expected by User model.
 */
function toUserDocument(
  seedUser: SeedUser,
  passwordHash: string
) {
  const {
    username,
    fullName,
    role,
    status,
    organization,
    ...profile
  } = seedUser;

  const supplierApprovalStatus =
    "supplierApprovalStatus" in seedUser
      ? seedUser.supplierApprovalStatus
      : undefined;

  const nameParts = fullName.trim().split(/\s+/);

  const firstName =
    nameParts.shift() || "User";

  const lastName =
    nameParts.join(" ") || firstName;

  return {
    username,
    firstName,
    lastName,

    ...profile,

    organizationName: organization,

    passwordHash,

    role: role.toLowerCase() as UserRole,

    status: status.toLowerCase(),

    supplierApprovalStatus:
      supplierApprovalStatus
        ? (
            supplierApprovalStatus.toLowerCase() as SupplierApprovalStatus
          )
        : undefined,
  };
}

/**
 * ============================================================
 * SERVER ACTION
 * ============================================================
 */
async function seedUsersAction() {
  "use server";

  try {
    await connectToDB();

    const passwordHash = await bcrypt.hash(
      SEED_PASSWORD,
      12
    );

    const results = {
      created: [] as string[],
      updated: [] as string[],
      failed: [] as {
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
            email: seedUser.email,
          });

        if (existingUser) {
          await User.updateOne(
            {
              _id: existingUser._id,
            },
            {
              $set: userDocument,
            }
          );

          results.updated.push(
            seedUser.email
          );

          continue;
        }

        await User.create(
          userDocument
        );

        results.created.push(
          seedUser.email
        );
      } catch (error) {
        results.failed.push({
          email: seedUser.email,
          error:
            error instanceof Error
              ? error.message
              : "Unknown error",
        });
      }
    }

    const params = new URLSearchParams({
      seed: "success",
      created: String(
        results.created.length
      ),
      updated: String(
        results.updated.length
      ),
      failed: String(
        results.failed.length
      ),
      total: String(users.length),
    });

    redirect(
      `/admin/settings/seed-users?${params.toString()}`
    );
  } catch (error) {
    console.error(
      "USER SEED ERROR:",
      error
    );

    redirect(
      "/admin/settings/seed-users?seed=error"
    );
  }
}

/**
 * ============================================================
 * UI
 * ============================================================
 */
export default async function SeedUser({
  searchParams,
}: {
  searchParams: Promise<{
    seed?: string;
    created?: string;
    updated?: string;
    failed?: string;
    total?: string;
  }>;
}) {
  const params = await searchParams;

  const isSuccess =
    params.seed === "success";

  const isError =
    params.seed === "error";

  return (
    <div className="w-full max-w-2xl rounded-xl border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Seed Development Users
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Create or update the default MedSupply
          development accounts in MongoDB.
        </p>
      </div>

      {/* Status */}
      {isSuccess && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm dark:border-green-900 dark:bg-green-950/30">
          <div className="font-semibold text-green-700 dark:text-green-400">
            Users seeded successfully
          </div>

          <div className="mt-2 space-y-1 text-green-700/80 dark:text-green-400/80">
            <p>
              Total users:{" "}
              <strong>
                {params.total}
              </strong>
            </p>

            <p>
              Created:{" "}
              <strong>
                {params.created}
              </strong>
            </p>

            <p>
              Updated:{" "}
              <strong>
                {params.updated}
              </strong>
            </p>

            <p>
              Failed:{" "}
              <strong>
                {params.failed}
              </strong>
            </p>
          </div>

          <div className="mt-4 rounded-md border border-green-200 bg-background p-3 text-xs">
            <span className="font-medium">
              Development password:
            </span>{" "}
            <code className="rounded bg-muted px-1.5 py-0.5">
              {SEED_PASSWORD}
            </code>
          </div>
        </div>
      )}

      {isError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          <p className="font-semibold">
            User seeding failed
          </p>

          <p className="mt-1">
            The users could not be seeded.
            Check the server logs and MongoDB
            connection.
          </p>
        </div>
      )}

      {/* Seed form */}
      <form action={seedUsersAction}>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Seed Users
        </button>
      </form>

      {/* Information */}
      <div className="mt-6 rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
        <p>
          This operation will create missing users
          and update existing seed users.
        </p>

        <p className="mt-1">
          Existing seed-user passwords will be reset
          to the development password.
        </p>

        <p className="mt-1 font-medium">
          This should only be used in development or
          controlled administrative environments.
        </p>
      </div>
    </div>
  );
}