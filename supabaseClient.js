import { createClient } from '@supabase/supabase-js';

// Reemplaza con tus datos reales
const supabaseUrl = 'https://fmgxthdlvjkufolfqlwj.supabase.co/rest/v1/'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtZ3h0aGRsdmprdWZvbGZxbHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTk4MDQsImV4cCI6MjA5MzQ5NTgwNH0.-2uamfGb8AFTyvXxRquVFVLXtnf-H53-R3vCYc8iq94';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);