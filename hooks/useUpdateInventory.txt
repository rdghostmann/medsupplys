// useUpdateInventory.ts

import { updateInventoryItem } from "@/services/supplier-inventory.service"
import { InventoryProduct } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type QueryContext = {
  previous?: InventoryProduct[]
}

export function useUpdateInventory(supplierId: string) {
  const queryClient = useQueryClient()

  const key = ["supplier-inventory", supplierId]

  return useMutation({
    mutationFn: updateInventoryItem,

    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: key })

      const previous =
        queryClient.getQueryData<InventoryProduct[]>(key)

      queryClient.setQueryData<InventoryProduct[]>(
        key,
        (old = []) =>
          old.map((item) =>
            item.id === updated.id
              ? {
                  ...item,
                  ...updated,
                  finalPrice:
                    updated.basePrice +
                    Math.round(updated.basePrice * 0.1),
                }
              : item
          )
      )

      return { previous }
    },

    onError: (_err, _updated, context: QueryContext | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key })
    },
  })
}