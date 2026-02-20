-- Tabela para histórico de certificações
CREATE TABLE admin_certificacoes (
  id SERIAL PRIMARY KEY,
  aluno_id UUID NOT NULL,
  aluno_nome TEXT NOT NULL,
  curso_id UUID NOT NULL,
  curso_nome TEXT NOT NULL,
  tipo TEXT NOT NULL, -- Ex: 'Original', '2ª Via', 'Correção'
  status TEXT NOT NULL, -- Ex: 'Entregue', 'Pendente', 'Erro'
  data_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  admin_user TEXT,
  arquivo_url TEXT -- (opcional, para link do certificado)
);

-- Índices e constraints adicionais (opcional)
CREATE INDEX idx_certificacoes_aluno_id ON admin_certificacoes(aluno_id);
CREATE INDEX idx_certificacoes_curso_id ON admin_certificacoes(curso_id);
