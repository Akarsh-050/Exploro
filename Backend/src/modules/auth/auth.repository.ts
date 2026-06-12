import pool from '../../config/db';
import { DBUserRow, RegisterInputDTO } from './auth.types';

export class AuthRepository {
    
// Searches the database to see if a user with this exact email already exists.
  async findByEmail(email: string): Promise<DBUserRow | null> {
    const queryText = 'SELECT * FROM users WHERE email = $1 LIMIT 1;';
    const result = await pool.query<DBUserRow>(queryText, [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }


// Inserts a brand new user row into the PostgreSQL users table.
  async createUser(input: RegisterInputDTO, domain: string): Promise<DBUserRow> {
    const queryText = `
      INSERT INTO users (email, domain, name, role_badge, interests)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, domain, name, role_badge, interests, created_at;
    `;
    const values = [
      input.email,
      domain,
      input.name,
      input.roleBadge,
      input.interests
    ];
    const result = await pool.query<DBUserRow>(queryText, values);
    return result.rows[0];
  }
}