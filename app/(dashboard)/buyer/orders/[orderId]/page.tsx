// app/(dashboard)/buyer/orders/[orderId]/page.tsx

import { connectToDB } from "@/lib/connectToDB"

type Props = {
  params: {
    slug: string
  }
}

export default async function Page({ params }: Props) {
  const { slug } = params

   await connectToDB()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Order ID: {slug}
      </h1>
    </div>
  )
}
