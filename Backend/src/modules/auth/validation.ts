import { z } from 'zod';

// Enforce explicit structural limits on incoming data payloads
export const RegisterSchema = z.object({
  body: z.object({
    email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
        
    name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
    
    roleBadge: z
    .string()
    .min(1, "Role badge is required")
    .min(2, "Role badge title is too short"),
    
    interests: z
      .array(z.string())
      .min(1, { message: "Please select at least one interest tag" })
  })
});