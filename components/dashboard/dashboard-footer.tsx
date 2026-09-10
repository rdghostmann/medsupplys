import Link from "next/link"

const DashboardFooter = () => {
  return (
    <>
      {/* Modern minimal footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="text-slate-450 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs font-medium text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <div>
            &copy; 2026 MediCareDistribute Health Network. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#privacy"
              className="transition-colors hover:text-slate-600"
            >
              Privacy Ordinance
            </Link>
            <span>&middot;</span>
            <Link
              href="#terms"
              className="transition-colors hover:text-slate-600"
            >
              Supplier Service Level Agreement
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}

export default DashboardFooter
