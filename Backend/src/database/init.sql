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

-- 1. Create the travel_pods table
CREATE TABLE IF NOT EXISTS travel_pods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    destination_id UUID NOT NULL,
    host_id UUID NOT NULL,
    max_capacity INT NOT NULL CHECK (max_capacity >= 2), -- A pod must support at least 2 people
    current_size INT NOT NULL DEFAULT 1,                 -- Starts at 1 (the host)
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',          -- 'OPEN', 'FULL', 'COMPLETED'
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pod_destination FOREIGN KEY (destination_id) REFERENCES map_pins(id) ON DELETE CASCADE,
    CONSTRAINT fk_pod_host FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index the travel pod status and destination for rapid board listing filters
CREATE INDEX IF NOT EXISTS idx_travel_pods_status ON travel_pods(status);


-- 2. Create the pod_members join table
CREATE TABLE IF NOT EXISTS pod_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pod_id UUID NOT NULL,
    user_id UUID NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_member_pod FOREIGN KEY (pod_id) REFERENCES travel_pods(id) ON DELETE CASCADE,
    CONSTRAINT fk_member_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Critical Constraint: Prevents a single user from joining the same carpool twice
    CONSTRAINT unique_pod_user_combination UNIQUE (pod_id, user_id)
);

-- 1. Create the expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pod_id UUID NOT NULL,
    payer_id UUID NOT NULL,
    amount DOUBLE PRECISION NOT NULL CHECK (amount > 0),
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_expense_pod FOREIGN KEY (pod_id) REFERENCES travel_pods(id) ON DELETE CASCADE,
    CONSTRAINT fk_expense_payer FOREIGN KEY (payer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_expenses_pod_id ON expenses(pod_id);


-- 2. Create the expense_splits table to log individual debts
CREATE TABLE IF NOT EXISTS expense_splits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL,
    debtor_id UUID NOT NULL,
    amount_owed DOUBLE PRECISION NOT NULL CHECK (amount_owed >= 0),
    is_settled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_split_expense FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
    CONSTRAINT fk_split_debtor FOREIGN KEY (debtor_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Prevents duplicate split entries for the same user under a single expense record
    CONSTRAINT unique_expense_debtor UNIQUE (expense_id, debtor_id)
);

CREATE INDEX IF NOT EXISTS idx_splits_debtor_id ON expense_splits(debtor_id);