import PharmacistVerificationTable, { INITIAL_VERIFICATION_HISTORY } from '../components/PharmacistVerificationTable/PharmacistVerificationTable'

const PharmacistHistoryPage = () => {
    return (
        <div>
            {/* =========================================================
                  SECTION: PHARMACIST VERIFICATION HISTORY TABLE
              ========================================================= */}
            <section id="verification-history-section" className="space-y-4 pt-4">
                <PharmacistVerificationTable data={INITIAL_VERIFICATION_HISTORY} />
            </section>
        </div>
    )
}

export default PharmacistHistoryPage
