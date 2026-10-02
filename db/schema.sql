-- Users table for username/password authentication.
-- Run this against your Neon database (see README "Database setup").

CREATE TABLE IF NOT EXISTS users (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username      TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Case-insensitive uniqueness so "Alice" and "alice" can't both register.
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx
  ON users (lower(username));
