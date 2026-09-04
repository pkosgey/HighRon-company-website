import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_ErQUBN9xQQ4nK-LrDsblmQ_Yvmtn1EZ";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseUrl.startsWith("http") && 
  supabaseAnonKey
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
