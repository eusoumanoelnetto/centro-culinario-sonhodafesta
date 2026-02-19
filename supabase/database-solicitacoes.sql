-- Criação da tabela de solicitações no Supabase
create table if not exists solicitacoes (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    tipo text not null,
    detalhes text,
    status text not null default 'pendente',
    criado_em timestamp with time zone default now(),
    resolvido_em timestamp with time zone
);

-- Índice para facilitar buscas por status
create index if not exists idx_solicitacoes_status on solicitacoes(status);