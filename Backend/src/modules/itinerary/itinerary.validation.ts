import { z } from 'zod';

export const GenerateItinerarySchema = z.object({
  body: z.object({
    category: z
      .string({ error: "Category filter parameter is required" })
      .refine((val) => ['Trek', 'Cafe', 'Historical', 'Nightlife'].includes(val), {
        message: "Invalid category. Choose from: Trek, Cafe, Historical, Nightlife"
      }),
    
    durationHours: z
      .number({ error: "Duration limit in hours is required" })
      .min(2, { message: "Minimum itinerary window is 2 hours" })
      .max(12, { message: "Maximum single-day itinerary allocation is 12 hours" }),
    
    startTime: z
      .string({ error: "Start timeline tracker time is required" })
      .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i, {
        message: "Invalid time configuration format. Use standard format 'HH:MM AM/PM' (e.g., '08:00 AM')"
      })
  })
});