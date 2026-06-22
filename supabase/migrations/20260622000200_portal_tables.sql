-- Migration: Add Portal Tables (clients, client_projects, messages, documents, payments)
-- and add client-related columns to quotes table.

-- 1. Create CLIENTS table
CREATE TABLE IF NOT EXISTS public.clients (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    whatsapp text NOT NULL,
    company_name text NOT NULL,
    password text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add columns to QUOTES table
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS quote_code text,
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pendiente',
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- 3. Create CLIENT PROJECTS table
CREATE TABLE IF NOT EXISTS public.client_projects (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code text NOT NULL UNIQUE,
    quote_id uuid REFERENCES public.quotes(id) ON DELETE SET NULL,
    user_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    name text NOT NULL,
    status text NOT NULL DEFAULT 'activo', -- 'activo', 'completado', 'pausado'
    start_date text NOT NULL, -- using text format (YYYY-MM-DD) like frontend
    estimated_delivery_date text NOT NULL, -- YYYY-MM-DD
    assigned_pm text NOT NULL DEFAULT 'Tomas Recode',
    progress integer NOT NULL DEFAULT 0,
    phases jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create MESSAGES table
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    project_id uuid REFERENCES public.client_projects(id) ON DELETE CASCADE,
    quote_id uuid REFERENCES public.quotes(id) ON DELETE CASCADE,
    category text NOT NULL, -- 'general', 'cambio_alcance', etc.
    message text NOT NULL,
    sender text NOT NULL, -- 'client', 'recode'
    status text NOT NULL DEFAULT 'open', -- 'open', 'review', etc.
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create DOCUMENTS table
CREATE TABLE IF NOT EXISTS public.documents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    project_id uuid REFERENCES public.client_projects(id) ON DELETE CASCADE,
    quote_id uuid REFERENCES public.quotes(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_type text NOT NULL,
    file_size text NOT NULL,
    status text NOT NULL DEFAULT 'recibido', -- 'recibido', 'revisado', etc.
    uploaded_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create PAYMENTS table
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    project_id uuid REFERENCES public.client_projects(id) ON DELETE CASCADE,
    amount numeric(12,2) NOT NULL,
    period text NOT NULL,
    status text NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'pagado', 'vencido'
    due_date text NOT NULL, -- YYYY-MM-DD
    paid_at text, -- ISO string YYYY-MM-DDTHH:mm:ss.sssZ
    comprobante_uploaded boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for all new tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Setup full access policies for Admins, and full read/write for public (since client authentication is mock/custom)
-- Clients table
CREATE POLICY "Admin Full Clients Access" ON public.clients FOR ALL USING (public.is_admin());
CREATE POLICY "Public Read/Write Clients Access" ON public.clients FOR ALL USING (true) WITH CHECK (true);

-- Client Projects table
CREATE POLICY "Admin Full Client Projects Access" ON public.client_projects FOR ALL USING (public.is_admin());
CREATE POLICY "Public Read/Write Client Projects Access" ON public.client_projects FOR ALL USING (true) WITH CHECK (true);

-- Messages table
CREATE POLICY "Admin Full Messages Access" ON public.messages FOR ALL USING (public.is_admin());
CREATE POLICY "Public Read/Write Messages Access" ON public.messages FOR ALL USING (true) WITH CHECK (true);

-- Documents table
CREATE POLICY "Admin Full Documents Access" ON public.documents FOR ALL USING (public.is_admin());
CREATE POLICY "Public Read/Write Documents Access" ON public.documents FOR ALL USING (true) WITH CHECK (true);

-- Payments table
CREATE POLICY "Admin Full Payments Access" ON public.payments FOR ALL USING (public.is_admin());
CREATE POLICY "Public Read/Write Payments Access" ON public.payments FOR ALL USING (true) WITH CHECK (true);
