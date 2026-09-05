// catalogueOptions.ts
export interface OptionItem {
  value: string;
  label: string;
  unitHint?: string;
}

export interface OptionGroup {
  group: string;
  options: OptionItem[];
}

export const DOSAGE_FORM_GROUPS: OptionGroup[] = [
  {
    group: 'Oral Solid Dosage Forms',
    options: [
      { value: 'Oral Tablet', label: 'Oral Tablet (Immediate Release)' },
      { value: 'Oral Film-Coated Tablet', label: 'Oral Film-Coated Tablet' },
      { value: 'Dispersible Tablet', label: 'Oral Dispersible / Chewable Tablet' },
      { value: 'Extended-Release Tablet', label: 'Oral Extended / Sustained-Release Tablet' },
      { value: 'Sublingual Tablet', label: 'Oral Sublingual / Buccal Tablet' },
      { value: 'Hard Gelatin Capsule', label: 'Hard Gelatin Capsule' },
      { value: 'Softgel Capsule', label: 'Softgel / Liquid-Filled Capsule' },
      { value: 'Film-Coated Caplet', label: 'Film-Coated Caplet' },
      { value: 'Effervescent Tablet', label: 'Effervescent Tablet' },
      { value: 'Oral Powder / Granules', label: 'Oral Granules / Sachet Powder' },
      { value: 'Medicated Lozenges', label: 'Medicated Lozenges / Troches' },
    ],
  },
  {
    group: 'Oral Liquid & Pediatric Formulations',
    options: [
      { value: 'Oral Syrup', label: 'Oral Syrup' },
      { value: 'Oral Suspension', label: 'Oral Suspension' },
      { value: 'Oral Solution', label: 'Oral Solution / Elixir' },
      { value: 'Pediatric Oral Drops', label: 'Pediatric Oral Drops' },
      { value: 'Dry Powder for Oral Suspension', label: 'Dry Powder for Oral Suspension' },
    ],
  },
  {
    group: 'Parenteral & Injectable Formulations',
    options: [
      { value: 'Injectable Solution (IV/IM)', label: 'Injectable Solution (IV/IM Ampoule)' },
      { value: 'Infusion Solution (IV)', label: 'Intravenous (IV) Infusion Fluid' },
      { value: 'Powder for Injection (Vial)', label: 'Lyophilized Powder for Injection (Vial + Diluent)' },
      { value: 'Injectable Suspension (Cold-Chain)', label: 'Injectable Suspension (Cold-Chain Insulin / Vaccine)' },
      { value: 'Pre-Filled Syringe (PFS)', label: 'Pre-Filled Syringe (PFS / Subcutaneous)' },
      { value: 'Peritoneal Dialysis Solution', label: 'Peritoneal Dialysis / Irrigation Solution' },
    ],
  },
  {
    group: 'Topical, Ophthalmic & Otic Formulations',
    options: [
      { value: 'Topical Cream', label: 'Topical Cream' },
      { value: 'Topical Ointment', label: 'Topical Ointment' },
      { value: 'Topical Gel', label: 'Topical Gel' },
      { value: 'Transdermal Patch', label: 'Transdermal Patch' },
      { value: 'Sterile Ophthalmic Eye Drops', label: 'Sterile Ophthalmic Eye Drops' },
      { value: 'Ophthalmic Eye Ointment', label: 'Ophthalmic Eye Ointment' },
      { value: 'Otic (Ear) Drops', label: 'Otic (Ear) Drops' },
      { value: 'Nasal Spray / Drops', label: 'Nasal Spray / Drops' },
    ],
  },
  {
    group: 'Inhalation & Respiratory Formulations',
    options: [
      { value: 'Metered Dose Inhaler (MDI)', label: 'Metered Dose Inhaler (MDI Aerosol)' },
      { value: 'Dry Powder Inhaler (DPI)', label: 'Dry Powder Inhaler (DPI Rotacap)' },
      { value: 'Nebulizer Inhalation Solution', label: 'Nebulizer Inhalation Solution' },
    ],
  },
  {
    group: 'Rectal & Vaginal Formulations',
    options: [
      { value: 'Rectal Suppository', label: 'Rectal Suppository' },
      { value: 'Vaginal Pessary / Ovule', label: 'Vaginal Pessary / Ovule' },
      { value: 'Vaginal Cream with Applicator', label: 'Vaginal Cream with Applicator' },
    ],
  },
  {
    group: 'Other / Custom Formulations',
    options: [
      { value: 'OTHER_CUSTOM', label: 'Other / Custom Formulation (Specify)' },
    ],
  },
];

export const PACK_SIZE_GROUPS: OptionGroup[] = [
  {
    group: 'Blister Packs & Strips',
    options: [
      {
        value: '100 tablets/pack',
        label: '10x10 Blister Pack (100 Tablets/Box)',
        unitHint: 'Packs of 100 Tablets (10x10 Blister)',
      },
      {
        value: '100 capsules/pack',
        label: '10x10 Blister Pack (100 Capsules/Box)',
        unitHint: 'Packs of 100 Capsules (10x10 Blister)',
      },
      {
        value: '30 tablets/pack',
        label: '3x10 Blister Pack (30 Tablets/Box)',
        unitHint: 'Packs of 30 Tablets (3x10 Blister)',
      },
      {
        value: '28 tablets/pack',
        label: '2x14 Blister Pack (28 Tablets/Box)',
        unitHint: 'Packs of 28 Tablets (2x14 Blister)',
      },
      {
        value: '20 tablets/pack',
        label: '2x10 Blister Pack (20 Tablets/Box)',
        unitHint: 'Packs of 20 Tablets (2x10 Blister)',
      },
      {
        value: '10 tablets/pack',
        label: '1x10 Blister Pack (10 Tablets/Pack)',
        unitHint: 'Packs of 10 Tablets (1x10 Blister)',
      },
      {
        value: '6 tablets/co-pack',
        label: '1x6 Blister Pack (6 Tablets/Co-Pack)',
        unitHint: 'Packs of 6 Tablets (1x6 Co-Pack)',
      },
      {
        value: '3 tablets/dose-pack',
        label: '1x3 Blister Pack (3 Tablets/Dose-Pack)',
        unitHint: 'Packs of 3 Tablets (1x3 Dose Pack)',
      },
      {
        value: 'Alu-Alu Foil Strip (100s)',
        label: 'Alu-Alu Foil Strip: 10x10 (100 Tablets/Box)',
        unitHint: 'Packs of 100 Tablets (Alu-Alu Strips)',
      },
      {
        value: 'Alu-Alu Foil Strip (14s)',
        label: 'Alu-Alu Foil Strip: 2x7 (14 Tablets/Box)',
        unitHint: 'Packs of 14 Tablets (Alu-Alu Strips)',
      },
    ],
  },
  {
    group: 'Bottles, Jars & Bulk Containers',
    options: [
      {
        value: '100 tablets/jar',
        label: 'HDPE Bottle: 100 Tablets/Jar',
        unitHint: 'Bottles of 100 Tablets',
      },
      {
        value: '500 tablets/jar',
        label: 'HDPE Bottle: 500 Tablets/Hospital Jar',
        unitHint: 'Jars of 500 Tablets (Hospital Bulk)',
      },
      {
        value: '1000 tablets/jar',
        label: 'HDPE Bottle: 1,000 Tablets/Institutional Jar',
        unitHint: 'Jars of 1,000 Tablets (Institutional Pack)',
      },
      {
        value: '60ml bottle',
        label: 'Amber Glass Bottle: 60ml Oral Liquid',
        unitHint: 'Bottles of 60ml Oral Liquid',
      },
      {
        value: '100ml bottle',
        label: 'Amber Glass Bottle: 100ml Oral Liquid',
        unitHint: 'Bottles of 100ml Oral Liquid',
      },
      {
        value: '200ml bottle',
        label: 'Amber Glass Bottle: 200ml Oral Liquid',
        unitHint: 'Bottles of 200ml Oral Liquid',
      },
      {
        value: '15ml dropper bottle',
        label: 'Dropper Bottle: 15ml Pediatric Drops',
        unitHint: 'Bottles of 15ml with Calibrated Dropper',
      },
      {
        value: '10ml dropper bottle',
        label: 'Sterile Dropper Bottle: 10ml Ophthalmic/Otic',
        unitHint: 'Sterile Dropper Bottles of 10ml',
      },
    ],
  },
  {
    group: 'Vials, Ampoules & Injectables',
    options: [
      {
        value: '10 ampoules/box',
        label: 'Box of 10 Ampoules (10 x 2ml / Box)',
        unitHint: 'Boxes of 10 Ampoules (2ml)',
      },
      {
        value: '10 ampoules (5ml)/box',
        label: 'Box of 10 Ampoules (10 x 5ml / Box)',
        unitHint: 'Boxes of 10 Ampoules (5ml)',
      },
      {
        value: '5 ampoules (10ml)/box',
        label: 'Box of 5 Ampoules (5 x 10ml / Box)',
        unitHint: 'Boxes of 5 Ampoules (10ml)',
      },
      {
        value: '50 ampoules/box',
        label: 'Box of 50 Ampoules (Hospital Bulk Pack)',
        unitHint: 'Hospital Bulk Box of 50 Ampoules',
      },
      {
        value: '100 ampoules/box',
        label: 'Box of 100 Ampoules (Clinical Bulk Pack)',
        unitHint: 'Clinical Bulk Box of 100 Ampoules',
      },
      {
        value: '1 vial + diluent',
        label: 'Single Dose Vial + Water for Injection Diluent',
        unitHint: 'Sets of 1 Vial + 1 Diluent Ampoule',
      },
      {
        value: '10 vials/box',
        label: 'Box of 10 Vials (Lyophilized Powder)',
        unitHint: 'Boxes of 10 Vials with Diluent',
      },
      {
        value: '25 vials/box',
        label: 'Box of 25 Vials (Multi-Dose Pack)',
        unitHint: 'Boxes of 25 Multi-Dose Vials',
      },
      {
        value: '5 x 3ml cartridges/pack',
        label: 'Box of 5 Insulin Cartridges (5 x 3ml / Pack)',
        unitHint: 'Packs of 5 Pen Cartridges (3ml)',
      },
      {
        value: '5 pre-filled syringes/box',
        label: 'Box of 5 Pre-Filled Syringes (PFS 0.5ml)',
        unitHint: 'Boxes of 5 Pre-Filled Syringes',
      },
    ],
  },
  {
    group: 'IV Infusions & Large Volume Cases',
    options: [
      {
        value: '10 x 500ml bags/case',
        label: 'Carton of 10 Bags (10 x 500ml IV Bags)',
        unitHint: 'Cases of 10 Infusion Bags (500ml)',
      },
      {
        value: '20 x 500ml bags/case',
        label: 'Carton of 20 Bags (20 x 500ml IV Bags)',
        unitHint: 'Cases of 20 Infusion Bags (500ml)',
      },
      {
        value: '10 x 500ml bottles/case',
        label: 'Carton of 10 Bottles (10 x 500ml IV Bottles)',
        unitHint: 'Cases of 10 Infusion Bottles (500ml)',
      },
      {
        value: '10 x 1000ml bags/case',
        label: 'Carton of 10 Bags (10 x 1,000ml / 1L IV Bags)',
        unitHint: 'Cases of 10 Infusion Bags (1,000ml)',
      },
      {
        value: '20 x 250ml bags/case',
        label: 'Carton of 20 Bags (20 x 250ml IV Bags)',
        unitHint: 'Cases of 20 Infusion Bags (250ml)',
      },
      {
        value: '5L canister',
        label: '5-Litre Hemodialysis Canister / Solution',
        unitHint: 'Canisters of 5 Litres',
      },
    ],
  },
  {
    group: 'Tubes, Inhalers & Topical Packs',
    options: [
      {
        value: '15g tube',
        label: 'Aluminum Tube: 15g Cream/Ointment',
        unitHint: 'Tubes of 15g in Outer Carton',
      },
      {
        value: '30g tube',
        label: 'Aluminum Tube: 30g Cream/Ointment',
        unitHint: 'Tubes of 30g in Outer Carton',
      },
      {
        value: '50g tube',
        label: 'Aluminum Tube: 50g Topical Gel/Ointment',
        unitHint: 'Tubes of 50g in Outer Carton',
      },
      {
        value: '200 doses inhaler',
        label: 'Inhaler Canister: 200 Metered Doses/Device',
        unitHint: 'Aerosol Inhalers with Dose Counter',
      },
      {
        value: '120 sprays nasal spray',
        label: 'Nasal Spray Bottle: 120 Metered Sprays',
        unitHint: 'Bottles of 120 Metered Sprays',
      },
      {
        value: '5 suppositories/box',
        label: 'Box of 5 Suppositories (Strip of 5)',
        unitHint: 'Boxes of 5 Suppositories',
      },
      {
        value: '10 suppositories/box',
        label: 'Box of 10 Suppositories (Strip of 10)',
        unitHint: 'Boxes of 10 Suppositories',
      },
    ],
  },
  {
    group: 'Other / Custom Packaging',
    options: [
      {
        value: 'OTHER_CUSTOM',
        label: 'Other / Custom Packaging (Specify)',
        unitHint: 'Custom Packaging Unit',
      },
    ],
  },
];
