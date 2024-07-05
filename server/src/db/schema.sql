CREATE TABLE bills (
  id SERIAL PRIMARY KEY,
  state TEXT NOT NULL,
  session TEXT NOT NULL,
  identifier TEXT NOT NULL,
  title TEXT NOT NULL,
  latest_action_date DATE,
  latest_action_description TEXT,
  abstract TEXT,
  sources JSONB
);

CREATE TABLE sponsorships (
  id SERIAL PRIMARY KEY,
  bill_id INTEGER REFERENCES bills(id),
  name TEXT NOT NULL,
  classification TEXT
);
