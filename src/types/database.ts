export interface Database {
  public: {
    Tables: {
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          monthly_limit: number;
          hourly_wage: number;
          late_shift_percentage: number;
          night_shift_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          monthly_limit?: number;
          hourly_wage?: number;
          late_shift_percentage?: number;
          night_shift_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          monthly_limit?: number;
          hourly_wage?: number;
          late_shift_percentage?: number;
          night_shift_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      work_entries: {
        Row: {
          id: string;
          user_id: string;
          work_date: string;
          start_time: string | null;
          end_time: string | null;
          normal_hours: number;
          late_hours: number;
          night_hours: number;
          additional_payment: number;
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          work_date: string;
          start_time?: string | null;
          end_time?: string | null;
          normal_hours?: number;
          late_hours?: number;
          night_hours?: number;
          additional_payment?: number;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          work_date?: string;
          start_time?: string | null;
          end_time?: string | null;
          normal_hours?: number;
          late_hours?: number;
          night_hours?: number;
          additional_payment?: number;
          notes?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type UserSettings = Database['public']['Tables']['user_settings']['Row'];
export type WorkEntry = Database['public']['Tables']['work_entries']['Row'];
export type NewWorkEntry = Database['public']['Tables']['work_entries']['Insert'];
export type UpdateWorkEntry = Database['public']['Tables']['work_entries']['Update'];
