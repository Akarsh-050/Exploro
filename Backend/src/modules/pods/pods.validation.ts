import { z } from 'zod';

// 1. Validator for hosting a new trip
export const CreatePodSchema = z.object({
  body: z.object({
    title: z
      .string({ error: "Trip title is required" })
      .min(5, { message: "Title must be at least 5 characters long" })
      .max(100, { message: "Title cannot exceed 100 characters" }),
    
    description: z
      .string({ error: "Description is required" })
      .min(10, { message: "Provide a brief plan detail for your group" }),
    
    destinationId: z
      .string({ error: "Destination Pin ID reference is required" })
      .uuid({ message: "Invalid Destination ID format" }),
    
    hostId: z
      .string({ error: "Host User ID reference is required" })
      .uuid({ message: "Invalid Host ID format" }),
    
    maxCapacity: z
      .number({ error: "Maximum capacity is required" })
      .min(2, { message: "A travel pod must have a minimum capacity of 2 people" })
      .max(20, { message: "MVP carpool limit capped at 20 seats max" }),
    
    // Validates that the input string is a valid ISO date, then converts it to a JS Date object
    departureTime: z
      .string({ error: "Departure date and time is required" })
      .datetime({ message: "Invalid date format. Use ISO 8601 string standards" })
      .transform((val) => new Date(val))
      .refine((date) => date > new Date(), {
        message: "Departure time must be set in the future"
      })
  })
});

// 2. Validator for checking parameters when joining an active pod
export const JoinPodSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "Invalid Pod ID parameters format" })
  }),
  body: z.object({
    userId: z
      .string({ error: "User ID is required to join" })
      .uuid({ message: "Invalid User ID format" })
  })
});