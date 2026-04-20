-- TRUCKS: Focus on maintenance and compliance
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

-- DRIVERS: Focus on safety and contact
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_expiry DATE NOT NULL,           -- Cannot drive if expired
    phone_number VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(20),
    years_experience INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BUSY', 'OFF_DUTY'))
);

-- JOBS: Focus on tracking and costs
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



-- For Authentication Bonus
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'OPERATOR' -- e.g., ADMIN, OPERATOR
);