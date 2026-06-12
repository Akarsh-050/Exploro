import { ALLOWED_CORPORATE_DOMAINS } from '../../config/constants';
import { AuthRepository } from './auth.repository';
import { DBUserRow, RegisterInputDTO, User } from './auth.types';

export class AuthService {
  // Inject the repository dependency 
  private authRepository = new AuthRepository();

  
// Orchestrates the core registration business rules.
async registerIntern(input: RegisterInputDTO): Promise<User> {
    const { email } = input;

    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('This email address is already registered inside the network.');
    }

    const emailParts = email.toLowerCase().split('@');
    const domain = emailParts[1];

    if (!domain) {
      throw new Error('Invalid email mapping configuration.');
    }

    const isDomainAllowed = ALLOWED_CORPORATE_DOMAINS.includes(domain);
    if (!isDomainAllowed) {
      throw new Error('Access Denied: Your company domain is not currently part of this premium tech park network.');
    }

    const rawDbRow = await this.authRepository.createUser(input, domain);

    return this.mapToUserModel(rawDbRow);
  }


// Private data transformer to convert structural database schema objects 
// cleanly into application layer TypeScript standards.
  private mapToUserModel(row: DBUserRow): User {
    return {
      id: row.id,
      email: row.email,
      domain: row.domain,
      name: row.name,
      roleBadge: row.role_badge,
      interests: row.interests,
      createdAt: row.created_at
    };
  }
  
}