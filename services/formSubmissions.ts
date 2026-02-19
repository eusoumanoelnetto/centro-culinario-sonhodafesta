import { supabase, CLIENT_ID } from './supabase'

export type FormSubmissionType =
  | 'contact'
  | 'newsletter'
  | 'ai_lead'
  | 'teacher_application'
  | 'checkout'
  | 'certificate_request'
  | 'password_reset_request'
  | 'data_change_request'
  | 'user_login'
  | 'admin_login'
  | 'search'
  | 'admin_record'

export interface FormSubmissionPayload {
  [key: string]: any
}

export async function recordFormSubmission(
  formType: FormSubmissionType,
  payload: FormSubmissionPayload
) {
  const { email, detalhes, tipo } = payload
  const { error } = await supabase.from('admin_solicitacoes').insert([
    {
      email: email || payload.studentEmail || '',
      detalhes: detalhes || payload.message || payload.note || '',
      tipo: formType,
      status: 'pendente',
    },
  ])

  if (error) {
    throw error
  }
}
