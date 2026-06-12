import pool from '../../config/db';
import { DBMapPinRow, CreatePinInputDTO, ViewportBoundsDTO } from './maps.types';

export class MapsRepository {
  
// Saves a new physical location point in Pune into the map_pins table.
  async createPin(input: CreatePinInputDTO): Promise<DBMapPinRow> {
    const queryText = `
      INSERT INTO map_pins (title, description, latitude, longitude, category, creator_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, description, latitude, longitude, category, creator_id, created_at;
    `;
    const values = [
      input.title,
      input.description,
      input.latitude,
      input.longitude,
      input.category,
      input.creatorId
    ];
    const result = await pool.query<DBMapPinRow>(queryText, values);
    return result.rows[0];
  }

//  Fetches only the custom location pins
  async findPinsInViewport(bounds: ViewportBoundsDTO): Promise<DBMapPinRow[]> {
    const queryText = `
      SELECT * FROM map_pins
      WHERE latitude >= $1 AND latitude <= $2
        AND longitude >= $3 AND longitude <= $4
      ORDER BY created_at DESC;
    `;
    const values = [
      bounds.south,
      bounds.north,
      bounds.west,
      bounds.east
    ];
    const result = await pool.query<DBMapPinRow>(queryText, values);
    return result.rows;
  }
}