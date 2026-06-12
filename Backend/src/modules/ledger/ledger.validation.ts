import { z } from 'zod';

// 1. Validator for logging an expense bill
export const CreateExpenseSchema = z.object({
  body: z.object({
    podId: z
      .string({ error: "Pod ID reference is required" })
      .uuid({ message: "Invalid Pod ID format" }),
    
    payerId: z
      .string({ error: "Payer User ID reference is required" })
      .uuid({ message: "Invalid Payer User ID format" }),
    
    // Amount must be greater than zero rupees
    amount: z
      .number({ error: "Total bill amount is required" })
      .positive({ message: "Expense amount must be a positive number greater than zero" }),
    
    description: z
      .string({ error: "Expense description is required" })
      .min(3, { message: "Description must be at least 3 characters long" })
      .max(255, { message: "Description cannot exceed 255 characters" })
  })
});

// 2. Validator for pulling up a pod's overall ledger summary
export const GetPodLedgerSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "Invalid Pod ID format parameters" })
  })
});