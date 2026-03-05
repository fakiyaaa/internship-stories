import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://wfgyyilsrnthzpmhhxjd.supabase.co"
const supabaseKey = "sb_publishable_UurIc99H8GOdVYJdCTS_sA_rU3F43q4"

export const supabase = createClient(supabaseUrl, supabaseKey)