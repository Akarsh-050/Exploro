import { MapsRepository } from './maps.repository';
import { DBMapPinRow, CreatePinInputDTO, ViewportBoundsDTO, MapPin } from './maps.types';

export class MapsService {
  // Inject the repository dependency
  private mapsRepository = new MapsRepository();

  async createNewLocationPin(input: CreatePinInputDTO): Promise<MapPin> {
    
    if (input.latitude === 0 || input.longitude === 0) {
      throw new Error('Geographic coordinates cannot be set to absolute zero.');
    }
    const rawDbRow = await this.mapsRepository.createPin(input);
    
    return this.mapToPinModel(rawDbRow);
  }

  async getLocationsWithinViewport(bounds: ViewportBoundsDTO): Promise<MapPin[]> {
    if (bounds.south > bounds.north || bounds.west > bounds.east) {
      throw new Error('Invalid geographic boundary logic parameters provided.');
    }
    const rawDbRows = await this.mapsRepository.findPinsInViewport(bounds);
    return rawDbRows.map((row) => this.mapToPinModel(row));
  }

  private mapToPinModel(row: DBMapPinRow): MapPin {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      latitude: Number(row.latitude), // Forces type accuracy
      longitude: Number(row.longitude),
      category: row.category,
      creatorId: row.creator_id,     // Maps database snake_case field to client camelCase standard
      createdAt: row.created_at
    };
  }
}