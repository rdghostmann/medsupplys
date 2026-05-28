export type PayoutStatus = 'Paid' | 'Awaiting Verification' | 'Failed';

export interface OrderDetail {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  itemsCount: number;
}

export interface PayoutRecord {
  id: string;
  date: string;
  ordersCount: number;
  gross: number;
  platformFee: number;
  netPayout: number;
  status: PayoutStatus;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  orders: OrderDetail[];
}

export interface BankAccountDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  routingCode?: string;
}



export const INITIAL_PAYOUTS: PayoutRecord[] = [
  {
    id: 'PO-001',
    date: 'Dec 8, 2024',
    ordersCount: 4,
    gross: 200000,
    platformFee: 20000,
    netPayout: 180000,
    status: 'Paid',
    bankAccount: {
      bankName: 'Guaranty Trust Bank (GTB)',
      accountNumber: '012****345',
      accountName: 'Randal Wilson'
    },
    orders: [
      { id: 'ORD-9023', customerName: 'Amara Okechukwu', amount: 55000, date: 'Dec 7, 2024', itemsCount: 2 },
      { id: 'ORD-9019', customerName: 'Kenechukwu Alabi', amount: 45000, date: 'Dec 6, 2024', itemsCount: 1 },
      { id: 'ORD-8998', customerName: 'Tunde Bakare', amount: 65000, date: 'Dec 5, 2024', itemsCount: 3 },
      { id: 'ORD-8942', customerName: 'Sade Adebayo', amount: 35000, date: 'Dec 4, 2024', itemsCount: 1 }
    ]
  },
  {
    id: 'PO-002',
    date: 'Nov 30, 2024',
    ordersCount: 6,
    gross: 320000,
    platformFee: 32000,
    netPayout: 288000,
    status: 'Paid',
    bankAccount: {
      bankName: 'Zenith Bank',
      accountNumber: '208****912',
      accountName: 'Randal Wilson'
    },
    orders: [
      { id: 'ORD-8812', customerName: 'Chioma Nwachukwu', amount: 80000, date: 'Nov 29, 2024', itemsCount: 4 },
      { id: 'ORD-8799', customerName: 'Babajide Sanwo', amount: 42000, date: 'Nov 28, 2024', itemsCount: 1 },
      { id: 'ORD-8750', customerName: 'Efe Omowunmi', amount: 110000, date: 'Nov 27, 2024', itemsCount: 5 },
      { id: 'ORD-8711', customerName: 'Fatima Yusuf', amount: 38000, date: 'Nov 25, 2024', itemsCount: 2 },
      { id: 'ORD-8690', customerName: 'Chidi Megwa', amount: 30000, date: 'Nov 24, 2024', itemsCount: 1 },
      { id: 'ORD-8511', customerName: 'Ibrahim Lassa', amount: 20000, date: 'Nov 22, 2024', itemsCount: 1 }
    ]
  },
  {
    id: 'PO-003',
    date: 'Nov 15, 2024',
    ordersCount: 3,
    gross: 150000,
    platformFee: 15000,
    netPayout: 135000,
    status: 'Paid',
    bankAccount: {
      bankName: 'Guaranty Trust Bank (GTB)',
      accountNumber: '012****345',
      accountName: 'Randal Wilson'
    },
    orders: [
      { id: 'ORD-8340', customerName: 'Oluwaseun Ajayi', amount: 75000, date: 'Nov 14, 2024', itemsCount: 3 },
      { id: 'ORD-8312', customerName: 'Emeka Obi', amount: 45000, date: 'Nov 12, 2024', itemsCount: 2 },
      { id: 'ORD-8290', customerName: 'Yinka Shonibare', amount: 30000, date: 'Nov 11, 2024', itemsCount: 1 }
    ]
  },
  {
    id: 'PO-004',
    date: 'Pending',
    ordersCount: 3,
    gross: 378000,
    platformFee: 38000,
    netPayout: 340000, // Matching the #340K Pending Payout in card exactly! Let's correct 378000 - 38000 = 340000. 378000 - 37800 (10%) would yield 340,200. To align exactly with the screenshot's #378,000, #38,000 platform fee, and #340,000 net, we will stick to these exact values!
    status: 'Awaiting Verification',
    bankAccount: {
      bankName: 'Guaranty Trust Bank (GTB)',
      accountNumber: '012****345',
      accountName: 'Randal Wilson'
    },
    orders: [
      { id: 'ORD-9450', customerName: 'Zainab Balogun', amount: 150000, date: 'May 26, 2026', itemsCount: 4 },
      { id: 'ORD-9442', customerName: 'Obinna Okeke', amount: 128000, date: 'May 25, 2026', itemsCount: 3 },
      { id: 'ORD-9411', customerName: 'Funmi Alao', amount: 100000, date: 'May 23, 2026', itemsCount: 2 }
    ]
  }
];

export const NIGERIAN_BANKS = [
  'Access Bank',
  'Citibank Nigeria',
  'Ecobank Nigeria',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'First City Monument Bank (FCMB)',
  'Guaranty Trust Bank (GTB)',
  'Heritage Bank',
  'Keystone Bank',
  'Providus Bank',
  'Polaris Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'Union Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Wema Bank',
  'Zenith Bank'
];
