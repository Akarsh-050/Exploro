import pool from '../../config/db';
import { DBTravelPodRow, CreatePodInputDTO } from './pods.types';

export class PodsRepository {
  
// create new pod and register host 
  async createPod(input: CreatePodInputDTO): Promise<DBTravelPodRow> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN'); 
      const insertPodQuery = `
        INSERT INTO travel_pods (title, description, destination_id, host_id, max_capacity, departure_time)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const podResult = await client.query<DBTravelPodRow>(insertPodQuery, [
        input.title,
        input.description,
        input.destinationId,
        input.hostId,
        input.maxCapacity,
        input.departureTime
      ]);
      const newPod = podResult.rows[0];
      // make host 
      const insertMemberQuery = `
        INSERT INTO pod_members (pod_id, user_id)
        VALUES ($1, $2);
      `;
      await client.query(insertMemberQuery, [newPod.id, input.hostId]);
      await client.query('COMMIT'); // Commit all changes safely
      return newPod;

    } catch (error) {
      await client.query('ROLLBACK'); // Undo changes if anything fails
      throw error;
    } finally {
      client.release(); // Return database client connection to the pool
    }
  }

// all active pods
  async findAllOpen(): Promise<DBTravelPodRow[]> {
    const queryText = `
      SELECT * FROM travel_pods 
      WHERE status = 'OPEN' 
      ORDER BY departure_time ASC;
    `;
    const result = await pool.query<DBTravelPodRow>(queryText);
    return result.rows;
  }

// joining a pod 
  async joinPodAtomic(podId: string, userId: string): Promise<DBTravelPodRow> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN'); // Start Transaction
      const selectPodForUpdate = `
        SELECT * FROM travel_pods 
        WHERE id = $1 
        FOR UPDATE;
      `;
      const podResult = await client.query<DBTravelPodRow>(selectPodForUpdate, [podId]);
      
      if (podResult.rows.length === 0) {
        throw new Error('Target travel pod does not exist.');
      }

      const pod = podResult.rows[0];

      if (pod.status !== 'OPEN' || pod.current_size >= pod.max_capacity) {
        throw new Error('Capacity Limit Reached: This travel pod is already full.');
      }

      const insertMemberQuery = `
        INSERT INTO pod_members (pod_id, user_id)
        VALUES ($1, $2);
      `;
      await client.query(insertMemberQuery, [podId, userId]);


      const newSize = pod.current_size + 1;
      const newStatus = newSize >= pod.max_capacity ? 'FULL' : 'OPEN';

      const updatePodQuery = `
        UPDATE travel_pods
        SET current_size = $1, status = $2
        WHERE id = $3
        RETURNING *;
      `;
      const updatedPodResult = await client.query<DBTravelPodRow>(updatePodQuery, [
        newSize,
        newStatus,
        podId
      ]);

      await client.query('COMMIT'); // Commit transaction
      return updatedPodResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback entirely on any data conflicts
      throw error;
    } finally {
      client.release();
    }
  }
}