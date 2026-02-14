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
  avatarUrl?: string
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
  avatar_url: string | null
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
    avatarUrl: row.avatar_url,
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
    avatar_url: input.avatarUrl ?? null,
  }
}

// Update parcial - só atualiza campos que foram enviados
function buildUpdatePayload(input: StudentInput) {
  const payload: any = {}
  
  if (input.name !== undefined) payload.name = input.name.trim()
  if (input.email !== undefined) payload.email = input.email.trim().toLowerCase()
  if (input.cpf !== undefined) payload.cpf = input.cpf ? input.cpf.trim() : null
  if (input.whatsapp !== undefined) payload.whatsapp = input.whatsapp ? input.whatsapp.trim() : null
  if (input.password !== undefined) payload.password = input.password ? input.password.trim() : null
  if (input.firstAccess !== undefined) payload.first_access = input.firstAccess
  if (input.status !== undefined) payload.status = input.status
  if (input.course !== undefined) payload.course = input.course || null
  if (input.source !== undefined) payload.source = input.source
  if (input.leadTag !== undefined) payload.lead_tag = input.leadTag || null
  if (input.lastContact !== undefined) payload.last_contact_note = input.lastContact || null
  if (input.avatarUrl !== undefined) payload.avatar_url = input.avatarUrl || null
  
  return payload
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
  const payload = buildUpdatePayload(input)  // ✅ Update parcial - não sobrescreve campos não enviados

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
  console.log('🔍 Autenticando aluno:', email.trim().toLowerCase());

  const { data, error } = await supabase
    .from(STUDENTS_TABLE)
    .select('*')
    .eq('client_id', CLIENT_ID)
    .eq('email', email.trim().toLowerCase())
    .single()

  if (error) {
    console.log('❌ Aluno não encontrado');
    return null
  }

  if (!data) {
    return null
  }

  const student = mapRowToStudent(data as StudentRow)

  console.log('✅ Aluno encontrado:', student.name);
  console.log('   Senha armazenada: ' + (student.password ? '***' : 'N/A'));
  console.log('   CPF armazenado: ' + (student.cpf ? '***' : 'N/A'));

  // Verificar:
  // 1. Se foi criado via painel admin: usa CPF como senha padrão
  // 2. Se foi auto-registro: usa a senha que ele criou
  const storedPassword = student.password || student.cpf; // CPF é a senha padrão para admin

  if (!storedPassword) {
    console.log('❌ Nenhuma senha cadastrada');
    return null
  }

  if (password.trim() === storedPassword.trim()) {
    console.log('✅ Senha correta - autenticação bem-sucedida');
    return student
  }

  console.log('❌ Senha incorreta');
  return null
}

export async function updatePassword(id: string, newPassword: string): Promise<void> {
  const { error } = await supabase
    .from(STUDENTS_TABLE)
    .update({ 
      password: newPassword.trim()
    })
    .eq('id', id)
    .eq('client_id', CLIENT_ID)

  if (error) {
    throw error
  }
}
