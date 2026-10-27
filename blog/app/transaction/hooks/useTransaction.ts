"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import {
  processTransactionAction,
  TransactionPayload,
  TransactionResponse,
} from "../actions";
import { TransactionFormData } from "../schema";


interface UseTransactionOptions {
  type: "DEBIT" | "CREDIT";
  userId?: string;
  onSuccess?: (data: TransactionResponse) => void;
}

export function useTransaction({
  type,
  userId = "USR-001",
  onSuccess,
}: UseTransactionOptions) {
  // Idempotency key di-cache per sesi pengiriman transaksi
  const idempotencyKeyRef = useRef<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Generate / dapatkan idempotency key yang stabil untuk transaksi saat ini
  const getOrCreateKey = () => {
    if (!idempotencyKeyRef.current) {
      const newKey = uuidv4();
      idempotencyKeyRef.current = newKey;
      setActiveKey(newKey);
      return newKey;
    }
    return idempotencyKeyRef.current;
  };

  // Reset idempotency key ketika transaksi baru ingin dibuat
  const resetKey = () => {
    idempotencyKeyRef.current = null;
    setActiveKey(null);
  };

  const mutation = useMutation<TransactionResponse, Error, TransactionFormData>({
    mutationFn: async (formData: TransactionFormData) => {
      const currentKey = getOrCreateKey();

      const payload: TransactionPayload = {
        user_id: userId,
        type,
        amount: formData.amount,
        description: formData.description,
      };

      // Diproses di server via Server Action dengan Idempotency-Key
      return await processTransactionAction(payload, currentKey);
    },
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
  });

  return {
    ...mutation,
    activeIdempotencyKey: activeKey,
    submitTransaction: mutation.mutate,
    submitTransactionAsync: mutation.mutateAsync,
    resetTransactionSession: () => {
      mutation.reset();
      resetKey();
    },
  };
}
