import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserSettings } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadSettings = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading settings:', error);
    } else if (data) {
      setSettings(data);
    } else {
      const { data: newSettings, error: insertError } = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          monthly_limit: 600,
          hourly_wage: 13,
          late_shift_percentage: 20,
          night_shift_percentage: 55,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating settings:', insertError);
      } else {
        setSettings(newSettings);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, [user]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user || !settings) return;

    const { data, error } = await supabase
      .from('user_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating settings:', error);
      return { error };
    } else {
      setSettings(data);
      return { data };
    }
  };

  return { settings, loading, updateSettings, reloadSettings: loadSettings };
};
