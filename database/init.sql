CREATE TYPE doctors_status AS ENUM ('active', 'retired');

CREATE TABLE doctors (
    id               UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name       VARCHAR(30)              NOT NULL,
    last_name        VARCHAR(30)              NOT NULL,
    email            VARCHAR(255)             UNIQUE NOT NULL,
    city             VARCHAR(100)             NOT NULL,
    specialty        VARCHAR(100)             NOT NULL,
    years_experience INT                      NOT NULL,
    status           doctors_status           NOT NULL DEFAULT 'active',
    rating           DECIMAL(2, 1)            CHECK (rating >= 1 AND rating <= 5),
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
