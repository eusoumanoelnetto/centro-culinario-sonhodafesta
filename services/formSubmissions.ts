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
  const { error } = await supabase.from('form_submissions').insert([
    {
      client_id: CLIENT_ID,
      form_type: formType,
      payload,
    },
  ])

  if (error) {
    throw error
  }
}
