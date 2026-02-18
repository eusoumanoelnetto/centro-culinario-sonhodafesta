import { supabase, CLIENT_ID } from './supabase';

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  message?: string | null;
  source?: string | null;
}

export async function createLead(payload: LeadPayload) {
  const { error } = await supabase.from('leads').insert({
    client_id: CLIENT_ID,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    message: payload.message ?? null,
    source: payload.source ?? 'newsletter',
  });

  if (error) {
    throw error;
  }

  try {
    await supabase.functions.invoke('lead-to-sheet', {
      body: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        source: payload.source ?? 'newsletter_form',
        message: payload.message ?? null,
      },
    });
  } catch (googleError) {
    console.error('Erro ao enviar lead para Google Sheets:', googleError);
  }
}
