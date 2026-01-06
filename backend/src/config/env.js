require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development'
};