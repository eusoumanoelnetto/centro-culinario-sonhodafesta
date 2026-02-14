import { supabase, CLIENT_ID } from './supabase'
import { Student } from '../types'

export type StudentSource = 'admin' | 'self-service'

export interface StudentInput {
  name: string
  email: string
  cpf?: string
  whatsapp?: string
  password?: string
  firstAccess?: boolean
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
  cpf: string | null
  whatsapp: string | null
  password: string | null
  first_access: boolean | null
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
    cpf: row.cpf,
    whatsapp: row.whatsapp,
    password: row.password,
    firstAccess: row.first_access,
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
    cpf: input.cpf ? input.cpf.trim() : null,
    whatsapp: input.whatsapp ? input.whatsapp.trim() : null,
    password: input.password ? input.password.trim() : null,
    first_access: input.firstAccess ?? true,
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
    .insert(payload)
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

export async function authenticateStudent(email: string, password: string): Promise<Student | null> {
  console.log('🔍 authenticateStudent chamado:', {
    email: email.trim().toLowerCase(),
    passwordLength: password.trim().length,
    clientId: CLIENT_ID
  });

  const { data, error } = await supabase
    .from(STUDENTS_TABLE)
    .select('*')
    .eq('client_id', CLIENT_ID)
    .eq('email', email.trim().toLowerCase())
    .single()

  if (error) {
    console.log('❌ Erro ao buscar aluno:', error);
    return null
  }

  if (!data) {
    console.log('⚠️ Aluno não encontrado com este e-mail');
    return null
  }

  const student = mapRowToStudent(data as StudentRow)

  console.log('👤 Aluno encontrado:', {
    id: student.id,
    name: student.name,
    email: student.email,
    hasCpf: !!student.cpf,
    cpfPreview: student.cpf ? student.cpf.substring(0, 3) + '...' : null,
    hasPassword: !!student.password,
    passwordPreview: student.password ? student.password.substring(0, 3) + '...' : null,
    firstAccess: student.firstAccess
  });

  // Se for primeiro acesso, senha é o CPF
  if (student.firstAccess && student.cpf) {
    console.log('🔑 Verificando CPF como senha (primeiro acesso)');
    const cpfMatch = password.trim() === student.cpf.trim();
    console.log('🔑 CPF match:', cpfMatch);
    if (cpfMatch) {
      return student
    }
    return null
  }

  // Caso contrário, verifica senha normal
  console.log('🔑 Verificando senha normal');
  if (student.password && password.trim() === student.password.trim()) {
    console.log('✅ Senha correta');
    return student
  }

  console.log('❌ Senha incorreta');
  return null
}

export async function updatePassword(id: string, newPassword: string): Promise<void> {
  const { error } = await supabase
    .from(STUDENTS_TABLE)
    .update({ 
      password: newPassword.trim(),
      first_access: false
    })
    .eq('id', id)
    .eq('client_id', CLIENT_ID)

  if (error) {
    throw error
  }
}
