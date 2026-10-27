"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionFormSchema, TransactionFormData } from "../schema";
import { useTransaction } from "../hooks/useTransaction";

interface TransactionFormProps {
  type: string;
}

export default function TransactionForm({ type }: TransactionFormProps) {
  const normalizedType = type?.toUpperCase() === "CREDIT" ? "CREDIT" : "DEBIT";
  const isCredit = normalizedType === "CREDIT";

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  const {
    submitTransaction,
    isPending,
    isSuccess,
    isError,
    error,
    data,
    activeIdempotencyKey,
    resetTransactionSession,
  } = useTransaction({
    type: normalizedType,
    userId: "USR-001",
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (formData: TransactionFormData) => {
    submitTransaction(formData);
  };

  const handleCreateNewTransaction = () => {
    resetTransactionSession();
    reset({
      amount: 0,
      description: "",
    });
  };

  return (
    <div
      style={{
        maxWidth: "520px",
        margin: "24px auto",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        backgroundColor: "#ffffff",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#1e293b",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "12px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
            Form Transaksi
          </h2>
          <span
            style={{
              display: "inline-block",
              marginTop: "4px",
              padding: "3px 10px",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              backgroundColor: isCredit ? "#dcfce7" : "#fee2e2",
              color: isCredit ? "#15803d" : "#b91c1c",
            }}
          >
            Tipe: {normalizedType}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>User ID</span>
          <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>USR-001</div>
        </div>
      </div>

      {activeIdempotencyKey && (
        <div
          style={{
            marginBottom: "16px",
            padding: "10px 12px",
            backgroundColor: "#f8fafc",
            borderRadius: "6px",
            border: "1px dashed #cbd5e1",
            fontSize: "0.75rem",
            color: "#475569",
            wordBreak: "break-all",
          }}
        >
          <strong>Idempotency-Key (Active Session):</strong>
          <div>{activeIdempotencyKey}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Input Amount */}
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="amount"
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            Nominal (Amount)
          </label>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <input
                id="amount"
                type="number"
                disabled={isPending}
                placeholder="Contoh: 250000"
                value={field.value === 0 ? "" : field.value}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? 0 : Number(val));
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: errors.amount
                    ? "1.5px solid #ef4444"
                    : "1px solid #cbd5e1",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            )}
          />
          {errors.amount && (
            <span
              style={{
                color: "#ef4444",
                fontSize: "0.775rem",
                marginTop: "4px",
                display: "block",
              }}
            >
              {errors.amount.message}
            </span>
          )}
        </div>

        {/* Input Description */}
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="description"
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            Keterangan (Description)
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="description"
                type="text"
                disabled={isPending}
                placeholder="Contoh: Tarik Tunai ATM"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: errors.description
                    ? "1.5px solid #ef4444"
                    : "1px solid #cbd5e1",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            )}
          />
          {errors.description && (
            <span
              style={{
                color: "#ef4444",
                fontSize: "0.775rem",
                marginTop: "4px",
                display: "block",
              }}
            >
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: isPending
              ? "#94a3b8"
              : isCredit
                ? "#16a34a"
                : "#dc2626",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.95rem",
            border: "none",
            borderRadius: "8px",
            cursor: isPending ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
          }}
        >
          {isPending
            ? "Memproses Transaksi..."
            : `Kirim Transaksi ${normalizedType}`}
        </button>
      </form>

      {/* Response Display Area */}
      {isSuccess && data && (
        <div
          style={{
            marginTop: "20px",
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: "#f0fdf4",
            border: "1px solid #86efac",
            color: "#166534",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "4px" }}>
            ✓ {data.message || "Transaksi Berhasil!"}
          </div>
          {data.data && (
            <div
              style={{ fontSize: "0.8rem", marginTop: "8px", color: "#14532d" }}
            >
              <div>
                <strong>ID:</strong> {data.data.id}
              </div>
              <div>
                <strong>Tipe:</strong> {data.data.type}
              </div>
              <div>
                <strong>Nominal:</strong> Rp{" "}
                {Number(data.data.amount).toLocaleString("id-ID")}
              </div>
              <div>
                <strong>Deskripsi:</strong> {data.data.description}
              </div>
              <div>
                <strong>Waktu:</strong>{" "}
                {new Date(data.data.created_at).toLocaleString("id-ID")}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleCreateNewTransaction}
            style={{
              marginTop: "12px",
              padding: "6px 12px",
              fontSize: "0.8rem",
              backgroundColor: "#166534",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Buat Transaksi Baru (+ New Key)
          </button>
        </div>
      )}

      {isError && (
        <div
          style={{
            marginTop: "20px",
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            color: "#991b1b",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "4px" }}>
            ✕ Transaksi Gagal
          </div>
          <div style={{ fontSize: "0.85rem" }}>
            {error?.message || "Terjadi kesalahan pada server"}
          </div>
          <div
            style={{ fontSize: "0.75rem", marginTop: "6px", color: "#7f1d1d" }}
          >
            Catatan: Jika Anda mencoba lagi (retry), sistem akan tetap
            menggunakan Idempotency-Key yang sama untuk menghindari duplikasi
            transaksi.
          </div>
        </div>
      )}
    </div>
  );
}
