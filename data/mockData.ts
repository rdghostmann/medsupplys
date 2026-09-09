import { 
  PharmaceuticalProduct, 
  Supplier, 
  SupplierListing, 
  ProcurementOrder, 
  Testimonial,
  ServiceDetail,
  FeatureCategory
} from '../types';

export const MOCK_PRODUCTS: PharmaceuticalProduct[] = [
  {
    id: 'prod-001',
    name: 'Paracetamol 500mg BP',
    genericName: 'Acetaminophen / Paracetamol',
    category: 'Analgesics',
    dosageForm: 'Tablets',
    strength: '500 mg',
    packSize: '100 Tablets (10x10 Blister)',
    referencePrice: 2500,
    currency: '₦',
    nafdacRegNumber: 'NAFDAC Reg: A4-1829',
    storageRequirement: 'Room Temperature (15-25°C)',
    activeIngredients: 'Paracetamol 500mg',
    stockStatus: 'In Stock',
    suppliersAvailable: 12,
    minPrice: 2200,
    maxPrice: 2800,
  },
  {
    id: 'prod-002',
    name: 'Amoxicillin + Clavulanic Acid 625mg',
    brandName: 'AmoxiClav-Med',
    genericName: 'Co-Amoxiclav 500/125mg',
    category: 'Antibiotics',
    dosageForm: 'Tablets',
    strength: '625 mg (500mg + 125mg)',
    packSize: '14 Tablets (2x7 Foil Blister)',
    referencePrice: 7800,
    currency: '₦',
    nafdacRegNumber: 'NAFDAC Reg: B2-9421',
    storageRequirement: 'Room Temperature (15-25°C)',
    activeIngredients: 'Amoxicillin Trihydrate 500mg, Potassium Clavulanate 125mg',
    stockStatus: 'In Stock',
    suppliersAvailable: 8,
    minPrice: 7200,
    maxPrice: 8400,
  },
  {
    id: 'prod-003',
    name: 'Artemether + Lumefantrine 80/480mg Forte',
    genericName: 'Artemether / Lumefantrine',
    category: 'Antimalarials',
    dosageForm: 'Tablets',
    strength: '80 mg / 480 mg',
    packSize: '6 Tablets',
    referencePrice: 3400,
    currency: '₦',
    nafdacRegNumber: 'NAFDAC Reg: 04-5820',
    storageRequirement: 'Protect from Light',
    activeIngredients: 'Artemether 80mg, Lumefantrine 480mg',
    stockStatus: 'In Stock',
    suppliersAvailable: 15,
    minPrice: 3100,
    maxPrice: 3750,
  },
  {
    id: 'prod-004',
    name: 'Ceftriaxone Sodium 1g IV/IM Injection',
    genericName: 'Ceftriaxone Sodium Powder with Sterile Diluent',
    category: 'Antibiotics',
    dosageForm: 'Injectable',
    strength: '1 g / Vial',
    packSize: 'Pack of 10 Vials + Water for Injection',
    referencePrice: 16500,
    currency: '₦',
    nafdacRegNumber: 'NAFDAC Reg: B4-3312',
    storageRequirement: 'Cool Storage (<15°C)',
    activeIngredients: 'Ceftriaxone Sodium USP 1g',
    stockStatus: 'In Stock',
    suppliersAvailable: 7,
    minPrice: 15200,
    maxPrice: 17800,
  },
  {
    id: 'prod-005',
    name: 'Regular Human Insulin 100 IU/mL',
    brandName: 'InsuloMed-R',
    genericName: 'Recombinant Human Insulin (rDNA)',
    category: 'Diabetes & Endocrine',
    dosageForm: 'Injectable',
    strength: '100 IU / mL',
    packSize: '10 mL Vial',
    referencePrice: 11200,
    currency: '₦',
    nafdacRegNumber: 'NAFDAC Reg: C1-7890',
    storageRequirement: 'Cold Chain (2-8°C)',
    activeIngredients: 'Human Soluble Insulin 100 IU',
    stockStatus: 'In Stock',
    suppliersAvailable: 5,
    minPrice: 10800,
    maxPrice: 12500,
  },
  {
    id: 'prod-006',
    name: 'Amlodipine Besylate 10mg',
    genericName: 'Amlodipine',
    category: 'Cardiovascular',
    dosageForm: 'Tablets',
    strength: '10 mg',
    packSize: '100 Tablets',
    referencePrice: 4200,
    currency: '₦',
    nafdacRegNumber: 'NAFDAC Reg: A7-2104',
    storageRequirement: 'Room Temperature (15-25°C)',
    activeIngredients: 'Amlodipine Besylate 10mg',
    stockStatus: 'In Stock',
    suppliersAvailable: 11,
    minPrice: 3800,
    maxPrice: 4600,
  },
  {
    id: 'prod-007',
    name: 'Salbutamol Sulfate Inhaler 100mcg',
    genericName: 'Salbutamol Metered Dose Inhaler',
    category: 'Respiratory',
    dosageForm: 'Inhaler',
    strength: '100 mcg / Actuation',
    packSize: '200 Metered Doses',
    referencePrice: 5600,
    currency: '₦',
    nafdacRegNumber: 'NAFDAC Reg: 04-9122',
    storageRequirement: 'Room Temperature (15-25°C)',
    activeIngredients: 'Salbutamol Sulfate 100mcg/puff',
    stockStatus: 'Limited Stock',
    suppliersAvailable: 6,
    minPrice: 5200,
    maxPrice: 6200,
  },
  {
    id: 'prod-008',
    name: 'Ciprofloxacin 500mg USP',
    genericName: 'Ciprofloxacin Hydrochloride',
    category: 'Antibiotics',
    dosageForm: 'Tablets',
    strength: '500 mg',
    packSize: '100 Tablets (10x10)',
    referencePrice: 6400,
    currency: '₦',
    nafdacRegNumber: 'NAFDAC Reg: B1-4491',
    storageRequirement: 'Room Temperature (15-25°C)',
    activeIngredients: 'Ciprofloxacin HCl 500mg',
    stockStatus: 'In Stock',
    suppliersAvailable: 14,
    minPrice: 5900,
    maxPrice: 6900,
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-01',
    name: 'Apex Pharmaceutical Distributors Ltd',
    type: 'Distributor',
    rating: 4.9,
    reviewCount: 142,
    location: 'Ikeja Industrial Estate, Lagos',
    verified: true,
    nafdacLicense: 'NAF-WDD-2021-0988',
    gdpCertified: true,
    productCount: 420,
    establishedYear: 2011,
    fulfillmentRate: 99.2,
    minOrderValue: '₦150,000',
    leadTime: '24-48 Hours',
    description: 'Tier-1 wholesale pharmaceutical distributor certified in Good Distribution Practices (GDP) with multi-temperature warehouse logistics.',
    contactEmail: 'orders@apexpharmadist.com',
    contactPhone: '+234 1 889 4210'
  },
  {
    id: 'sup-02',
    name: 'Zenith Global Healthcare Importers',
    type: 'Importer',
    rating: 4.8,
    reviewCount: 98,
    location: 'Victoria Island, Lagos / Abuja FCT Hub',
    verified: true,
    nafdacLicense: 'NAF-IMP-2018-0412',
    gdpCertified: true,
    productCount: 680,
    establishedYear: 2008,
    fulfillmentRate: 98.6,
    minOrderValue: '₦500,000',
    leadTime: '48-72 Hours',
    description: 'Exclusive direct import partner for WHO-prequalified oncology, critical care injections, and chronic disease therapeutics.',
    contactEmail: 'procure@zenithhealthimporters.com',
    contactPhone: '+234 1 773 9011'
  },
  {
    id: 'sup-03',
    name: 'LifeLine Cold-Chain Logistics & Supply',
    type: 'Distributor',
    rating: 4.95,
    reviewCount: 175,
    location: 'Trans-Amadi, Port Harcourt & Ibadan Hub',
    verified: true,
    nafdacLicense: 'NAF-WDD-2019-1140',
    gdpCertified: true,
    productCount: 310,
    establishedYear: 2015,
    fulfillmentRate: 99.7,
    minOrderValue: '₦200,000',
    leadTime: '24-36 Hours',
    description: 'Specialists in 2-8°C biologicals, vaccines, insulin, and temperature-monitored pharmaceutical cold supply chains.',
    contactEmail: 'logistics@lifelinecoldchain.com',
    contactPhone: '+234 84 920 188'
  },
  {
    id: 'sup-04',
    name: 'PrimeCare Institutional Wholesale',
    type: 'Retailer',
    rating: 4.7,
    reviewCount: 84,
    location: 'Central Business District, Abuja',
    verified: true,
    nafdacLicense: 'NAF-RET-2022-0331',
    gdpCertified: true,
    productCount: 220,
    establishedYear: 2017,
    fulfillmentRate: 97.8,
    minOrderValue: '₦50,000',
    leadTime: 'Same Day / 24 Hours',
    description: 'Agile fulfillment supplier for private clinics and community hospital outpatient dispensaries requiring flexible MOQs.',
    contactEmail: 'support@primecarewholesale.ng',
    contactPhone: '+234 9 460 3381'
  }
];

export const MOCK_PRODUCT_SUPPLIERS: SupplierListing[] = [
  {
    id: 'list-01',
    productId: 'prod-001',
    supplierId: 'sup-01',
    supplierName: 'Apex Pharmaceutical Distributors Ltd',
    supplierType: 'Distributor',
    unitPrice: 2350,
    currency: '₦',
    stockQuantity: 4500,
    minimumOrderQuantity: 50,
    batchNumber: 'APX-24-9081',
    expiryDate: '11/2027',
    leadTimeDays: 1,
    inStock: true,
    verified: true,
    rating: 4.9
  },
  {
    id: 'list-02',
    productId: 'prod-001',
    supplierId: 'sup-02',
    supplierName: 'Zenith Global Healthcare Importers',
    supplierType: 'Importer',
    unitPrice: 2200,
    currency: '₦',
    stockQuantity: 18000,
    minimumOrderQuantity: 200,
    batchNumber: 'ZGH-24-1142',
    expiryDate: '03/2028',
    leadTimeDays: 2,
    inStock: true,
    verified: true,
    rating: 4.8
  },
  {
    id: 'list-03',
    productId: 'prod-001',
    supplierId: 'sup-04',
    supplierName: 'PrimeCare Institutional Wholesale',
    supplierType: 'Retailer',
    unitPrice: 2600,
    currency: '₦',
    stockQuantity: 1200,
    minimumOrderQuantity: 10,
    batchNumber: 'PC-24-0044',
    expiryDate: '08/2027',
    leadTimeDays: 1,
    inStock: true,
    verified: true,
    rating: 4.7
  }
];

export const MOCK_ORDERS: ProcurementOrder[] = [
  {
    id: 'ord-1049',
    orderNumber: 'PO-2026-8941',
    buyerName: 'St. Nicholas Specialist Hospital',
    buyerType: 'Teaching Hospital',
    supplierName: 'Apex Pharmaceutical Distributors Ltd',
    supplierType: 'Distributor',
    itemsCount: 4,
    productsSummary: 'Ceftriaxone 1g (200 vls), AmoxiClav 625mg (150 pks)',
    totalAmount: 4470000,
    currency: '₦',
    status: 'Dispatched',
    orderDate: 'May 14, 2026',
    expectedDelivery: 'May 16, 2026',
    trackingNumber: 'TRK-MED-8941-NG',
    deliveryAddress: 'Central Pharmacy Receiving Bay, Lagos Island'
  },
  {
    id: 'ord-1048',
    orderNumber: 'PO-2026-8940',
    buyerName: 'Lagoon Clinics & Diagnostics',
    buyerType: 'Private Clinic',
    supplierName: 'LifeLine Cold-Chain Logistics',
    supplierType: 'Distributor',
    itemsCount: 2,
    productsSummary: 'Regular Human Insulin 100 IU/mL (80 vials)',
    totalAmount: 896000,
    currency: '₦',
    status: 'Delivered',
    orderDate: 'May 13, 2026',
    expectedDelivery: 'May 14, 2026',
    trackingNumber: 'TRK-MED-8940-COLD',
    deliveryAddress: 'Main Outpatient Dispensary, Ikoyi'
  },
  {
    id: 'ord-1047',
    orderNumber: 'PO-2026-8939',
    buyerName: 'National Hospital Procurement Directorate',
    buyerType: 'Teaching Hospital',
    supplierName: 'Zenith Global Healthcare Importers',
    supplierType: 'Importer',
    itemsCount: 8,
    productsSummary: 'Emergency Critical Care & Anaesthesia Batch A',
    totalAmount: 18450000,
    currency: '₦',
    status: 'Processing',
    orderDate: 'May 15, 2026',
    expectedDelivery: 'May 18, 2026',
    trackingNumber: 'TRK-MED-8939-GOV',
    deliveryAddress: 'Federal Medical Stores, Central District Abuja'
  },
  {
    id: 'ord-1046',
    orderNumber: 'PO-2026-8938',
    buyerName: 'HealthPlus Pharmacy Network',
    buyerType: 'Community Pharmacy',
    supplierName: 'Apex Pharmaceutical Distributors Ltd',
    supplierType: 'Distributor',
    itemsCount: 12,
    productsSummary: 'Paracetamol 500mg, Artemether/Lumefantrine Forte',
    totalAmount: 3120000,
    currency: '₦',
    status: 'Verification',
    orderDate: 'May 15, 2026',
    expectedDelivery: 'May 17, 2026',
    trackingNumber: 'TRK-MED-8938-RET',
    deliveryAddress: 'Distribution Hub, Ikeja'
  }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    quote: 'MedSupply has significantly reduced the time our procurement team spends searching for pharmaceutical suppliers. Comparing multiple verified distributor quotes in minutes has cut our procurement turnaround by over 60%.',
    author: 'Dr. Chidinma Okafor, PharmD',
    role: 'Director of Pharmacy & Clinical Supplies',
    organization: 'Cedarcrest Hospitals Group',
    organizationType: 'Multi-Center Hospital System',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'test-2',
    quote: 'Having supplier comparison, batch verification, and cold-chain temperature tracking in one platform has completely transformed our procurement workflow and regulatory audit compliance.',
    author: 'Babatunde Adeleke',
    role: 'Chief Procurement Officer',
    organization: 'MetroCare Health Network',
    organizationType: 'Regional Healthcare Network',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'test-3',
    quote: 'As an importer of WHO-prequalified therapeutics, listing on MedSupply gave us direct structured orders from verified tertiary hospitals without payment friction or manual broker middlemen.',
    author: 'Khadija Bello',
    role: 'Managing Director',
    organization: 'Zenith Global Healthcare Importers',
    organizationType: 'Licensed Pharmaceutical Importer',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'
  }
];

export const MOCK_SERVICES: ServiceDetail[] = [
  {
    id: 'sourcing',
    title: 'Pharmaceutical Sourcing',
    tagline: 'Source over 1,500+ verified pharmaceutical products directly',
    description: 'Find prescription pharmaceuticals, OTC formulations, critical care injectables, and hospital consumables from verified manufacturers, authorized importers, and licensed wholesale distributors.',
    icon: 'Search',
    benefits: [
      'Search by Brand, Active Pharmaceutical Ingredient (API), or NAFDAC Reg',
      'View real-time factory and warehouse batch availability',
      'Direct access to cold-chain biologics and controlled medicines',
      'Filter by dosage form, therapeutic category, and storage requirements'
    ],
    keyMetrics: '1,500+ Verified SKUs',
    badge: 'Core Sourcing'
  },
  {
    id: 'marketplace',
    title: 'Supplier Marketplace',
    tagline: 'Multi-tier qualified supplier network categorized by trade tier',
    description: 'Discover qualified pharmaceutical suppliers segmented into licensed Importers, national Distributors, and verified Retailers with transparent minimum order quantities (MOQ).',
    icon: 'Building2',
    benefits: [
      'Segmented supplier profiles with license numbers and warehouse locations',
      'Audited ratings, fulfillment rates, and historical lead-times',
      'Direct RFQ (Request for Quotation) transmission to multiple vendors',
      'Verified Good Distribution Practice (GDP) certification badges'
    ],
    keyMetrics: '250+ Verified Suppliers',
    badge: 'Marketplace'
  },
  {
    id: 'verification',
    title: 'Supplier Verification & Compliance',
    tagline: 'Multi-stage regulatory compliance and license verification',
    description: 'Mitigate counterfeit risk and regulatory penalties. Every supplier on MedSupply undergoes stringent regulatory validation including NAFDAC licensing and physical warehouse auditing.',
    icon: 'ShieldCheck',
    benefits: [
      'Live validation of Pharmacists Council and NAFDAC premises licenses',
      'Periodic physical cold-chain and storage inspection audits',
      'Automated expiration tracking for supplier accreditation documents',
      'Zero-tolerance anti-counterfeit traceability enforcement'
    ],
    keyMetrics: '100% Verified Vendors',
    badge: 'Compliance First'
  },
  {
    id: 'price-intelligence',
    title: 'Price Intelligence & Comparison',
    tagline: 'Compare supplier price points and terms transparently',
    description: 'Eliminate arbitrary broker markups. Compare line-item pricing across competing suppliers side-by-side with volume-based tiered discounts clearly displayed.',
    icon: 'BarChart3',
    benefits: [
      'Side-by-side unit pricing comparison across verified vendors',
      'Historical price trend indicators for therapeutic categories',
      'Volume tier discounting matrices for large institutional buyers',
      'Exportable price audit sheets for hospital finance review'
    ],
    keyMetrics: 'Up to 22% Cost Savings',
    badge: 'Transparent Pricing'
  },
  {
    id: 'procurement-mgmt',
    title: 'Procurement Management',
    tagline: 'Centralize purchase requisitions, approvals, and PO generation',
    description: 'Modernize hospital procurement with structured digital workflows. Route requisitions from ward pharmacists to finance controllers and automatically issue legal Purchase Orders.',
    icon: 'ClipboardList',
    benefits: [
      'Multi-level institutional approval matrices with spending limits',
      'Automated digital Purchase Order (PO) creation with legal terms',
      'Consolidated multi-supplier billing and reconciliation statements',
      'ERP / Hospital Information System (HIS) export compatibility'
    ],
    keyMetrics: '4x Faster Approvals',
    badge: 'Workflow Automation'
  },
  {
    id: 'order-tracking',
    title: 'Order Tracking & Delivery Logistics',
    tagline: 'Live tracking from warehouse dispatch to pharmacy receiving dock',
    description: 'Gain total visibility into your healthcare supply chain with GPS-enabled tracking, cold-chain temperature telemetry, and digital Proof-of-Delivery signing.',
    icon: 'Truck',
    benefits: [
      'End-to-end timeline tracking with live status notifications',
      'Cold-chain temperature data logger verification upon delivery',
      'Digital receiving confirmation and batch discrepancy reporting',
      'Dedicated logistics escalation team for urgent critical care orders'
    ],
    keyMetrics: '98% On-Time Delivery',
    badge: 'Full Visibility'
  },
  {
    id: 'analytics',
    title: 'Procurement Analytics',
    tagline: 'Data-driven pharmaceutical spend optimization and forecasting',
    description: 'Unlock enterprise business intelligence. Analyze category spend, supplier performance, stock run-out risks, and seasonal demand fluctuations across your facility.',
    icon: 'TrendingUp',
    benefits: [
      'Executive dashboard tracking therapeutic category expenditure',
      'Supplier on-time fulfillment and quality dispute scorecards',
      'Lead-time forecasting to prevent critical drug stock-outs',
      'Downloadable audit-ready financial and regulatory compliance reports'
    ],
    keyMetrics: '360° Spend Analytics',
    badge: 'Intelligence'
  },
  {
    id: 'compliance-support',
    title: 'Regulatory & Compliance Support',
    tagline: 'Full audit trails, batch release records, and certificates',
    description: 'Maintain compliance with health authorities. Every batch procured on MedSupply comes with digital Certificates of Analysis (CoA) and tamper-proof audit trails.',
    icon: 'FileCheck',
    benefits: [
      'Instant access to digital Certificates of Analysis (CoA) for all batches',
      'Tamper-evident audit logging for all procurement actions and approvals',
      'Automated batch recall notification broadcasting system',
      'Support for national pharmacovigilance adverse event reporting'
    ],
    keyMetrics: 'Audit-Proof System',
    badge: 'Safe & Secure'
  }
];

export const MOCK_FEATURES: FeatureCategory[] = [
  {
    id: 'procurement-core',
    name: 'Procurement & Sourcing',
    description: 'Core tools designed specifically for hospital and clinic procurement teams',
    features: [
      {
        title: 'Master Pharmaceutical Catalogue',
        description: 'Standardized national drug formulary with unified generic names, strengths, packaging specs, and approved NAFDAC registrations.',
        icon: 'Boxes'
      },
      {
        title: 'Supplier Marketplace',
        description: 'Direct access to vetted importers and distributors with transparent inventory levels and verifiable Good Distribution Practices.',
        icon: 'Building2'
      },
      {
        title: 'Intelligent Supplier Matching',
        description: 'Algorithms that match your requisition with suppliers offering the optimal balance of price, stock availability, and delivery proximity.',
        icon: 'Search',
        badge: 'Smart Matching'
      },
      {
        title: 'Digital Purchase Orders',
        description: 'Generate standardized enterprise purchase orders automatically, complete with institutional terms, payment conditions, and tax details.',
        icon: 'ClipboardList'
      }
    ]
  },
  {
    id: 'pricing-inventory',
    name: 'Pricing & Batch Transparency',
    description: 'Complete clarity on costs, batch specifics, and clinical viability',
    features: [
      {
        title: 'Real-Time Price Comparison',
        description: 'Multi-supplier line item pricing comparison to ensure your organization always secures fair, competitive market rates.',
        icon: 'BarChart3'
      },
      {
        title: 'Batch & Lot Traceability',
        description: 'Inspect exact batch and lot numbers prior to placing orders, verifying remaining shelf life and factory manufacture dates.',
        icon: 'BadgeCheck'
      },
      {
        title: 'Expiry Date Visibility',
        description: 'Guaranteed minimum shelf-life disclosures on every lot to prevent receiving near-expiry inventory.',
        icon: 'Clock'
      },
      {
        title: 'Storage & Cold-Chain Specs',
        description: 'Rigorous indicators for controlled room temperature, refrigerated (2-8°C), and light-sensitive compounds.',
        icon: 'ShieldCheck'
      }
    ]
  },
  {
    id: 'operations-security',
    name: 'Security, Compliance & Governance',
    description: 'Enterprise security standards built for healthcare institutions',
    features: [
      {
        title: 'Role-Based Access Control',
        description: 'Configurable permissions for Ward Pharmacists, Chief Pharmacists, Finance Officers, and Hospital Directors.',
        icon: 'Lock'
      },
      {
        title: 'Immutable Audit Logs',
        description: 'Full chronological history of every requisition, quote request, PO approval, and goods delivery for compliance audits.',
        icon: 'FileCheck'
      },
      {
        title: 'Automated Status Notifications',
        description: 'Instant multi-channel alerts via email, SMS, and portal notifications for order approvals, dispatches, and delivery arrival.',
        icon: 'CheckCircle2'
      },
      {
        title: 'Encrypted Health Data',
        description: 'End-to-end 256-bit encryption for all commercial transactions, proprietary supplier pricing, and institutional records.',
        icon: 'ShieldCheck'
      }
    ]
  }
];

export const FAQS = [
  {
    question: 'How does MedSupply work for healthcare buyers?',
    answer: 'MedSupply operates as a curated B2B procurement network. Hospital procurement teams and licensed pharmacies search our standardized pharmaceutical catalogue, compare line-item quotes from verified distributors and importers, issue formal digital purchase orders, and track deliveries with cold-chain oversight from warehouse to dispensary.'
  },
  {
    question: 'Who is eligible to purchase medicines through MedSupply?',
    answer: 'MedSupply is strictly a B2B platform. Access is restricted to licensed healthcare organizations including teaching hospitals, private medical clinics, retail pharmacy chains, community health boards, and authorized corporate medical centers. All buying entities must submit their operating license during onboarding.'
  },
  {
    question: 'How does MedSupply verify pharmaceutical suppliers?',
    answer: 'Every supplier on our platform undergoes a rigorous 4-step compliance audit: validation of national regulatory licenses (such as NAFDAC and Pharmacy Council operating permits), corporate registry authentication, verification of physical Good Distribution Practice (GDP) warehouse standards, and strict anti-counterfeiting history checks.'
  },
  {
    question: 'What is the difference between Importer, Distributor, and Retailer tiers?',
    answer: 'Importers bring WHO-prequalified and registered therapeutics into the country in bulk with higher Minimum Order Quantities (MOQ). Distributors maintain regional warehouses and offer intermediate pack sizes with 24-48 hour delivery. Retailers and institutional suppliers cater to smaller clinics requiring lower MOQs with same-day or rapid fulfillment.'
  },
  {
    question: 'Can our hospital compare prices across multiple suppliers before ordering?',
    answer: 'Yes. MedSupply provides instant side-by-side pricing matrices showing unit prices, pack sizes, volume-discount tiers, batch numbers, remaining shelf-life, and delivery lead times from every verified supplier carrying that SKU.'
  },
  {
    question: 'How does MedSupply ensure cold-chain integrity during delivery?',
    answer: 'Cold-chain products (such as insulin, biologicals, and vaccines) are fulfilled exclusively by GDP-certified distributors equipped with calibrated temperature-controlled active coolers and data loggers. Temperature compliance reports are verified at handover before goods receipt is signed.'
  }
];

export const PLATFORM_STATS = {
  productsCount: '1,500+',
  suppliersCount: '250+',
  buyersCount: '1,000+',
  procurementValue: '₦500M+',
  fulfillmentRate: '98.4%',
  platformUptime: '99.9%',
  averageDeliveryHours: '28 hrs',
  savingsPercentage: '18%'
};

export const MONTHLY_PROCUREMENT_DATA = [
  { month: 'Jun 2025', volumeMln: 28.5, orders: 420, activeSuppliers: 160 },
  { month: 'Jul 2025', volumeMln: 34.2, orders: 510, activeSuppliers: 178 },
  { month: 'Aug 2025', volumeMln: 39.8, orders: 590, activeSuppliers: 195 },
  { month: 'Sep 2025', volumeMln: 46.0, orders: 680, activeSuppliers: 210 },
  { month: 'Oct 2025', volumeMln: 52.4, orders: 760, activeSuppliers: 225 },
  { month: 'Nov 2025', volumeMln: 61.1, orders: 890, activeSuppliers: 238 },
  { month: 'Dec 2025', volumeMln: 68.7, orders: 940, activeSuppliers: 245 },
  { month: 'Jan 2026', volumeMln: 74.3, orders: 1020, activeSuppliers: 250 },
  { month: 'Feb 2026', volumeMln: 82.0, orders: 1110, activeSuppliers: 255 },
  { month: 'Mar 2026', volumeMln: 89.5, orders: 1190, activeSuppliers: 260 },
  { month: 'Apr 2026', volumeMln: 96.2, orders: 1280, activeSuppliers: 268 },
  { month: 'May 2026', volumeMln: 104.8, orders: 1390, activeSuppliers: 275 },
];

export const CATEGORY_SPEND_DISTRIBUTION = [
  { name: 'Antibiotics & Anti-infectives', value: 32, color: '#0f766e' },
  { name: 'Cardiovascular & Metabolic', value: 24, color: '#0284c7' },
  { name: 'Analgesics & Anti-inflammatory', value: 16, color: '#059669' },
  { name: 'Antimalarials & Tropical', value: 14, color: '#d97706' },
  { name: 'Cold Chain & Biologics', value: 10, color: '#6366f1' },
  { name: 'Critical Care & Anesthetics', value: 4, color: '#8b5cf6' },
];
