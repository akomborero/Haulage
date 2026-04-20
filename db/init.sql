-- TRUCKS
CREATE TABLE trucks (
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    vin_number VARCHAR(50) UNIQUE NOT NULL, -- The unique chassis ID
    make VARCHAR(50) NOT NULL,              -- e.g., Volvo, Scania
    model VARCHAR(50) NOT NULL,             -- e.g., FH16
    year_of_manufacture INT CHECK (year_of_manufacture > 1990),
    capacity_kg INT NOT NULL,               -- Payload capacity
    fuel_type VARCHAR(20) DEFAULT 'Diesel',
    last_service_date DATE,
    insurance_expiry DATE NOT NULL,         -- Real-world critical check
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'IN_TRANSIT', 'MAINTENANCE', 'OUT_OF_SERVICE'))
);


-- JOBS
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    job_number VARCHAR(20) UNIQUE NOT NULL, -- e.g., JOB-2026-001
    truck_id INT REFERENCES trucks(id),
    driver_id INT REFERENCES drivers(id),
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    cargo_type TEXT NOT NULL,
    cargo_weight_kg INT,
    estimated_arrival TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- For Authentication 
CREATE TABLE users (
    -- Authentication & Identity
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'OPERATOR' CHECK (role IN ('ADMIN', 'OPERATOR', 'DRIVER')),
    
    -- Personal & Contact Info
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    emergency_contact VARCHAR(20),
    
    -- Driver-Specific Professional Fields
    license_number VARCHAR(50) UNIQUE,
    license_class VARCHAR(20), -- e.g., 'Class 2', 'Class 4'
    license_expiry DATE,
    medical_clearance_expiry DATE,
    years_experience INT DEFAULT 0,
    
    -- Logic/Operations
    -- Added status to track who is currently available for a Job assignment
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BUSY', 'OFF_DUTY')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);