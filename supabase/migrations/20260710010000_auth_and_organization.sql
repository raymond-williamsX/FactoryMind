-- Supabase Schema Migration: Enterprise Authentication & Organization Architecture
-- Dangote Cement University Challenge 2026

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. CREATE TABLES ────────────────────────────────────────────────────────

-- Organizations Table (Companies)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID
);

-- Regions Table (Regional segments under organization)
CREATE TABLE IF NOT EXISTS public.regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID,
    UNIQUE (organization_id, name)
);

-- Plants Table (Individual cement factory sites)
CREATE TABLE IF NOT EXISTS public.plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_id UUID NOT NULL REFERENCES public.regions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID,
    UNIQUE (region_id, name)
);

-- Departments Table (Operating divisions within plants)
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID,
    UNIQUE (plant_id, name)
);

-- User Roles Table (RBAC roles)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Role Permissions Table (Extended RBAC actions)
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.user_roles(id) ON DELETE CASCADE,
    permission TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (role_id, permission)
);

-- User Profiles Table (Extends auth.users from Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role_id UUID REFERENCES public.user_roles(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    assigned_plant_id UUID REFERENCES public.plants(id) ON DELETE SET NULL,
    phone_number TEXT,
    profile_photo_url TEXT,
    account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'pending')),
    last_login TIMESTAMPTZ,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Plant Assignments (Maps users to multiple plants if required)
CREATE TABLE IF NOT EXISTS public.user_plant_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plant_id UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, plant_id)
);

-- ── 2. CREATE PERFORMANCE INDEXES ───────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_regions_organization ON public.regions(organization_id);
CREATE INDEX IF NOT EXISTS idx_plants_region ON public.plants(region_id);
CREATE INDEX IF NOT EXISTS idx_departments_plant ON public.departments(plant_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role_id);
CREATE INDEX IF NOT EXISTS idx_profiles_plant ON public.profiles(assigned_plant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_user_plant_assignments_user ON public.user_plant_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plant_assignments_plant ON public.user_plant_assignments(plant_id);

-- ── 3. HELPER SECURITY FUNCTIONS ───────────────────────────────────────────

-- Helper function to check if a user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.profiles p
        JOIN public.user_roles r ON p.role_id = r.id
        WHERE p.id = user_uid AND r.role_name = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(user_uid UUID, req_permission TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.profiles p
        JOIN public.role_permissions rp ON p.role_id = rp.role_id
        WHERE p.id = user_uid AND rp.permission = req_permission
    ) OR public.is_super_admin(user_uid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 4. ROW-LEVEL SECURITY (RLS) POLICIES ────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_plant_assignments ENABLE ROW LEVEL SECURITY;

-- 4.1 Organizations Policies
CREATE POLICY select_organizations_auth ON public.organizations
    FOR SELECT TO authenticated USING (true);

CREATE POLICY manage_organizations_admin ON public.organizations
    FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

-- 4.2 Regions Policies
CREATE POLICY select_regions_auth ON public.regions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY manage_regions_admin ON public.regions
    FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

-- 4.3 Plants Policies
CREATE POLICY select_plants_auth ON public.plants
    FOR SELECT TO authenticated USING (true);

CREATE POLICY manage_plants_admin ON public.plants
    FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()) OR public.has_permission(auth.uid(), 'manage:plants'));

-- 4.4 Departments Policies
CREATE POLICY select_departments_auth ON public.departments
    FOR SELECT TO authenticated USING (true);

CREATE POLICY manage_departments_admin ON public.departments
    FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()) OR public.has_permission(auth.uid(), 'manage:plants'));

-- 4.5 User Roles Policies
CREATE POLICY select_user_roles_auth ON public.user_roles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY manage_user_roles_admin ON public.user_roles
    FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

-- 4.6 Role Permissions Policies
CREATE POLICY select_role_permissions_auth ON public.role_permissions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY manage_role_permissions_admin ON public.role_permissions
    FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

-- 4.7 Profiles Policies
CREATE POLICY select_profiles_auth ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY update_profiles_self ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY manage_profiles_admin ON public.profiles
    FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()) OR public.has_permission(auth.uid(), 'manage:users'));

-- 4.8 User Plant Assignments Policies
CREATE POLICY select_plant_assignments_auth ON public.user_plant_assignments
    FOR SELECT TO authenticated USING (true);

CREATE POLICY manage_plant_assignments_admin ON public.user_plant_assignments
    FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()) OR public.has_permission(auth.uid(), 'manage:users'));

-- ── 5. AUTOMATED USER PROFILING TRIGGER ─────────────────────────────────────

-- Trigger to sync new user signups from auth.users to public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role_id UUID;
    role_name_val TEXT;
    metadata_plant_id UUID;
    metadata_department_id UUID;
BEGIN
    -- Extract desired role from user metadata, defaulting to 'read_only_executive'
    role_name_val := COALESCE(new.raw_user_meta_data->>'role_name', 'read_only_executive');
    
    -- Retrieve role ID matching role name
    SELECT id INTO default_role_id FROM public.user_roles WHERE role_name = role_name_val;
    
    -- Fallback if role not found
    IF default_role_id IS NULL THEN
        SELECT id INTO default_role_id FROM public.user_roles WHERE role_name = 'read_only_executive';
    END IF;

    -- Extract plant and department UUIDs from user metadata if provided
    IF (new.raw_user_meta_data->>'assigned_plant_id') IS NOT NULL AND (new.raw_user_meta_data->>'assigned_plant_id') <> '' THEN
        metadata_plant_id := (new.raw_user_meta_data->>'assigned_plant_id')::UUID;
    END IF;
    IF (new.raw_user_meta_data->>'department_id') IS NOT NULL AND (new.raw_user_meta_data->>'department_id') <> '' THEN
        metadata_department_id := (new.raw_user_meta_data->>'department_id')::UUID;
    END IF;

    -- Create profile row
    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        role_id,
        assigned_plant_id,
        department_id,
        account_status,
        timezone
    ) VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.email,
        default_role_id,
        metadata_plant_id,
        metadata_department_id,
        'active',
        COALESCE(new.raw_user_meta_data->>'timezone', 'UTC')
    );

    -- Insert default plant assignment if assigned
    IF metadata_plant_id IS NOT NULL THEN
        INSERT INTO public.user_plant_assignments (user_id, plant_id)
        VALUES (new.id, metadata_plant_id)
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 6. SEED MOCK DATA ────────────────────────────────────────────────────────

-- 6.1 Insert Organizations (Company)
INSERT INTO public.organizations (id, name, created_by)
VALUES ('11111111-1111-1111-1111-111111111111', 'Dangote Cement Plc', NULL)
ON CONFLICT (name) DO NOTHING;

-- 6.2 Insert Regions
INSERT INTO public.regions (id, organization_id, name, created_by)
VALUES 
    ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Nigeria & West Africa', NULL),
    ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'East Africa', NULL),
    ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'South Africa & Pan-Africa', NULL)
ON CONFLICT (organization_id, name) DO NOTHING;

-- 6.3 Insert Plants
INSERT INTO public.plants (id, region_id, name, location, created_by)
VALUES 
    ('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222221', 'Obajana Cement Plant', 'Kogi State, Nigeria', NULL),
    ('33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222221', 'Ibese Cement Plant', 'Ogun State, Nigeria', NULL),
    ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222221', 'Gboko Cement Plant', 'Benue State, Nigeria', NULL),
    ('33333333-3333-3333-3333-333333333334', '22222222-2222-2222-2222-222222222222', 'Mtwara Cement Plant', 'Mtwara, Tanzania', NULL),
    ('33333333-3333-3333-3333-333333333335', '22222222-2222-2222-2222-222222222223', 'Mamba Cement Plant', 'Limpopo, South Africa', NULL)
ON CONFLICT (region_id, name) DO NOTHING;

-- 6.4 Insert Departments for Obajana & Ibese Plants
INSERT INTO public.departments (id, plant_id, name, created_by)
VALUES 
    ('44444444-4444-4444-4444-444444444411', '33333333-3333-3333-3333-333333333331', 'Kiln & Pyroprocessing', NULL),
    ('44444444-4444-4444-4444-444444444412', '33333333-3333-3333-3333-333333333331', 'Raw Grinding & Mill', NULL),
    ('44444444-4444-4444-4444-444444444413', '33333333-3333-3333-3333-333333333331', 'Quality Control Lab', NULL),
    ('44444444-4444-4444-4444-444444444414', '33333333-3333-3333-3333-333333333331', 'Energy & Power Utility', NULL),
    ('44444444-4444-4444-4444-444444444421', '33333333-3333-3333-3333-333333333332', 'Kiln & Pyroprocessing', NULL),
    ('44444444-4444-4444-4444-444444444422', '33333333-3333-3333-3333-333333333332', 'Raw Grinding & Mill', NULL),
    ('44444444-4444-4444-4444-444444444423', '33333333-3333-3333-3333-333333333332', 'Quality Control Lab', NULL),
    ('44444444-4444-4444-4444-444444444424', '33333333-3333-3333-3333-333333333332', 'Energy & Power Utility', NULL)
ON CONFLICT (plant_id, name) DO NOTHING;

-- 6.5 Insert Roles
INSERT INTO public.user_roles (id, role_name, display_name, description)
VALUES 
    ('55555555-5555-5555-5555-555555555551', 'super_admin', 'Super Administrator', 'Full system-wide administrative control, environment variables, user roles, system health, and configuration access.'),
    ('55555555-5555-5555-5555-555555555552', 'plant_manager', 'Plant Manager', 'Oversees complete operations at assigned plant sites, configures local thresholds, manages local operators.'),
    ('55555555-5555-5555-5555-555555555553', 'operations_manager', 'Operations Manager', 'Manages daily kiln and grinding metrics, updates setpoints, and reviews OEE dashboards.'),
    ('55555555-5555-5555-5555-555555555554', 'maintenance_engineer', 'Maintenance Engineer', 'Inspects machinery telemetry, schedules system downtime, and views vibration diagnostics.'),
    ('55555555-5555-5555-5555-555555555555', 'quality_engineer', 'Quality Engineer', 'Monitors cement composition assays (clinker silicate, free lime, blaine value) and lab diagnostics.'),
    ('55555555-5555-5555-5555-555555555556', 'energy_analyst', 'Energy Analyst', 'Reviews specific thermal energy consumption (kcal/kg clinker), grid electricity factor, and fuel usage rates.'),
    ('55555555-5555-5555-5555-555555555557', 'read_only_executive', 'Read-Only Executive', 'Global aggregate KPIs, summaries, and telemetry charts. Cannot alter configurations or trigger procedures.')
ON CONFLICT (role_name) DO NOTHING;

-- 6.6 Insert Role Permissions
-- Permissions structure:
--   'view:dashboard'   -> Access overview shell
--   'view:plants'      -> Access plant details & unit views
--   'view:analytics'   -> Access advanced chart logs
--   'view:settings'    -> Access platform settings page
--   'manage:users'     -> Modify profiles, adjust system roles
--   'manage:plants'    -> Modify plant and department records
--   'manage:settings'  -> Modify server variables and limits
--   'manage:operations'-> Change PLC targets & kiln controllers
--   'manage:maintenance'-> Schedule machinery orders and downtime
--   'manage:quality'   -> Input lab chemical composition metrics
--   'manage:energy'    -> Configure energy optimization schedules

-- Seed Permissions for 'super_admin' (Full access bypasses checks, but let's declare them)
INSERT INTO public.role_permissions (role_id, permission) VALUES
    ('55555555-5555-5555-5555-555555555551', 'view:dashboard'),
    ('55555555-5555-5555-5555-555555555551', 'view:plants'),
    ('55555555-5555-5555-5555-555555555551', 'view:analytics'),
    ('55555555-5555-5555-5555-555555555551', 'view:settings'),
    ('55555555-5555-5555-5555-555555555551', 'manage:users'),
    ('55555555-5555-5555-5555-555555555551', 'manage:plants'),
    ('55555555-5555-5555-5555-555555555551', 'manage:settings')
ON CONFLICT DO NOTHING;

-- Seed Permissions for 'plant_manager'
INSERT INTO public.role_permissions (role_id, permission) VALUES
    ('55555555-5555-5555-5555-555555555552', 'view:dashboard'),
    ('55555555-5555-5555-5555-555555555552', 'view:plants'),
    ('55555555-5555-5555-5555-555555555552', 'view:analytics'),
    ('55555555-5555-5555-5555-555555555552', 'view:settings'),
    ('55555555-5555-5555-5555-555555555552', 'manage:users'),
    ('55555555-5555-5555-5555-555555555552', 'manage:plants'),
    ('55555555-5555-5555-5555-555555555552', 'manage:operations'),
    ('55555555-5555-5555-5555-555555555552', 'manage:maintenance'),
    ('55555555-5555-5555-5555-555555555552', 'manage:quality'),
    ('55555555-5555-5555-5555-555555555552', 'manage:energy')
ON CONFLICT DO NOTHING;

-- Seed Permissions for 'operations_manager'
INSERT INTO public.role_permissions (role_id, permission) VALUES
    ('55555555-5555-5555-5555-555555555553', 'view:dashboard'),
    ('55555555-5555-5555-5555-555555555553', 'view:plants'),
    ('55555555-5555-5555-5555-555555555553', 'view:analytics'),
    ('55555555-5555-5555-5555-555555555553', 'manage:operations')
ON CONFLICT DO NOTHING;

-- Seed Permissions for 'maintenance_engineer'
INSERT INTO public.role_permissions (role_id, permission) VALUES
    ('55555555-5555-5555-5555-555555555554', 'view:dashboard'),
    ('55555555-5555-5555-5555-555555555554', 'view:plants'),
    ('55555555-5555-5555-5555-555555555554', 'view:analytics'),
    ('55555555-5555-5555-5555-555555555554', 'manage:maintenance')
ON CONFLICT DO NOTHING;

-- Seed Permissions for 'quality_engineer'
INSERT INTO public.role_permissions (role_id, permission) VALUES
    ('55555555-5555-5555-5555-555555555555', 'view:dashboard'),
    ('55555555-5555-5555-5555-555555555555', 'view:plants'),
    ('55555555-5555-5555-5555-555555555555', 'view:analytics'),
    ('55555555-5555-5555-5555-555555555555', 'manage:quality')
ON CONFLICT DO NOTHING;

-- Seed Permissions for 'energy_analyst'
INSERT INTO public.role_permissions (role_id, permission) VALUES
    ('55555555-5555-5555-5555-555555555556', 'view:dashboard'),
    ('55555555-5555-5555-5555-555555555556', 'view:plants'),
    ('55555555-5555-5555-5555-555555555556', 'view:analytics'),
    ('55555555-5555-5555-5555-555555555556', 'manage:energy')
ON CONFLICT DO NOTHING;

-- Seed Permissions for 'read_only_executive'
INSERT INTO public.role_permissions (role_id, permission) VALUES
    ('55555555-5555-5555-5555-555555555557', 'view:dashboard'),
    ('55555555-5555-5555-5555-555555555557', 'view:plants'),
    ('55555555-5555-5555-5555-555555555557', 'view:analytics')
ON CONFLICT DO NOTHING;
