import { z } from "zod";

export const transactionFormSchema = z.object({
  amount: z
    .number()
    .positive("Nominal harus lebih besar dari 0"),
  description: z
    .string()
    .min(3, "Deskripsi minimal 3 karakter")
    .max(100, "Deskripsi maksimal 100 karakter"),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;
