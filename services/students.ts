import { supabase, CLIENT_ID } from './supabase'
import { Student } from '../types'

export type StudentSource = 'admin' | 'self-service'

export interface StudentInput {
  name: string
  email: string
  whatsapp?: string
  status?: string
  course?: string
  source?: StudentSource
  leadTag?: string
  lastContact?: string
}

interface StudentRow {
  id: string
  client_id: string
  name: string
  email: string
  whatsapp: string | null
  status: string | null
  course: string | null
  source: string | null
  lead_tag: string | null
  last_contact_note: string | null
  created_at: string | null
}

const STUDENTS_TABLE = 'students'

function mapRowToStudent(row: StudentRow): Student {
  return {
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    email: row.email,
    whatsapp: row.whatsapp,
    status: row.status,
    course: row.course,
    source: (row.source as StudentSource | null) ?? null,
    leadTag: row.lead_tag,
    lastContact: row.last_contact_note,
    createdAt: row.created_at,
  }
}

function buildInsertPayload(input: StudentInput) {
  return {
    client_id: CLIENT_ID,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    whatsapp: input.whatsapp ? input.whatsapp.trim() : null,
    status: input.status ?? 'Pendente',
    course: input.course ?? null,
    source: input.source ?? 'admin',
    lead_tag: input.leadTag ?? null,
    last_contact_note: input.lastContact ?? null,
  }
}

export async function listStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from(STUDENTS_TABLE)
    .select('*')
    .eq('client_id', CLIENT_ID)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data as StudentRow[]).map(mapRowToStudent)
}

export async function createStudent(input: StudentInput): Promise<Student> {
  const payload = buildInsertPayload(input)

  const { data, error } = await supabase
    .from(STUDENTS_TABLE)
    .upsert(payload, { onConflict: 'client_id,email', ignoreDuplicates: false, returning: 'representation' })
    .select('*')
    .single()

  if (error || !data) {
    throw error || new Error('Falha ao criar aluno')
  }

  return mapRowToStudent(data as StudentRow)
}

export async function updateStudent(id: string, input: StudentInput): Promise<Student> {
  const payload = buildInsertPayload(input)

  const { data, error } = await supabase
    .from(STUDENTS_TABLE)
    .update(payload)
    .eq('id', id)
    .eq('client_id', CLIENT_ID)
    .select('*')
    .single()

  if (error || !data) {
    throw error || new Error('Falha ao atualizar aluno')
  }

  return mapRowToStudent(data as StudentRow)
}

export async function deleteStudent(id: string): Promise<void> {
  const { error } = await supabase
    .from(STUDENTS_TABLE)
    .delete()
    .eq('id', id)
    .eq('client_id', CLIENT_ID)

  if (error) {
    throw error
  }
}
