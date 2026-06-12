// 1. Matches the exact snake_case structure stored inside our PostgreSQL travel_pods table
export interface DBTravelPodRow {
  id: string;
  title: string;
  description: string;
  destination_id: string;
  host_id: string;
  max_capacity: number;
  current_size: number;
  status: string;
  departure_time: Date;
  created_at: Date;
}

// 2. Matches the exact structure stored inside our pod_members join table
export interface DBPodMemberRow {
  id: string;
  pod_id: string;
  user_id: string;
  joined_at: Date;
}

// 3. Clean application layer data model (camelCase) passed around our system
export interface TravelPod {
  id: string;
  title: string;
  description: string;
  destinationId: string;
  hostId: string;
  maxCapacity: number;
  currentSize: number;
  status: string;
  departureTime: Date;
  createdAt: Date;
}

// 4. Data Transfer Object (DTO) capturing incoming data when hosting a trip
export interface CreatePodInputDTO {
  title: string;
  description: string;
  destinationId: string;
  hostId: string;
  maxCapacity: number;
  departureTime: Date;
}