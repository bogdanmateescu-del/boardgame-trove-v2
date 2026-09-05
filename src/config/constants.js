// Configuration and Constants
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

export const SB_URL = env.VITE_SUPABASE_URL || "https://bjzdbbnndpwkbvimsptd.supabase.co"; 
export const SB_KEY = env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqemRiYm5uZHB3a2J2aW1zcHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NTg0MzAsImV4cCI6MjA4ODAzNDQzMH0.0dA3DRQonbsUvrm2bzzdA2vjOr7q7FT_JOMdV0TUF2g";
export const HC_TOKEN = env.VITE_HARDCOVER_TOKEN || "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsInZlcnNpb24iOiI4IiwianRpIjoiNjcyYjFlMzUtZTQ3Yy00N2E4LThjOTktZTA4ODVjN2M5ZGI0IiwiYXBwbGljYXRpb25JZCI6Miwic3ViIjoiMTQ2MzgwIiwiYXVkIjoiMSIsImlkIjoiMTQ2MzgwIiwibG9nZ2VkSW4iOnRydWUsImlhdCI6MTc4NjU1OTM3NiwiZXhwIjoxODE4MDk1Mzc2LCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwiXy1oYXN1cmEtcm9sZSI6InVzZXIiLCJYLWhhc3VyYS11c2VyLWlkIjoiMTQ2MzgwIn0sInVzZXIiOnsiaWQiOjE0NjM4MH19.Sxm4xgxWD9F5pk2tEHllK8xFfPXSthiKY8szgR6rtbw";

export const ITEMS_PER_PAGE = 60;

export const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22400%22%20viewBox%3D%220%200%20300%20400%22%3E%3Crect%20width%3D%22300%22%20height%3D%22400%22%20fill%3D%22%23f1f5f9%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22bold%22%20fill%3D%22%2394a3b8%22%3ENO%20COVER%3C%2Ftext%3E%3C%2Fsvg%3E";
