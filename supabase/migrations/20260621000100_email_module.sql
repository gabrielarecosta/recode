-- Migration: Add auth triggers, profiles sync, email templates, and settings.

-- 1. Ensure default roles exist
INSERT INTO public.roles (name)
VALUES ('admin'), ('client')
ON CONFLICT (name) DO NOTHING;

-- 2. Trigger to sync auth.users with public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_role_id uuid;
BEGIN
  -- If it's an admin email, make them admin
  IF NEW.email = 'admin@recodestudio.com' OR NEW.email = 'admin@recodestudio.com.ar' OR NEW.email = 'gabriela@recodestudio.com.ar' THEN
    SELECT id INTO default_role_id FROM public.roles WHERE name = 'admin';
  ELSE
    SELECT id INTO default_role_id FROM public.roles WHERE name = 'client';
  END IF;

  INSERT INTO public.profiles (id, email, name, role_id)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), default_role_id)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Email Templates Table
CREATE TABLE IF NOT EXISTS public.email_templates (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_name text UNIQUE NOT NULL,
    subject text NOT NULL,
    body_html text NOT NULL,
    body_text text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for email templates
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Active Email Templates" ON public.email_templates;
CREATE POLICY "Public Read Active Email Templates" ON public.email_templates
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin Full Email Templates Access" ON public.email_templates;
CREATE POLICY "Admin Full Email Templates Access" ON public.email_templates
  FOR ALL USING (public.is_admin());

-- 4. Email Settings Table (SMTP or Resend API key config)
CREATE TABLE IF NOT EXISTS public.email_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_name text UNIQUE NOT NULL,
    value text NOT NULL,
    description text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for email settings
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin Full Email Settings Access" ON public.email_settings;
CREATE POLICY "Admin Full Email Settings Access" ON public.email_settings
  FOR ALL USING (public.is_admin());

-- 5. Helper function with SECURITY DEFINER to allow server-side routing to read email settings safely
CREATE OR REPLACE FUNCTION public.get_email_setting(setting_key text)
RETURNS text AS $$
DECLARE
  val text;
BEGIN
  SELECT value INTO val FROM public.email_settings WHERE key_name = setting_key;
  RETURN val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Seed default templates
INSERT INTO public.email_templates (key_name, subject, body_html, body_text)
VALUES
('lead_confirmation', '¡Gracias por contactar a ReCode Studio!', 
 '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;">
    <h2 style="color: #ffffff; font-family: sans-serif; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">¡Hola {{name}}!</h2>
    <p>Hemos recibido tu consulta para <strong>{{company}}</strong> con éxito.</p>
    <p>Un consultor de nuestro equipo analizará tus requisitos y te contactará en menos de 24 horas hábiles.</p>
    <div style="background-color: #02031e; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee;">
      <p style="margin: 0; font-size: 14px;"><strong>Código de Consulta:</strong> {{code}}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Mensaje enviado:</strong> {{message}}</p>
    </div>
    <p>Saludos cordiales,<br/>El equipo de ReCode Studio</p>
  </div>',
 'Hola {{name}}!\n\nHemos recibido tu consulta para {{company}} con éxito.\nUn consultor de nuestro equipo analizará tus requisitos y te contactará en menos de 24 horas hábiles.\n\nCódigo de Consulta: {{code}}\nMensaje enviado: {{message}}\n\nSaludos cordiales,\nEl equipo de ReCode Studio'),

('quote_notification', 'Tu estimación de presupuesto - ReCode Studio', 
 '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;">
    <h2 style="color: #ffffff; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">Estimación de Presupuesto Realizada</h2>
    <p>Hola {{name}},</p>
    <p>Registramos tu cálculo de presupuesto interactivo para el proyecto de tipo <strong>{{project_type}}</strong>.</p>
    <div style="background-color: #02031e; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee; text-align: center;">
      <span style="font-size: 12px; color: #9ca3af; text-transform: uppercase;">Inversión Estimada</span>
      <h3 style="color: #22d3ee; margin: 10px 0; font-size: 24px;">{{price_range}}</h3>
      <p style="margin: 0; font-size: 14px; color: #ffffff;">Plazo de entrega: {{weeks}} semanas</p>
    </div>
    <p>Código de seguimiento: <strong>{{code}}</strong></p>
    <p>Si querés avanzar con la propuesta final y ajustar los módulos, respondé a este email o agenda una llamada desde nuestro sitio.</p>
    <p>Atentamente,<br/>ReCode Studio</p>
  </div>',
 'Hola {{name}},\n\nRegistramos tu cálculo de presupuesto interactivo para el proyecto de tipo {{project_type}}.\n\nInversión Estimada: {{price_range}}\nPlazo de entrega: {{weeks}} semanas\n\nCódigo de seguimiento: {{code}}\n\nSi querés avanzar con la propuesta final y ajustar los módulos, respondé a este email o agenda una llamada desde nuestro sitio.\n\nAtentamente,\nReCode Studio'),

('meeting_scheduled', 'Reunión agendada con ReCode Studio', 
 '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;">
    <h2 style="color: #ffffff; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">¡Reunión Confirmada!</h2>
    <p>Hola {{name}},</p>
    <p>Tu reunión de consultoría tecnológica ha sido agendada con éxito.</p>
    <div style="background-color: #02031e; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee;">
      <p style="margin: 0; font-size: 14px;"><strong>Fecha y Hora:</strong> {{date_time}} (Argentina)</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Tipo de Reunión:</strong> {{meeting_type}}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Enlace de Videollamada:</strong> <a href="{{link}}" style="color: #22d3ee; text-decoration: underline;">Acceder a la reunión</a></p>
    </div>
    <p>Te sugerimos tener a mano información sobre tus flujos de trabajo actuales y planillas Excel para hacer el relevamiento más ágil.</p>
    <p>¡Nos vemos pronto!<br/>ReCode Studio</p>
  </div>',
 'Hola {{name}},\n\nTu reunión de consultoría tecnológica ha sido agendada con éxito.\n\nFecha y Hora: {{date_time}} (Argentina)\nTipo de Reunión: {{meeting_type}}\nEnlace de Videollamada: {{link}}\n\nTe sugerimos tener a mano información sobre tus flujos de trabajo actuales y planillas Excel para hacer el relevamiento más ágil.\n\n¡Nos vemos pronto!\nReCode Studio'),

('diagnostic_completed', 'Tu Diagnóstico Tecnológico - ReCode Studio', 
 '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;">
    <h2 style="color: #ffffff; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">Tu Diagnóstico de Procesos está listo</h2>
    <p>Hola {{name}},</p>
    <p>Procesamos tus respuestas y generamos el informe de madurez digital para <strong>{{company}}</strong>.</p>
    <div style="background-color: #02031e; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee;">
      <p style="margin: 0; font-size: 14px;"><strong>Solución Recomendada:</strong> {{recommendation}}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Complejidad del Desarrollo:</strong> {{complexity}}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Módulos sugeridos:</strong> {{modules}}</p>
    </div>
    <p>Código de caso para seguimiento: <strong>{{code}}</strong></p>
    <p>Podés ver y descargar tu informe de diagnóstico completo ingresando en nuestro sitio con tu código de caso.</p>
    <p>Saludos cordiales,<br/>ReCode Studio</p>
  </div>',
 'Hola {{name}},\n\nProcesamos tus respuestas y generamos el informe de madurez digital para {{company}}.\n\nSolución Recomendada: {{recommendation}}\nComplejidad del Desarrollo: {{complexity}}\nMódulos sugeridos: {{modules}}\n\nCódigo de caso para seguimiento: {{code}}\n\nPodés ver y descargar tu informe de diagnóstico completo ingresando en nuestro sitio con tu código de caso.\n\nSaludos cordiales,\nReCode Studio')
ON CONFLICT (key_name) 
DO UPDATE SET 
  subject = EXCLUDED.subject, 
  body_html = EXCLUDED.body_html, 
  body_text = EXCLUDED.body_text;

-- Seed default settings
INSERT INTO public.email_settings (key_name, value, description)
VALUES
('provider', 'mock', 'Proveedor activo de email: "mock" (imprime en logs) o "resend" (usa API key) o "smtp" (usa servidor SMTP)'),
('api_key', '', 'API Key para el proveedor de emails (e.g. Resend re_...)'),
('smtp_host', 'smtp.gmail.com', 'Servidor SMTP saliente'),
('smtp_port', '587', 'Puerto SMTP (587 o 465)'),
('smtp_user', '', 'Usuario SMTP (email)'),
('smtp_pass', '', 'Contraseña del servidor SMTP'),
('from_email', 'no-reply@recodestudio.com', 'Dirección de correo remitente'),
('from_name', 'ReCode Studio', 'Nombre visible del remitente')
ON CONFLICT (key_name) DO NOTHING;
