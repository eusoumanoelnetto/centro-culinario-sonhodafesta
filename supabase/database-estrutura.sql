-- Tabela de Alunos
create table if not exists admin_alunos (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text unique not null,
    cpf text unique,
    whatsapp text,
    status text not null default 'Ativo',
    course text,
    created_at timestamp with time zone default now()
);

-- Tabela de Cursos
create table if not exists admin_courses (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    instructor text,
    instagram text,
    date date,
    price numeric,
    category text,
    description text,
    capacity integer,
    created_at timestamp with time zone default now()
);

-- Tabela de Professores
create table if not exists admin_teachers (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    specialty text,
    instagram text,
    created_at timestamp with time zone default now()
);

-- Tabela de Posts do Blog
create table if not exists admin_blog_posts (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    author text,
    category text,
    content text,
    tags text[],
    created_at timestamp with time zone default now()
);

-- Tabela de Solicitações/Admin Requests
create table if not exists admin_solicitacoes (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    tipo text not null,
    detalhes text,
    status text not null default 'pendente',
    criado_em timestamp with time zone default now(),
    resolvido_em timestamp with time zone
);

-- Índices úteis
create index if not exists idx_admin_alunos_email on admin_alunos(email);
create index if not exists idx_admin_courses_title on admin_courses(title);
create index if not exists idx_admin_teachers_name on admin_teachers(name);
create index if not exists idx_admin_blog_posts_title on admin_blog_posts(title);
create index if not exists idx_admin_solicitacoes_status on admin_solicitacoes(status);