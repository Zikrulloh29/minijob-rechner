/*
  # Add Time Fields for Automatic Hour Categorization

  1. New Columns
    - `start_time` (time) - Work start time
    - `end_time` (time) - Work end time
  
  2. Changes
    - Added optional start_time and end_time columns to work_entries
    - These allow automatic detection of late (18:30+) and night (20:00+) hours
    - Existing entries remain compatible with manual hour entry
  
  3. Notes
    - Late shift: 18:30 to 20:00 (1.5 hours if spanning this range)
    - Night shift: 20:00 to next day
    - Automatic calculation based on time overlap
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'work_entries' AND column_name = 'start_time'
  ) THEN
    ALTER TABLE work_entries ADD COLUMN start_time time;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'work_entries' AND column_name = 'end_time'
  ) THEN
    ALTER TABLE work_entries ADD COLUMN end_time time;
  END IF;
END $$;