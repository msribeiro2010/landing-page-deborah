import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://cxzrazemoxvcsebamoss.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4enJhemVtb3h2Y3NlYmFtb3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjU0MjIsImV4cCI6MjA2NzY0MTQyMn0.HpBt9hxZDPiX_0x0JMQYKqBsdpaxGq4H5S2MLmq08O0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;