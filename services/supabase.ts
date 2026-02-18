import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://omnuydikeejhiahkufwa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbnV5ZGlrZWVqaGlhaGt1ZndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTE5NzgsImV4cCI6MjA4NjU4Nzk3OH0.J_O9zOPAEO3CukqooNE0Em0Jr-p_7v3sPsXzeGPprUg'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const CLIENT_ID = '15d783c5-ad6c-4ee8-927b-eed0b828ad85'
