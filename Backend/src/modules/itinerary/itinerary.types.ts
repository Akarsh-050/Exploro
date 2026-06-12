import { MapPin } from '../maps/maps.types';

export interface GenerateItineraryInputDTO {
  category: string;       // e.g., 'Trek', 'Cafe'
  durationHours: number;  // e.g., 4, 8, 12
  startTime: string;      // e.g., "08:00 AM"
}
export interface ItineraryItem {
  timeSlot: string;
  activityTitle: string;
  details: string;
  pin?: MapPin; // Optional associated map location coordinates
}
export interface ItineraryResult {
  title: string;
  totalDurationHours: number;
  schedule: ItineraryItem[];
}