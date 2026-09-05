import PharmacistVerificationTable, { INITIAL_VERIFICATION_HISTORY } from '../components/PharmacistVerificationTable/PharmacistVerificationTable'

const PharmacistHistoryPage = () => {
    return (
        // <div className="min-h-screen text-slate-900 p-4 pb-24 font-sans">
        <div className="font-sans">
            {/* =========================================================
                  SECTION: PHARMACIST VERIFICATION HISTORY TABLE
              ========================================================= */}
            <PharmacistVerificationTable data={INITIAL_VERIFICATION_HISTORY} />
        </div>
    )
}

export default PharmacistHistoryPage
