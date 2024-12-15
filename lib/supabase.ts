import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lowvszrqztthmomjqvqc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvd3ZzenJxenR0aG1vbWpxdnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NDgzMjEsImV4cCI6MjA0OTIyNDMyMX0.XNiWif3wla9kR43EyFfSBjZgbhT-gUuamAr1aqXZnIQ";
const supabasePassword = "qrtyuiopsdfghjklzxcvbnm"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
