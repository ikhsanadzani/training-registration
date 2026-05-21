CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  training_day VARCHAR(20) NOT NULL,
  training_session VARCHAR(10) NOT NULL,
  package_category VARCHAR(50) NOT NULL,
  selected_package INTEGER NOT NULL,
  group_members TEXT,
  group_whatsapp TEXT,
  proof_file_path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
