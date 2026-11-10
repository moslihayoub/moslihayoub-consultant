-- ============================================================
-- M84 OPS & PORTFOLIO - SUPABASE SCHEMA MIGRATION & RLS POLICIES
-- ============================================================

-- 1. Table leads
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    message TEXT,
    service TEXT,
    source TEXT DEFAULT 'portfolio',
    chat_history TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table config
CREATE TABLE IF NOT EXISTS public.config (
    id TEXT PRIMARY KEY,
    system_prompt TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Table missions
CREATE TABLE IF NOT EXISTS public.missions (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    manager_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    cabinet_conseil JSONB DEFAULT '{}'::jsonb,
    cabinet_portage JSONB DEFAULT '{}'::jsonb,
    date_start DATE,
    date_end DATE,
    total_days_quota NUMERIC DEFAULT 60,
    work_mode TEXT DEFAULT 'Régie',
    remote_mode TEXT DEFAULT 'Hybride',
    schedule JSONB DEFAULT '{}'::jsonb,
    logo_url TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Table cras
CREATE TABLE IF NOT EXISTS public.cras (
    id TEXT PRIMARY KEY,
    mission_id TEXT REFERENCES public.missions(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    month_label TEXT,
    days_imputed NUMERIC DEFAULT 0,
    total_working_days NUMERIC DEFAULT 21,
    total_hours NUMERIC DEFAULT 168,
    status TEXT DEFAULT 'submitted',
    content TEXT,
    attachment JSONB DEFAULT '{}'::jsonb,
    remarks JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Table absences
CREATE TABLE IF NOT EXISTS public.absences (
    id TEXT PRIMARY KEY,
    mission_id TEXT REFERENCES public.missions(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'Congé',
    date_start DATE NOT NULL,
    date_end DATE NOT NULL,
    duration_days NUMERIC DEFAULT 1,
    status TEXT DEFAULT 'justifiée',
    content TEXT,
    attachment JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Table mission_reports
CREATE TABLE IF NOT EXISTS public.mission_reports (
    id TEXT PRIMARY KEY,
    code TEXT,
    status TEXT DEFAULT 'Livré',
    mission_id TEXT REFERENCES public.missions(id) ON DELETE CASCADE,
    week_number INT,
    week_label TEXT,
    title TEXT NOT NULL,
    date DATE,
    project TEXT,
    attendees JSONB DEFAULT '[]'::jsonb,
    summary TEXT,
    decisions JSONB DEFAULT '[]'::jsonb,
    next_steps JSONB DEFAULT '[]'::jsonb,
    attachment JSONB DEFAULT '{}'::jsonb,
    remarks JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Table portal_users
CREATE TABLE IF NOT EXISTS public.portal_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    company_name TEXT,
    manager_name TEXT,
    role TEXT DEFAULT 'collaborator',
    mission_id TEXT REFERENCES public.missions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Table projects
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    client TEXT,
    category TEXT,
    description TEXT,
    image TEXT,
    url TEXT,
    is_confidential BOOLEAN DEFAULT false,
    password_hash TEXT,
    technologies JSONB DEFAULT '[]'::jsonb,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS & Policies
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Anon and authenticated can read leads" ON public.leads;
CREATE POLICY "Anon and authenticated can read leads" ON public.leads FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Config read policy" ON public.config;
CREATE POLICY "Config read policy" ON public.config FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Config write policy" ON public.config;
CREATE POLICY "Config write policy" ON public.config FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Missions policy" ON public.missions;
CREATE POLICY "Missions policy" ON public.missions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "CRAs policy" ON public.cras;
CREATE POLICY "CRAs policy" ON public.cras FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Absences policy" ON public.absences;
CREATE POLICY "Absences policy" ON public.absences FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Mission reports policy" ON public.mission_reports;
CREATE POLICY "Mission reports policy" ON public.mission_reports FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Portal users policy" ON public.portal_users;
CREATE POLICY "Portal users policy" ON public.portal_users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Projects policy" ON public.projects;
CREATE POLICY "Projects policy" ON public.projects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
