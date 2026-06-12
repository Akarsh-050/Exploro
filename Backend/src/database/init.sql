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

-- 1. Create the map_pins table
CREATE TABLE IF NOT EXISTS map_pins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g., 'Trek', 'Cafe', 'Historical', 'Nightlife'
    creator_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Enforce absolute data integrity: a pin must map to a real, existing user
    CONSTRAINT fk_pin_creator FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index coordinates to ensure fast bounding-box mapping fetches
CREATE INDEX IF NOT EXISTS idx_map_pins_coords ON map_pins(latitude, longitude);


-- 2. Create the reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pin_id UUID NOT NULL,
    user_id UUID NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Database check constraint limits values
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys with cascade deletion: if a pin is deleted, its reviews vanish automatically
    CONSTRAINT fk_review_pin FOREIGN KEY (pin_id) REFERENCES map_pins(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reviews_pin_id ON reviews(pin_id);