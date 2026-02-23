import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fqdmnvbsbxgtjemlpwsm.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxZG1udmJzYnhndGplbWxwd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NDcwMTEsImV4cCI6MjA4NzMyMzAxMX0.vd4fnVwTAEPOTD78-0I4HO1pq1imXLWRHGWahlRBAh0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
