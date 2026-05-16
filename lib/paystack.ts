// lib/paystack.ts

import axios from "axios"

const PAYSTACK_BASE_URL = "https://api.paystack.co"

export const paystack = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
})
