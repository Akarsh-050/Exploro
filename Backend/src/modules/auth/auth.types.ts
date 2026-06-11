

export interface DBUserRow {
  id: string;
  email: string;
  domain: string;
  name: string;
  role_badge: string;
  interests: string[];
  created_at: Date;
}

export interface User {
  id: string;
  email: string;
  domain: string;
  name: string;
  roleBadge: string;
  interests: string[];
  createdAt: Date;
}


export interface RegisterInputDTO {
  email: string;
  name: string;
  roleBadge: string;
  interests: string[];
}