-- Migration: Create Tables and Relationships

-- Create the 'admin' table
CREATE TABLE admin (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create the 'user' table
CREATE TABLE "fixuser" (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    roll_number VARCHAR(255),
    major VARCHAR(255),
    batch INT,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (id) REFERENCES admin (id) ON DELETE CASCADE
);


CREATE TABLE term (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN,
    is_monsoon BOOLEAN
);

-- Create the 'hack' table
CREATE TABLE hack (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    term INT,
    winner UUID,
    is_active BOOLEAN,
    FOREIGN KEY (term) REFERENCES term (id) ON DELETE SET NULL,
    FOREIGN KEY (winner) REFERENCES "fixuser" (id) ON DELETE SET NULL
);

-- Create the 'submission' table
CREATE TABLE submission (
    id UUID PRIMARY KEY,
    submission_title VARCHAR(255),
    submission_description TEXT,
    submission_link VARCHAR(255),
    submission_additional_links JSON,
    points_scored INT,
    is_winner BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW(),
    hack UUID,
    term INT,
    fixuser UUID,
    FOREIGN KEY (hack) REFERENCES hack (id) ON DELETE SET NULL,
    FOREIGN KEY (term) REFERENCES term (id) ON DELETE SET NULL,
    FOREIGN KEY (fixuser) REFERENCES "fixuser" (id) ON DELETE SET NULL
);

-- Create the 'term' table
