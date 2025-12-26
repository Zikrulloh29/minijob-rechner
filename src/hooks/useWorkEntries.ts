import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { WorkEntry, NewWorkEntry } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

export const useWorkEntries = () => {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadEntries = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('work_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('work_date', { ascending: false });

    if (error) {
      console.error('Error loading entries:', error);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, [user]);

  const addEntry = async (entry: Omit<NewWorkEntry, 'user_id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('work_entries')
      .insert({ ...entry, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('Error adding entry:', error);
      return { error };
    } else {
      setEntries(prev => [data, ...prev]);
      return { data };
    }
  };

  const updateEntry = async (id: string, updates: Partial<WorkEntry>) => {
    const { data, error } = await supabase
      .from('work_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating entry:', error);
      return { error };
    } else {
      setEntries(prev => prev.map(e => e.id === id ? data : e));
      return { data };
    }
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from('work_entries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting entry:', error);
      return { error };
    } else {
      setEntries(prev => prev.filter(e => e.id !== id));
      return { success: true };
    }
  };

  return { entries, loading, addEntry, updateEntry, deleteEntry, reloadEntries: loadEntries };
};
