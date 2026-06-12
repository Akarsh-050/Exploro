import { z } from 'zod';

// 1. Validator for creating a custom location pointer
export const CreatePinSchema = z.object({
  body: z.object({
    title: z
      .string({ error: "Pin title is required" })
      .min(3, { message: "Title must be at least 3 characters long" })
      .max(100, { message: "Title cannot exceed 100 characters" }),
    
    description: z
      .string({ error: "Description is required" })
      .min(10, { message: "Please provide a slightly more descriptive review of this spot" }),
    
    // Latitude must be a float value between -90 and 90 degrees globally
    latitude: z
      .number({ error: "Latitude coordinate value is required" })
      .min(-90)
      .max(90),
    
    // Longitude must be a float value between -180 and 180 degrees globally
    longitude: z
      .number({ error: "Longitude coordinate value is required" })
      .min(-180)
      .max(180),
    
    category: z
      .string({ error: "Category is required" })
      .refine((val) => ['Trek', 'Cafe', 'Historical', 'Nightlife'].includes(val), {
        message: "Invalid category. Choose from: Trek, Cafe, Historical, Nightlife"
      }),
    
    // For our immediate MVP testing sandbox, we pass the creatorId in the body
    creatorId: z
      .string({ error: "Creator User ID reference is required" })
      .uuid({ message: "Invalid Creator ID format" })
  })
});

// 2. Validator for filtering pins within the map viewport screen boundaries (Query Strings)
export const GetPinsViewportSchema = z.object({
  query: z.object({
    north: z.string().transform(Number),
    south: z.string().transform(Number),
    east: z.string().transform(Number),
    west: z.string().transform(Number)
  })
});