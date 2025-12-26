/*
  # Optimize RLS Policies for Performance

  This migration optimizes Row Level Security policies by wrapping auth.uid() 
  calls in subqueries. This prevents the function from being re-evaluated for 
  each row, significantly improving query performance at scale.

  ## Changes
  - Replace auth.uid() with (select auth.uid()) in all RLS policies
  - This ensures the function is evaluated once per query instead of per row
  - No functional changes, only performance improvements
*/

DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = (SELECT auth.uid()))
  WITH CHECK (auth.uid() = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own settings" ON user_settings;
CREATE POLICY "Users can delete own settings"
  ON user_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own work entries" ON work_entries;
CREATE POLICY "Users can view own work entries"
  ON work_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own work entries" ON work_entries;
CREATE POLICY "Users can insert own work entries"
  ON work_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own work entries" ON work_entries;
CREATE POLICY "Users can update own work entries"
  ON work_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = (SELECT auth.uid()))
  WITH CHECK (auth.uid() = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own work entries" ON work_entries;
CREATE POLICY "Users can delete own work entries"
  ON work_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = (SELECT auth.uid()));