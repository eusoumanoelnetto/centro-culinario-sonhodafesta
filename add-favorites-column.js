/**
 * Migração automática: Adicionar coluna favorites
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://omnuydikeejhiahkufwa.supabase.co';
const supabaseKey = 'sb_publishable_iAYfPVW85cV66HVY9V_jwQ_w0TtRycg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addFavoritesColumn() {
  console.log('🚀 Tentando adicionar coluna favorites...\n');

  try {
    // Método 1: Tentar query SQL direta
    console.log('📝 Tentativa 1: SQL direto...');
    const { data: sqlData, error: sqlError } = await supabase
      .from('students')
      .select('id, favorites')
      .limit(1);

    if (!sqlError) {
      console.log('✅ Coluna "favorites" já existe!');
      console.log('📊 Teste bem-sucedido:', sqlData);
      return;
    }

    // Se erro for que coluna não existe, vamos tentar criar
    if (sqlError.message.includes('column') || sqlError.message.includes('favorites')) {
      console.log('⚠️  Coluna "favorites" não existe ainda');
      console.log('🔧 Tentando criar via Supabase API...\n');

      // Método 2: Usar REST API do Supabase para alterar schema
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          query: `
            ALTER TABLE students 
            ADD COLUMN IF NOT EXISTS favorites JSONB DEFAULT NULL;
            
            CREATE INDEX IF NOT EXISTS idx_students_favorites 
            ON students USING GIN (favorites);
          `
        })
      });

      if (response.ok) {
        console.log('✅ Migração executada com sucesso!');
      } else {
        throw new Error(`Falha na API: ${response.status}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro na migração automática:', error.message);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 EXECUTE MANUALMENTE NO SUPABASE SQL EDITOR:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('ALTER TABLE students');
    console.log('ADD COLUMN IF NOT EXISTS favorites JSONB DEFAULT NULL;');
    console.log('');
    console.log('CREATE INDEX IF NOT EXISTS idx_students_favorites');
    console.log('ON students USING GIN (favorites);');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🌐 Acesse: https://supabase.com/dashboard/project/omnuydikeejhiahkufwa/editor');
  }
}

// Verificar se a coluna já existe
async function verifyColumn() {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('id, favorites')
      .limit(1);

    if (!error) {
      console.log('\n✅ VERIFICAÇÃO: Coluna "favorites" está funcionando!');
      console.log('📊 Estrutura do banco está correta.');
      return true;
    } else {
      console.log('\n❌ VERIFICAÇÃO: Coluna "favorites" ainda não existe');
      console.log('Erro:', error.message);
      return false;
    }
  } catch (err) {
    console.log('\n⚠️  Erro na verificação:', err.message);
    return false;
  }
}

// Executar
(async () => {
  await addFavoritesColumn();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1s
  await verifyColumn();
})();
