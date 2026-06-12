import pool from '../../config/db';
import { DBMapPinRow } from '../maps/maps.types';

export class ItineraryRepository {
  
  async getRandomPinsByCategory(category: string, limit: number = 3): Promise<DBMapPinRow[]> {
    const queryText = `
      SELECT * FROM map_pins
      WHERE category = $1
      ORDER BY RANDOM()
      LIMIT $2;
    `;
    
    const result = await pool.query<DBMapPinRow>(queryText, [category, limit]);
    return result.rows;
  }
}