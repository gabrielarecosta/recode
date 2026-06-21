-- ReCode Studio Supabase Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ROLES
create table if not exists public.roles (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROFILES
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null unique,
    name text,
    role_id uuid references public.roles(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SERVICES
create table if not exists public.services (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    slug text not null unique,
    description text,
    category text, -- 'web', 'ecommerce', 'system', 'automation', etc.
    features text[], -- List of key features
    example_use text,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SOLUTIONS
create table if not exists public.solutions (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    slug text not null unique,
    description text,
    complexity_level text, -- 'Bajo', 'Medio', 'Alto', 'Avanzado'
    features text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROJECTS
create table if not exists public.projects (
    id uuid primary key default uuid_generate_v4(),
    slug text not null unique,
    name text not null,
    category text not null, -- 'web', 'ecommerce', 'management', etc.
    industry text not null, -- 'indumentaria', 'salud', 'agro', etc.
    type text not null, -- e.g., 'Ecommerce + Gestión Interna'
    status text default 'concept' not null,
    description text not null,
    problem text not null,
    solution text not null,
    features text[] not null,
    is_concept boolean default true not null,
    mockup_desktop text,
    mockup_mobile text,
    flow_diagram jsonb,
    internal_view text,
    integrations text[],
    suggested_phases text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LEADS
create table if not exists public.leads (
    id uuid primary key default uuid_generate_v4(),
    code text not null unique, -- RC-YYYY-XXXXXX
    name text not null,
    company text,
    email text not null,
    phone text,
    city text,
    province text,
    industry text,
    service_interest text,
    message text,
    source text, -- 'direct', 'search', 'social', etc.
    utm_source text,
    utm_medium text,
    utm_campaign text,
    status text default 'Nuevo' not null, -- 'Nuevo', 'Contactado', 'Reunión Agendada', 'Propuesta Enviada', 'Negociación', 'Ganado', 'Perdido', 'Pausado'
    priority text default 'En evaluación' not null, -- 'Prioridad alta', 'Oportunidad calificada', 'En evaluación', 'Proyecto inicial', 'Consulta informativa'
    score integer default 0 not null, -- Puntuación de calificación de leads (0 a 100)
    assigned_to uuid references public.profiles(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LEAD NOTES
create table if not exists public.lead_notes (
    id uuid primary key default uuid_generate_v4(),
    lead_id uuid references public.leads(id) on delete cascade not null,
    author_id uuid references public.profiles(id) not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LEAD EVENTS (Activity logs)
create table if not exists public.lead_events (
    id uuid primary key default uuid_generate_v4(),
    lead_id uuid references public.leads(id) on delete cascade not null,
    event_type text not null, -- 'status_change', 'note_added', 'email_sent', etc.
    description text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DIAGNOSTICS
create table if not exists public.diagnostics (
    id uuid primary key default uuid_generate_v4(),
    lead_id uuid references public.leads(id) on delete cascade,
    recommended_solution text,
    suggested_modules text[],
    complexity text, -- 'Bajo', 'Medio', 'Alto', 'Avanzado'
    estimated_weeks integer,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DIAGNOSTIC ANSWERS
create table if not exists public.diagnostic_answers (
    id uuid primary key default uuid_generate_v4(),
    diagnostic_id uuid references public.diagnostics(id) on delete cascade not null,
    question text not null,
    answer text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUOTES
create table if not exists public.quotes (
    id uuid primary key default uuid_generate_v4(),
    lead_id uuid references public.leads(id) on delete cascade,
    project_type text not null,
    selected_modules text[] not null,
    complexity text not null,
    estimated_min numeric(12,2) not null,
    estimated_max numeric(12,2) not null,
    estimated_weeks integer not null,
    currency text default 'ARS' not null,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUOTE RULES
create table if not exists public.quote_rules (
    id uuid primary key default uuid_generate_v4(),
    category text not null, -- 'base_price', 'additional_module', 'multiplier', etc.
    key_name text not null unique,
    label text not null,
    value numeric(12,2) not null,
    currency text default 'ARS' not null,
    is_active boolean default true not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MEETINGS
create table if not exists public.meetings (
    id uuid primary key default uuid_generate_v4(),
    lead_id uuid references public.leads(id) on delete cascade,
    meeting_type text not null, -- 'initial', 'audit', 'ecommerce', 'automation', etc.
    scheduled_at timestamp with time zone not null,
    duration_minutes integer default 30 not null,
    status text default 'scheduled' not null, -- 'scheduled', 'completed', 'cancelled'
    notes text,
    calendar_link text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SETTINGS
create table if not exists public.settings (
    id uuid primary key default uuid_generate_v4(),
    key_name text not null unique,
    value text not null,
    description text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AUDIT LOGS
create table if not exists public.audit_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id),
    action text not null,
    details text,
    ip_address text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Configuration

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;
alter table public.lead_events enable row level security;
alter table public.diagnostics enable row level security;
alter table public.diagnostic_answers enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_rules enable row level security;
alter table public.meetings enable row level security;
alter table public.audit_logs enable row level security;

-- Setup RLS Policies:
-- Public can read catalog tables
alter table public.services enable row level security;
alter table public.solutions enable row level security;
alter table public.projects enable row level security;

create policy "Public Read Services" on public.services for select using (is_active = true);
create policy "Public Read Solutions" on public.solutions for select using (true);
create policy "Public Read Projects" on public.projects for select using (true);

-- Public can write to leads, contact_forms, diagnostics, quotes, and meetings
create policy "Public Insert Leads" on public.leads for insert with check (true);
create policy "Public Insert Diagnostics" on public.diagnostics for insert with check (true);
create policy "Public Insert Diagnostic Answers" on public.diagnostic_answers for insert with check (true);
create policy "Public Insert Quotes" on public.quotes for insert with check (true);
create policy "Public Insert Meetings" on public.meetings for insert with check (true);

-- Admin role has full access to everything
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles p
    join public.roles r on p.role_id = r.id
    where p.id = auth.uid() and r.name = 'admin'
  );
end;
$$ language plpgsql security definer;

create policy "Admin Full Profile Access" on public.profiles for all using (public.is_admin());
create policy "Admin Full Leads Access" on public.leads for all using (public.is_admin());
create policy "Admin Full Notes Access" on public.lead_notes for all using (public.is_admin());
create policy "Admin Full Events Access" on public.lead_events for all using (public.is_admin());
create policy "Admin Full Diagnostics Access" on public.diagnostics for all using (public.is_admin());
create policy "Admin Full Diagnostic Answers Access" on public.diagnostic_answers for all using (public.is_admin());
create policy "Admin Full Quotes Access" on public.quotes for all using (public.is_admin());
create policy "Admin Full Quote Rules Access" on public.quote_rules for all using (public.is_admin());
create policy "Admin Full Meetings Access" on public.meetings for all using (public.is_admin());
create policy "Admin Full Audit Logs Access" on public.audit_logs for all using (public.is_admin());
create policy "Admin Full Settings Access" on public.settings for all using (public.is_admin());
create policy "Admin Full Services Access" on public.services for all using (public.is_admin());
create policy "Admin Full Solutions Access" on public.solutions for all using (public.is_admin());
create policy "Admin Full Projects Access" on public.projects for all using (public.is_admin());
