            Executive Summary


The Haulage Truck Management System is a production-ready backend API designed to streamline trucking fleet operations. It serves as a central hub for managing vehicles, personnel, and logistics, specifically engineered to eliminate common operational failures through rigorous automated validation.


                 The Core Solution

This system digitizes the dispatch process, replacing manual oversight with a logic-driven engine that ensures every assignment is safe, legal, and efficient.

Operational Visibility: Provides real-time data on fleet availability, active transit status, and driver workloads.

Automated Compliance: Prevents assignments if drivers have expired licenses or if trucks are uninsured.

Resource Optimization: Ensures cargo loads never exceed the physical capacity of the assigned vehicle.


            Technical Infrastructure & Features

1. Fleet & Personnel Governance
Truck Management: Comprehensive tracking of registrations, VINs, and maintenance statuses (Available, In-Transit, Maintenance, Out-of-Service).

Driver Management: Detailed profiles including license classes, medical clearances, and emergency contact information.

Role-Based Access (RBAC): Tiered permissions for Admins (Full control), Operators (Dispatching/Reporting), and Drivers (View-only access).
 
2. Intelligent Dispatching EngineThe system's core differentiator is its validation layer. Before a job is finalized, the API performs over ten business rule checks:Capacity Checks: Validates that cargo weight $\leq$ truck capacity.Status Checks: Confirms both driver and truck are currently AVAILABLE.Legality Checks: Verifies that all insurance and licensing documentation is current.

3. Analytics & Reporting
A centralized dashboard provides high-level metrics via the /reports/summary endpoint, offering insights into:

Total moving tonnage (kg).

Active jobs vs. standby capacity.

Overall fleet health percentages.



             Deployment & Tech Stack


The system is built on a modern, scalable stack designed for reliability and ease of deployment.

Runtime & Framework: Node.js + Express.js

Data Layer: PostgreSQL 15 for robust relational data management.

Security: JWT-based authentication with Bcrypt password hashing.

DevOps: Fully containerized using Docker and Docker Compose for "one-command" setup.

Quality Assurance: 100% test coverage using Jest and Supertest to ensure stability under production loads.

               
               
               Architecture Overview



The project follows a clean, modular structure to facilitate scaling and maintenance:

Controllers: Isolate business logic.

Middleware: Handle security and role gating.

Database Schema: Optimized for relational integrity and quick reporting.





       Endpoint: User Registration


This endpoint registers a new user into the system and assigns them a specific role. All passwords are encrypted before being stored in the database.

URL: /api/auth/register

Method: POST

Authentication: None (Public)



Example Request:

JSON
{
  "username": "new_dispatcher_2026",
  "password": "securePassword123",
  "full_name": "John Doe",
  "role": "ADMIN"
}


✅ Success: 201 Created
When the account is created successfully, the API returns the user object (excluding the password).

JSON
{
    "message": "Account created successfully",
    "user": {
        "id": 9,
        "username": "new_dispatcher_2026",
        "role": "ADMIN"
    }
}



❌ Error: 400 Bad Request
Sent if the username already exists or if the role provided is invalid.

JSON
{
    "error": "Username is already taken"
}




Endpoint: User Login


This endpoint authenticates the user and returns a Bearer Token required for all protected fleet management operations.

URL: /api/auth/login

Method: POST

Authentication: None

Request Body (JSON)
Use the credentials from the account we just registered:

JSON
{
  "username": "new_dispatcher_2026",
  "password": "securePassword123"
}



To complete the flow, we’ll now use the credentials from the account you just created to obtain a JWT (JSON Web Token). This token is your "digital pass" to access the rest of the system.

Endpoint: User Login
This endpoint authenticates the user and returns a Bearer Token required for all protected fleet management operations.

URL: /api/auth/login

Method: POST

Authentication: None

Request Body (JSON)
Use the credentials from the account we just registered:

JSON
{
  "username": "new_dispatcher_2026",
  "password": "securePassword123"
}


     Success Response (200 OK)

When login is successful, the server will return a token. You must save this token to use in the headers of your next requests.

JSON
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwidXNlcm5hbWUiOiJuZXdfZGlzcGF0Y2hlcl8yMDI2Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzc2NzIwNzA4LCJleHAiOjE3NzY3Mjc5MDh9.slciG1c5aU0Xz3_033FdlHjA6VPNpleKGgVGW9QLcbc"
}





    Endpoint: Create Truck

URL: /api/trucks

Method: POST

Auth: ✅ Admin Required

Success Response (201 Created)
When a truck is successfully added, the API returns the full object as stored in the database, including the generated id and the default status.

Example Response Body:

JSON
{
    "id": 7,
    "registration_number": "HGE-2026-ZW",
    "vin_number": "1HGBH41JXMN000123",
    "make": "Mercedes-Benz",
    "model": "Actros 2645",
    "year_of_manufacture": 2024,
    "capacity_kg": 28000,
    "fuel_type": "Diesel",
    "last_service_date": null,
    "insurance_expiry": "2027-05-15T00:00:00.000Z",
    "status": "AVAILABLE"
}






     Fleet Operations: Managing Existing Trucks


These endpoints allow for the maintenance and retrieval of vehicle data. All require a Bearer Token with ADMIN privileges.

1. Get Truck by ID
Method: GET

Endpoint: /api/trucks/:id

Description: Retrieves full details for a single vehicle. Useful for the "Truck Profile" view in your frontend.

Success Response (200 OK): Returns the truck object (e.g., the Mercedes-Benz with ID 7).

2. Update (Edit) Truck
Method: PATCH

Endpoint: /api/trucks/:id

Description: Modifies vehicle details. Typically used for updating the status (e.g., moving a truck to MAINTENANCE) or extending the insurance_expiry.

Payload Example:

JSON
{
  "status": "MAINTENANCE",
  "insurance_expiry": "2028-05-15"
}
3. Delete Truck
Method: DELETE

Endpoint: /api/trucks/:id

Description: Permanently removes a truck from the fleet.

Safety Note: In a real-world scenario, you might want to prevent deletion if the truck is currently assigned to an active job.





👨‍✈️ Driver Onboarding API
This endpoint handles the complete registration of a new driver. It simultaneously creates their login credentials and their professional profile within the haulage system.

1. What are we sending?
URL: /api/drivers

Method: POST

Auth: ✅ ADMIN Token required in headers.


Request Body (JSON)
The payload combines Account Data and Regulatory Data:


{
  "username": "blessing_driver26",
  "password": "driverPassword123",
  "full_name": "Makomborero Chidziva",
  "license_number": "ZW-LIC-99283",
  "license_class": "Class 2",
  "license_expiry": "2027-12-31",
  "medical_clearance_expiry": "2026-12-31",
  "phone_number": "+263781146463",
  "emergency_contact": "+263718305005"
}



The Response

✅ Success Response (201 Created)
The API returns a summary of the newly created account. It never returns the password back to you.

JSON
{
    "id": 10,
    "username": "blessing_driver26",
    "full_name": "Makomborero Chidziva",
    "role": "DRIVER"
}

2. What is the API doing?
When you hit Send, the backend performs three hidden steps:

Security: It hashes the password using Bcrypt so it's never stored in plain text.

Role Assignment: It automatically tags the new user with the DRIVER role.

Profile Linking: It creates an entry in the Drivers table and links it to the new user ID.


❌ Error Response (400 Bad Request)

If the registration fails, it is usually for one of two reasons:

Duplicate Identity: {"error": "Username or License Number already exists"}

Invalid Dates: {"error": "License expiry date cannot be in the past"}

4. Driver Lifecycle Management
Once the driver is created, you can use these standard CRUD routes:

GET /api/drivers/:id: View the full compliance profile (License, Medical, and Phone).

PATCH /api/drivers/:id: Update their status (e.g., from AVAILABLE to OFF_DUTY).

DELETE /api/drivers/:id: Remove the driver and their associated user account.


Delivery Job Lifecycle Operations
The Jobs module coordinates your entire fleet. Below is the technical summary of how the API handles each state of a delivery.

1. Create & Assign (The Smart Dispatch)
What it does: Links truck_id and driver_id to a job_number. This is the "Brain" of your app that checks if the truck can handle the weight and if the driver is legally compliant.

Request Body (JSON):

JSON
{
  "job_number": "JOB-2026-057",
  "truck_id": 8,
  "driver_id": 11,
  "pickup_location": "Harare Depot",
  "delivery_location": "Bulawayo Industrial Park",
  "description": "Transporting high-value solar components and batteries",
  "cargo_weight_kg": 15000,
  "estimated_arrival": "2026-04-22T14:00:00Z"
}
2. View & Track
What it does: Allows Dispatchers (Admins/Operators) to see the live status of any job.

GET /api/jobs: Returns a list of all active and past deliveries.

GET /api/jobs/:id: Returns the full manifest for a specific trip.

3. Update Status (Real-time Progression)
What it does: As the driver moves, the status is updated. This is critical because it controls the availability of your assets.

PATCH /api/jobs/:id with payload {"status": "IN_TRANSIT"}.

PATCH /api/jobs/:id with payload {"status": "COMPLETED"}.

Note: When status hits COMPLETED, your logic should automatically release Truck 7 and Driver 10 back to AVAILABLE status.

4. Delete (Cancellation)
What it does: Permanently removes a job from the schedule.

DELETE /api/jobs/:id

Logic Tip: Ensure your code checks if a job is already IN_TRANSIT before allowing a delete, to prevent data inconsistency.



📈 Operational Analytics & Job Completion
These endpoints provide the final layer of business intelligence and asset management for the fleet.

1. Fleet Operations Summary
URL: /api/reports/summary

Method: GET

Auth: ✅ Admin Required

What is this API doing?
It aggregates data from the Trucks, Drivers, and Jobs tables to provide a real-time health snapshot of the business.

Response Body (JSON):

JSON
{
    "report_date": "20/04/2026",
    "fleet_stats": {
        "total_vehicles": 4,
        "on_the_road": 0,
        "maintenance_or_idle": 2
    },
    "capacity_utilization": {
        "moving_tonnage_kg": 0,
        "drivers_on_standby": 4
    },
    "operational_health": "50.0%"
}
2. Complete Delivery Job
URL: /api/jobs/:id/complete

Method: POST

Auth: ✅ Admin or Operator

What is this API doing?
This is a critical "multi-action" endpoint. When called, it performs three tasks simultaneously:

Job Update: Marks the job status as COMPLETED.

Truck Release: Automatically resets the assigned truck status to AVAILABLE.

Driver Release: Automatically resets the assigned driver status to AVAILABLE.

Request Body (JSON):

JSON
{
    "actual_arrival_time": "2026-04-21T10:30:00Z",
    "delivery_notes": "Successful delivery at Bulawayo Depot."
}
Response Body (JSON):

JSON
{
    "message": "Job completed successfully. Assets have been released to the available pool."
}