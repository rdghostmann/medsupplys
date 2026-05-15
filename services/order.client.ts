export async function createOrder(data: any) {
  const res = await fetch("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  })

  return res.json()
}