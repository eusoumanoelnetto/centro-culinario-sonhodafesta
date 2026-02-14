/**
 * Script de migração: Adicionar coluna 'favorites' na tabela students
 * Execute: node migrate-favorites.js
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://omnuydikeejhiahkufwa.supabase.co';
const supabaseKey = 'sb_publishable_iAYfPVW85cV66HVY9V_jwQ_w0TtRycg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('🚀 Iniciando migração: adicionar coluna favorites...');
    
    // Tentar executar a query SQL via RPC
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE students
        ADD COLUMN IF NOT EXISTS favorites JSONB DEFAULT NULL;
        
        CREATE INDEX IF NOT EXISTS idx_students_favorites 
        ON students USING GIN (favorites);
      `
    });

    if (error) {
      console.error('❌ Erro ao executar migração:', error.message);
      console.log('\n📝 Execute manualmente no Supabase SQL Editor:');
      console.log('----------------------------------------------');
      console.log(`
ALTER TABLE students
ADD COLUMN IF NOT EXISTS favorites JSONB DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_students_favorites 
ON students USING GIN (favorites);
      `);
      console.log('----------------------------------------------');
    } else {
      console.log('✅ Migração executada com sucesso!');
      console.log('📊 Coluna "favorites" adicionada à tabela students');
    }
    
  } catch (err) {
    console.error('❌ Erro inesperado:', err);
    console.log('\n📝 SQL para executar manualmente no Supabase:');
    console.log('----------------------------------------------');
    console.log(`
ALTER TABLE students
ADD COLUMN IF NOT EXISTS favorites JSONB DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_students_favorites 
ON students USING GIN (favorites);
    `);
    console.log('----------------------------------------------');
  }
}

runMigration();
