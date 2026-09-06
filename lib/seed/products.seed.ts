// lib/seed/products.seed.ts

import { connectToDB } from "@/lib/connectToDB";
import { Product } from "@/models/Product";

export const products = [
  {
    seedId: "prod-paracetamol-500",
    name: "Paracetamol 500mg Tablets",
    category: "Analgesics & Antipyretics",
    description:
      "Standard fast-acting acetaminophen analgesic for pain relief and fever reduction in hospital wards and clinical dispensaries.",
    activeIngredient:
      "Paracetamol (Acetaminophen)",
    strength: "500mg",
    dosageForm: "Oral Tablet",
    unit:
      "Packs of 100 Tablets (10x10 Blister)",
    packSize: "100 tablets/pack",
    referenceBasePrice: 1000,
    commissionPercent: 10,
    maxMarkupPercent: 25,
    status: "ACTIVE",
    storageCondition:
      "Store below 30°C in a dry place, protected from direct sunlight.",
  },

  {
    seedId: "prod-amoxicillin-500",
    name: "Amoxicillin 500mg Capsules",
    category:
      "Antibiotics & Antimicrobials",
    description:
      "Broad-spectrum beta-lactam bactericidal antibiotic for respiratory tract, ENT, urinary and soft-tissue bacterial infections.",
    activeIngredient:
      "Amoxicillin Trihydrate",
    strength: "500mg",
    dosageForm:
      "Hard Gelatin Capsule",
    unit:
      "Packs of 100 Capsules (10x10 Blister)",
    packSize: "100 capsules/pack",
    referenceBasePrice: 2800,
    commissionPercent: 10,
    maxMarkupPercent: 30,
    status: "ACTIVE",
    storageCondition:
      "Store below 25°C in original packaging. Keep dry.",
  },

  {
    seedId: "prod-ibuprofen-400",
    name:
      "Ibuprofen 400mg Film-Coated Tablets",
    category:
      "NSAIDs & Anti-Inflammatory",
    description:
      "Non-steroidal anti-inflammatory drug (NSAID) indicated for acute inflammatory pain, post-surgical dental pain, and arthritis.",
    activeIngredient: "Ibuprofen",
    strength: "400mg",
    dosageForm:
      "Film-Coated Tablet",
    unit:
      "Packs of 100 Tablets (10x10)",
    packSize: "100 tablets/pack",
    referenceBasePrice: 1800,
    commissionPercent: 10,
    maxMarkupPercent: 25,
    status: "ACTIVE",
    storageCondition:
      "Store at 15°C–30°C.",
  },

  {
    seedId:
      "prod-artemether-lumefantrine",
    name:
      "Artemether 80mg + Lumefantrine 480mg (ACT Forte)",
    category: "Antimalarials",
    description:
      "First-line Artemisinin-based Combination Therapy (ACT) for uncomplicated Plasmodium falciparum malaria in adults and children.",
    activeIngredient:
      "Artemether + Lumefantrine",
    strength:
      "80mg/480mg (Forte 6-tablet single course)",
    dosageForm: "Oral Tablet",
    unit:
      "Dispenser Box of 30 Treatment Packs",
    packSize:
      "30 patient courses/box",
    referenceBasePrice: 14500,
    commissionPercent: 10,
    maxMarkupPercent: 20,
    status: "ACTIVE",
    storageCondition:
      "Store below 30°C in moisture-proof packaging.",
  },

  {
    seedId: "prod-vitamin-c-1000",
    name:
      "Vitamin C 1000mg Effervescent Tablets",
    category:
      "Vitamins & Supplements",
    description:
      "High-potency ascorbic acid effervescent formulation for immune support, wound recovery, and antioxidant defense.",
    activeIngredient:
      "Ascorbic Acid (Vitamin C) + Zinc 10mg",
    strength: "1000mg",
    dosageForm:
      "Effervescent Tablet",
    unit:
      "Tubes of 20 Tablets (Pack of 10 Tubes)",
    packSize:
      "200 tablets (10 tubes)",
    referenceBasePrice: 8500,
    commissionPercent: 10,
    maxMarkupPercent: 25,
    status: "ACTIVE",
    storageCondition:
      "Keep tube tightly closed in a cool, dry place.",
  },

  {
    seedId: "prod-metformin-500",
    name:
      "Metformin Hydrochloride 500mg Tablets",
    category:
      "Endocrine & Diabetes Care",
    description:
      "Biguanide oral antihyperglycemic agent for glycemic management in Type 2 Diabetes Mellitus.",
    activeIngredient: "Metformin HCl",
    strength: "500mg",
    dosageForm: "Oral Tablet",
    unit:
      "Packs of 100 Tablets (10x10 Blister)",
    packSize: "100 tablets/pack",
    referenceBasePrice: 2200,
    commissionPercent: 10,
    maxMarkupPercent: 25,
    status: "ACTIVE",
    storageCondition:
      "Store at 20°C–25°C.",
  },

  {
    seedId: "prod-omeprazole-20",
    name:
      "Omeprazole 20mg Delayed-Release Capsules",
    category: "Gastroenterology",
    description:
      "Proton Pump Inhibitor (PPI) for gastric and duodenal ulcers, GERD, and NSAID-induced gastric mucosal protection.",
    activeIngredient:
      "Omeprazole (Enteric Coated Pellets)",
    strength: "20mg",
    dosageForm:
      "Delayed-Release Capsule",
    unit:
      "Packs of 100 Capsules (10x10 Alu-Alu)",
    packSize: "100 capsules/pack",
    referenceBasePrice: 3200,
    commissionPercent: 10,
    maxMarkupPercent: 25,
    status: "ACTIVE",
    storageCondition:
      "Store in moisture-resistant container below 25°C.",
  },

  {
    seedId: "prod-cough-syrup",
    name:
      "Expectorant Cough Syrup with Menthol (100ml)",
    category: "Respiratory & ENT",
    description:
      "Soothes throat irritation, loosens bronchial secretions, and relieves dry or productive cough in hospital outpatients.",
    activeIngredient:
      "Diphenhydramine HCl + Ammonium Chloride + Menthol",
    strength: "14mg/135mg per 5ml",
    dosageForm:
      "Oral Liquid / Syrup",
    unit:
      "Carton of 48 Bottles (100ml Amber Glass)",
    packSize: "48 bottles/carton",
    referenceBasePrice: 24000,
    commissionPercent: 10,
    maxMarkupPercent: 25,
    status: "ACTIVE",
    storageCondition:
      "Do not freeze. Keep away from light.",
  },

  {
    seedId: "prod-ors-sachets",
    name:
      "Oral Rehydration Salts (ORS) WHO Formula",
    category:
      "Emergency & Critical Fluids",
    description:
      "WHO-recommended low-osmolarity oral rehydration formulation for rapid fluid and electrolyte restoration in acute diarrhea and dehydration.",
    activeIngredient:
      "Sodium Chloride + Potassium Chloride + Sodium Citrate + Anhydrous Glucose",
    strength:
      "20.5g powder per sachet (for 1 Litre solution)",
    dosageForm:
      "Soluble Powder Sachet",
    unit: "Box of 100 Sachets",
    packSize: "100 sachets/box",
    referenceBasePrice: 6500,
    commissionPercent: 10,
    maxMarkupPercent: 20,
    status: "ACTIVE",
    storageCondition:
      "Store in dry place below 30°C.",
  },

  {
    seedId: "prod-amlodipine-5",
    name:
      "Amlodipine Besylate 5mg Tablets",
    category:
      "Cardiovascular & Hypertension",
    description:
      "Long-acting Dihydropyridine Calcium Channel Blocker for essential hypertension and chronic stable angina pectoris.",
    activeIngredient:
      "Amlodipine Besylate",
    strength: "5mg",
    dosageForm: "Oral Tablet",
    unit:
      "Packs of 100 Tablets (10x10 Blister)",
    packSize: "100 tablets/pack",
    referenceBasePrice: 2500,
    commissionPercent: 10,
    maxMarkupPercent: 30,
    status: "ACTIVE",
    storageCondition:
      "Protect from moisture and light.",
  },
] as const;

export async function seedProducts() {
  await connectToDB();

  const results = {
    created: [] as string[],
    updated: [] as string[],
    failed: [] as {
      seedId: string;
      name: string;
      error: string;
    }[],
  };

  for (const product of products) {
    try {
      /**
       * seedId is only used by the seeder.
       * It is NOT stored in Product because the current
       * Product schema does not define that field.
       */
      const existingProduct =
        await Product.findOne({
          name: product.name,
        });

      const productDocument = {
        name: product.name,
        category: product.category,
        description: product.description,
        activeIngredient:
          product.activeIngredient,
        strength: product.strength,
        dosageForm: product.dosageForm,
        unit: product.unit,
        packSize: product.packSize,
        referenceBasePrice:
          product.referenceBasePrice,
        commissionPercent:
          product.commissionPercent,
        maxMarkupPercent:
          product.maxMarkupPercent,
        status: product.status,
        storageCondition:
          product.storageCondition,

        requiresColdChain: false,
        controlledDrug: false,
        prescriptionRequired: false,
      };

      if (existingProduct) {
        await Product.updateOne(
          { _id: existingProduct._id },
          { $set: productDocument }
        );

        results.updated.push(product.seedId);
      } else {
        await Product.create(productDocument);

        results.created.push(product.seedId);
      }
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

  /**
   * Resolve actual MongoDB IDs after seeding.
   */
  const seededProducts =
    await Product.find({
      name: {
        $in: products.map(
          (product) => product.name
        ),
      },
    }).select("_id name");

  const productIds: Record<
    string,
    string
  > = {};

  for (const product of products) {
    const found = seededProducts.find(
      (item) => item.name === product.name
    );

    if (found) {
      productIds[product.seedId] =
        found._id.toString();
    }
  }

  return {
    success: results.failed.length === 0,
    totalProducts: products.length,
    productIds,
    results,
  };
}