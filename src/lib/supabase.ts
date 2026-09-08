import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://sbzlypodjpqoukhzxhfo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_m3drS7J8YIwutJQ9piiGJQ_sFaPj9js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);