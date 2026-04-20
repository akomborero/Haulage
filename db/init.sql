-- 1. TRUCKS 
CREATE TABLE trucks (
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    vin_number VARCHAR(50) UNIQUE NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year_of_manufacture INT CHECK (year_of_manufacture > 1990),
    capacity_kg INT NOT NULL,
    fuel_type VARCHAR(20) DEFAULT 'Diesel',
    last_service_date DATE,
    insurance_expiry DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'IN_TRANSIT', 'MAINTENANCE', 'OUT_OF_SERVICE'))
);

-- 2. USERS 
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'OPERATOR' CHECK (role IN ('ADMIN', 'OPERATOR', 'DRIVER')),
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    emergency_contact VARCHAR(20),
    license_number VARCHAR(50) UNIQUE,
    license_class VARCHAR(20),
    license_expiry DATE,
    medical_clearance_expiry DATE,
    years_experience INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BUSY', 'OFF_DUTY')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. JOBS 
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    job_number VARCHAR(20) UNIQUE NOT NULL,
    truck_id INT REFERENCES trucks(id),
    driver_id INT REFERENCES users(id), -- 
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    cargo_type TEXT NOT NULL,
    cargo_weight_kg INT,
    estimated_arrival TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);