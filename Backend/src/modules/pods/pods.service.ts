import { PodsRepository } from './pods.repository';
import { DBTravelPodRow, CreatePodInputDTO, TravelPod } from './pods.types';

export class PodsService {
  private podsRepository = new PodsRepository();

  // create new pod
  async hostNewTravelPod(input: CreatePodInputDTO): Promise<TravelPod> {
    const rawPodRow = await this.podsRepository.createPod(input);
    return this.mapToPodModel(rawPodRow);
  }

  // all active pods
  async getOpenTravelPods(): Promise<TravelPod[]> {
    const rawPodRows = await this.podsRepository.findAllOpen();
    return rawPodRows.map((row) => this.mapToPodModel(row));
  }

  // joining a pod
  async joinExistingPod(podId: string, userId: string): Promise<TravelPod> {
    try {
      // Execute the atomic database transaction lock (Row locking)
      const updatedPodRow = await this.podsRepository.joinPodAtomic(podId, userId);
      return this.mapToPodModel(updatedPodRow);
    } catch (error: any) {
          if (error.code === '23505') {
        throw new Error('Data Conflict: You have already claimed a seat inside this travel pod.');
      }
      throw error;
    }
  }


  private mapToPodModel(row: DBTravelPodRow): TravelPod {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      destinationId: row.destination_id,
      hostId: row.host_id,
      maxCapacity: row.max_capacity,
      currentSize: row.current_size,
      status: row.status,
      departureTime: row.departure_time,
      createdAt: row.created_at
    };
  }
}