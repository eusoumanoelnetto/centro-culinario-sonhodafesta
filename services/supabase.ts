import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://omnuydikeejhiahkufwa.supabase.co'
const supabaseKey = 'sb_publishable_iAYfPVW85cV66HVY9V_jwQ_w0TtRycg'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const CLIENT_ID = '15d783c5-ad6c-4ee8-927b-eed0b828ad85'
