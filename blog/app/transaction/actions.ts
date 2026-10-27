"use server";

export interface TransactionPayload {
  user_id: string;
  type: "DEBIT" | "CREDIT";
  amount: number;
  description: string;
}

export interface TransactionResponse {
  message?: string;
  error?: string;
  data?: {
    id: number;
    user_id: string;
    type: string;
    amount: string | number;
    description: string;
    created_at: string;
  };
}

const API_BASE_URL =
  process.env.INTERNAL_TRANSACTION_API_URL ||
  "http://localhost:3610/api/v1/transactions";

export async function processTransactionAction(
  payload: TransactionPayload,
  idempotencyKey: string,
): Promise<TransactionResponse> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Gagal memproses transaksi");
  }

  return data;
}
