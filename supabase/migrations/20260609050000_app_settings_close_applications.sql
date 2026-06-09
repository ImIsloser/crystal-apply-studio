-- Tabela de configurações do site (linha única) para abrir/encerrar inscrições
CREATE TABLE public.app_settings (
  id boolean PRIMARY KEY DEFAULT true,
  applications_open boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT app_settings_singleton CHECK (id = true)
);

INSERT INTO public.app_settings (id, applications_open) VALUES (true, true)
ON CONFLICT (id) DO NOTHING;

GRANT SELECT ON public.app_settings TO anon, authenticated;
GRANT UPDATE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode LER (o site público precisa saber se está aberto)
CREATE POLICY "Anyone can read settings" ON public.app_settings
  FOR SELECT TO anon, authenticated USING (true);

-- Apenas administradores podem ALTERAR (abrir/encerrar)
CREATE POLICY "Admins can update settings" ON public.app_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Proteção extra no servidor: bloquear novas inscrições quando encerradas
CREATE OR REPLACE FUNCTION public.applications_are_open()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT applications_open FROM public.app_settings WHERE id = true), true)
$$;
GRANT EXECUTE ON FUNCTION public.applications_are_open() TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Anyone can submit application" ON public.applications;
CREATE POLICY "Anyone can submit application when open" ON public.applications
  FOR INSERT TO anon, authenticated WITH CHECK (public.applications_are_open());
