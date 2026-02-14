/**
 * Migração via Management API do Supabase
 */

const supabaseUrl = 'https://omnuydikeejhiahkufwa.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbnV5ZGlrZWVqaGlhaGt1ZndhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTAxMTk3OCwiZXhwIjoyMDg2NTg3OTc4fQ.90cTV-R_MbH1ccNwVP28X7iJ8oiMi6PUdFUsbayjSUQ';

async function executeSqlDirect() {
  console.log('🚀 Executando SQL diretamente via PostgREST...\n');

  const sqlQuery = `
    ALTER TABLE students ADD COLUMN IF NOT EXISTS favorites JSONB DEFAULT NULL;
    CREATE INDEX IF NOT EXISTS idx_students_favorites ON students USING GIN (favorites);
  `;

  try {
    // Tentar via endpoint /rest/v1/rpc
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: sqlQuery })
    });

    const result = await response.text();
    console.log('📝 Resposta:', response.status, result);

    if (response.ok) {
      console.log('✅ Migração executada!');
    } else {
      console.log('❌ Falhou via API REST');
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📝 SOLUÇÃO: Execute manualmente no SQL Editor');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('1. Acesse: https://supabase.com/dashboard/project/omnuydikeejhiahkufwa/sql');
      console.log('2. Clique em "New query"');
      console.log('3. Cole este SQL:\n');
      console.log('   ALTER TABLE students');
      console.log('   ADD COLUMN IF NOT EXISTS favorites JSONB DEFAULT NULL;');
      console.log('');
      console.log('   CREATE INDEX IF NOT EXISTS idx_students_favorites');
      console.log('   ON students USING GIN (favorites);');
      console.log('\n4. Clique em RUN (ou Ctrl+Enter)');
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n⏱️  Leva menos de 30 segundos!');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n📋 Como o Supabase não permite ALTER TABLE via API,');
    console.log('você precisa executar o SQL manualmente no painel:\n');
    console.log('🔗 https://supabase.com/dashboard/project/omnuydikeejhiahkufwa/sql\n');
    console.log('SQL para executar:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ALTER TABLE students');
    console.log('ADD COLUMN IF NOT EXISTS favorites JSONB DEFAULT NULL;');
    console.log('');
    console.log('CREATE INDEX IF NOT EXISTS idx_students_favorites');
    console.log('ON students USING GIN (favorites);');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  console.log('\n⚠️  IMPORTANTE: Após executar, TROQUE a service_role key!');
  console.log('🔗 https://supabase.com/dashboard/project/omnuydikeejhiahkufwa/settings/api');
}

executeSqlDirect();
