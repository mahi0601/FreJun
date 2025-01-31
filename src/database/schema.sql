-- -- Create the passengers table
-- CREATE TABLE IF NOT EXISTS passengers (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT NOT NULL,
--     age INTEGER NOT NULL,
--     gender TEXT CHECK( gender IN ('Male', 'Female', 'Other') ) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create the tickets table
-- CREATE TABLE IF NOT EXISTS tickets (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     passenger_id INTEGER NOT NULL,
--     status TEXT CHECK( status IN ('CONFIRMED', 'RAC', 'WAITING') ) NOT NULL,
--     berth_type TEXT CHECK( berth_type IN ('LOWER', 'MIDDLE', 'UPPER', 'SIDE-LOWER', 'SIDE-UPPER') ) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE CASCADE
-- );

-- -- Create the berth allocations table
-- CREATE TABLE IF NOT EXISTS berth_allocations (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     type TEXT CHECK( type IN ('CONFIRMED', 'RAC', 'WAITING') ) NOT NULL,
--     total_seats INTEGER NOT NULL,
--     available_seats INTEGER NOT NULL
-- );

-- -- Create the waiting list table
-- CREATE TABLE IF NOT EXISTS waiting_list (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     passenger_id INTEGER NOT NULL,
--     position INTEGER NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE CASCADE
-- );
CREATE TABLE passengers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    hasChild BOOLEAN DEFAULT FALSE,
    ticket_id INT REFERENCES tickets(id) ON DELETE SET NULL
);

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    passenger_id INT NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
    status ENUM('CONFIRMED', 'RAC', 'WAITING') NOT NULL,
    berth_type ENUM('LOWER', 'MIDDLE', 'UPPER', 'SIDE-LOWER') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE berth_allocations (
    id SERIAL PRIMARY KEY,
    type ENUM('CONFIRMED', 'RAC', 'WAITING') NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL
);
