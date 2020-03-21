# Overview

# Database Table Creation
`CREATE TABLE temperature_readings (
    id SERIAL PRIMARY KEY,
    telephone_number TEXT NOT NULL,
    temperature DECIMAL NOT NULL,
    sent_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);`