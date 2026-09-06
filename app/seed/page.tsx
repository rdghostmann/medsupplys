import React from 'react'
import SeedUser from './SeedUsers'

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    seed?: string
    created?: string
    updated?: string
    failed?: string
    total?: string
  }>
}) => {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Database Seeding
        </h1>

        <p className="text-sm text-muted-foreground">
          Initialize MedSupply development data.
        </p>
      </div>

      <SeedUser searchParams={searchParams} />
    </div>
  )
}

export default page
