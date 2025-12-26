/*
  # Minijob Earnings Calculator Database Schema

  ## New Tables
  
  ### `user_settings`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `monthly_limit` (numeric) - Monthly earning limit in EUR (default 600)
  - `hourly_wage` (numeric) - Base hourly wage in EUR
  - `late_shift_percentage` (numeric) - Late shift surcharge percentage (default 20)
  - `night_shift_percentage` (numeric) - Night shift surcharge percentage (default 55)
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `work_entries`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `work_date` (date) - Date of work
  - `normal_hours` (numeric) - Regular working hours
  - `late_hours` (numeric) - Late shift hours
  - `night_hours` (numeric) - Night shift hours
  - `additional_payment` (numeric) - Additional payments (bonuses, etc.)
  - `notes` (text) - Optional notes
  - `created_at` (timestamptz) - Creation timestamp
  
  ## Security
  - Enable RLS on both tables
  - Users can only read/write their own data
*/

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  monthly_limit numeric(10,2) DEFAULT 600.00 NOT NULL,
  hourly_wage numeric(10,2) DEFAULT 13.00 NOT NULL,
  late_shift_percentage numeric(5,2) DEFAULT 20.00 NOT NULL,
  night_shift_percentage numeric(5,2) DEFAULT 55.00 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create work_entries table
CREATE TABLE IF NOT EXISTS work_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  work_date date NOT NULL,
  normal_hours numeric(10,2) DEFAULT 0 NOT NULL,
  late_hours numeric(10,2) DEFAULT 0 NOT NULL,
  night_hours numeric(10,2) DEFAULT 0 NOT NULL,
  additional_payment numeric(10,2) DEFAULT 0 NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_work_entries_user_date ON work_entries(user_id, work_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings"
  ON user_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for work_entries
CREATE POLICY "Users can view own work entries"
  ON work_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own work entries"
  ON work_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own work entries"
  ON work_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own work entries"
  ON work_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);