import { createClient } from '@supabase/supabase-js';
import { SB_URL, SB_KEY } from '../config/constants.js';

export const supabase = createClient(SB_URL, SB_KEY);
