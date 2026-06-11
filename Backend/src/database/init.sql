-- 1. Enable the UUID extension so PostgreSQL can generate secure, random unique IDs automatically
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    domain VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role_badge VARCHAR(100) NOT NULL,
    interests TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create a high-performance index on the domain column
-- Reason: Our authentication logic will constantly search and filter users by their company domains
CREATE INDEX IF NOT EXISTS idx_users_domain ON users(domain);