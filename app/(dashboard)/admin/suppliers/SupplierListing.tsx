import React from 'react'

const supplierUsers = [
    {
        id: 'usr-buyer-1',
        name: 'Dr. Tunde Fashola (Procurement Director)',
        email: 'procurement@luth.edu.ng',
        role: 'BUYER',
        organization: 'Lagos University Teaching Hospital (LUTH)',
        phone: '+234 802 334 9911',
        address: 'Idi-Araba, Surulere, Lagos State, Nigeria',
        createdAt: '2025-01-10T08:00:00.000Z',
    },
    // 9 Suppliers: 3 Importers, 3 Distributors, 3 Retailers
    {
        id: 'sup-may-baker',
        name: 'May & Baker Nigeria Plc',
        email: 'sales@may-baker.com',
        role: 'SUPPLIER',
        organization: 'May & Baker Nigeria Plc',
        supplierType: 'IMPORTER',
        supplierApprovalStatus: 'APPROVED',
        phone: '+234 1 270 4780',
        address: '1 May & Baker Avenue, Ikeja Industrial Estate, Lagos',
        licenseNumber: 'PCN-IMP-2024-0012',
        createdAt: '2024-03-01T10:00:00.000Z',
    },
    {
        id: 'sup-fidson',
        name: 'Fidson Healthcare Plc',
        email: 'orders@fidson.com',
        role: 'SUPPLIER',
        organization: 'Fidson Healthcare Plc',
        supplierType: 'IMPORTER',
        supplierApprovalStatus: 'APPROVED',
        phone: '+234 1 740 6817',
        address: '268 Ikorodu Road, Obanikoro, Lagos',
        licenseNumber: 'PCN-IMP-2024-0019',
        createdAt: '2024-03-05T11:00:00.000Z',
    },
    {
        id: 'sup-neimeth',
        name: 'Neimeth International Pharmaceuticals Plc',
        email: 'b2b@neimethplc.com.ng',
        role: 'SUPPLIER',
        organization: 'Neimeth Pharmaceuticals',
        supplierType: 'IMPORTER',
        supplierApprovalStatus: 'APPROVED',
        phone: '+234 1 496 3804',
        address: '1 Henry Carr Street, Industrial Estate, Ikeja, Lagos',
        licenseNumber: 'PCN-IMP-2024-0033',
        createdAt: '2024-03-12T09:00:00.000Z',
    },
    {
        id: 'sup-emzor',
        name: 'Emzor Pharmaceutical Industries Ltd',
        email: 'distributors@emzorpharma.com',
        role: 'SUPPLIER',
        organization: 'Emzor Pharmaceuticals',
        supplierType: 'DISTRIBUTOR',
        supplierApprovalStatus: 'APPROVED',
        phone: '+234 1 497 4410',
        address: 'Plot 3C, Block A, Ajao Estate, Isolo, Lagos',
        licenseNumber: 'PCN-DIS-2024-0105',
        createdAt: '2024-04-01T08:30:00.000Z',
    },
    {
        id: 'sup-swipha',
        name: 'Swiss Pharma Nigeria Ltd (Swipha)',
        email: 'orders@swiphanigeria.com',
        role: 'SUPPLIER',
        organization: 'Swiss Pharma Nigeria',
        supplierType: 'DISTRIBUTOR',
        supplierApprovalStatus: 'APPROVED',
        phone: '+234 1 492 0543',
        address: '5 Dopemu Road, Agege, Lagos',
        licenseNumber: 'PCN-DIS-2024-0118',
        createdAt: '2024-04-15T14:00:00.000Z',
    },
    {
        id: 'sup-juhel',
        name: 'Juhel Nigeria Limited',
        email: 'sales@juhelpharma.com',
        role: 'SUPPLIER',
        organization: 'Juhel Nigeria Ltd',
        supplierType: 'DISTRIBUTOR',
        supplierApprovalStatus: 'APPROVED',
        phone: '+234 42 258 871',
        address: '35 Awka Road, Trans-Ekulu, Enugu / Ikeja Branch',
        licenseNumber: 'PCN-DIS-2024-0142',
        createdAt: '2024-05-02T10:00:00.000Z',
    },
    {
        id: 'sup-healthplus',
        name: 'HealthPlus Pharmacy B2B Fleet',
        email: 'fleet@healthplus.com.ng',
        role: 'SUPPLIER',
        organization: 'HealthPlus Pharmacy',
        supplierType: 'RETAILER',
        supplierApprovalStatus: 'APPROVED',
        phone: '+234 816 687 2300',
        address: '11B Admiralty Way, Lekki Phase 1, Lagos',
        licenseNumber: 'PCN-RET-2024-0801',
        createdAt: '2024-06-01T12:00:00.000Z',
    },
    {
        id: 'sup-medplus',
        name: 'MedPlus Pharmacy Chain Distribution',
        email: 'wholesale@medplus.ng',
        role: 'SUPPLIER',
        organization: 'MedPlus Pharmacy',
        supplierType: 'RETAILER',
        supplierApprovalStatus: 'APPROVED',
        phone: '+234 803 333 4455',
        address: '45 Saka Tinubu Street, Victoria Island, Lagos',
        licenseNumber: 'PCN-RET-2024-0844',
        createdAt: '2024-06-10T13:00:00.000Z',
    },
    {
        id: 'sup-mopheth',
        name: 'Mopheth Pharmacy Group',
        email: 'commercial@mophethgroup.com',
        role: 'SUPPLIER',
        organization: 'Mopheth Pharmacy',
        supplierType: 'RETAILER',
        supplierApprovalStatus: 'APPROVED',
        phone: '+234 809 999 1234',
        address: '30 Victoria Island / Ikoyi Link Corridor, Lagos',
        licenseNumber: 'PCN-RET-2024-0902',
        createdAt: '2024-06-20T09:00:00.000Z',
    },
    // Pharmacist
    {
        id: 'usr-pharmacist-1',
        name: 'Pharm. Dr. Amaka Obi (B.Pharm, PharmD, FPSN)',
        email: 'amaka.obi@medsupply.com',
        role: 'PHARMACIST',
        organization: 'MediSupply Quality Assurance & Compliance Dept',
        phone: '+234 803 712 4490',
        pharmacistLicense: 'PCN-REG-2016-44912',
        address: 'MediSupply Central Inspection Hub, Ikeja, Lagos',
        createdAt: '2024-01-15T08:00:00.000Z',
    },
    // Admin
    {
        id: 'usr-admin-1',
        name: 'Engr. Randal Wilson (Super Admin)',
        email: 'admin@medsupply.com',
        role: 'ADMIN',
        organization: 'MediSupply Global Infrastructure',
        phone: '+234 800 633 4787',
        address: 'MediSupply Headquarters, Victoria Island, Lagos',
        createdAt: '2024-01-01T00:00:00.000Z',
    },
];
const SupplierListing = () => {

    const handleUpdateSupplierStatus = async (supplierId: string, status: string) => {

    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
         <div className="overflow-hidden">
               <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Supplier Pool & Regulatory Verification (9 Verified Entities)
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10.5px] border-b border-slate-100">
                        <tr>
                            <th className="py-3.5 px-4 font-semibold">Supplier Name & Organization</th>
                            <th className="py-3.5 px-4 font-semibold">Tier Classification</th>
                            <th className="py-3.5 px-4 font-semibold">Fulfillment Rating</th>
                            <th className="py-3.5 px-4 font-semibold">KYC Verification Status</th>
                            <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {supplierUsers.map((sup) => (
                            <tr key={sup.id} className="hover:bg-slate-50 transition">
                                <td className="py-3.5 px-4">
                                    <div className="font-semibold text-slate-900">{sup.organization || sup.name}</div>
                                    <div className="text-[11px] text-slate-500 font-mono">Contact: {sup.email}</div>
                                </td>
                                <td className="py-3.5 px-4">
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${sup.supplierType === 'IMPORTER'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : sup.supplierType === 'DISTRIBUTOR'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-slate-100 text-slate-700'
                                            }`}
                                    >
                                        {sup.supplierType} (Weight: {sup.supplierType === 'IMPORTER' ? '100%' : sup.supplierType === 'DISTRIBUTOR' ? '70%' : '40%'})
                                    </span>
                                </td>
                                <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                                    ★ 4.8 / 5.0 (99.2% Fulfillment)
                                </td>
                                <td className="py-3.5 px-4">
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sup.supplierApprovalStatus === 'APPROVED'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-amber-100 text-amber-800'
                                            }`}
                                    >
                                        {sup.supplierApprovalStatus}
                                    </span>
                                </td>
                                <td className="py-3.5 px-4 text-right space-x-2">
                                    {sup.supplierApprovalStatus === 'APPROVED' ? (
                                        <button
                                            onClick={() => handleUpdateSupplierStatus(sup.id, 'SUSPENDED')}
                                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-[11px] font-semibold cursor-pointer"
                                        >
                                            Suspend
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleUpdateSupplierStatus(sup.id, 'APPROVED')}
                                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-semibold cursor-pointer"
                                        >
                                            Approve KYC
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
        </div>
    )
}

export default SupplierListing
