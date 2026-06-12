// 1. Matches the exact snake_case structure stored inside our PostgreSQL map_pins table
export interface DBMapPinRow {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  creator_id: string;
  created_at: Date;
}

// 2. Represents the clean application layer data model (camelCase) passed around our system
export interface MapPin {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  creatorId: string;
  createdAt: Date;
}

// 3. Data Transfer Object (DTO) capturing incoming data when an intern creates a new spot
export interface CreatePinInputDTO {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  creatorId: string; // Captured from the authenticated session
}

// 4. Interface for processing geographical viewport boundary limits
export interface ViewportBoundsDTO {
  north: number;
  south: number;
  east: number;
  west: number;
}