import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Default templates for server-side fallback
const DEFAULT_EMAIL_TEMPLATES = {
  lead_confirmation: {
    subject: '¡Gracias por contactar a ReCode Studio!',
    body_html: '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;"><h2 style="color: #ffffff; font-family: sans-serif; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">¡Hola {{name}}!</h2><p>Hemos recibido tu consulta para <strong>{{company}}</strong> con éxito.</p><p>Un consultor de nuestro equipo analizará tus requisitos y te contactará en menos de 24 horas hábiles.</p><div style="background-color: #02031e; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee;"><p style="margin: 0; font-size: 14px;"><strong>Código de Consulta:</strong> {{code}}</p><p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Mensaje enviado:</strong> {{message}}</p></div><p>Saludos cordiales,<br/>El equipo de ReCode Studio</p></div>',
    body_text: 'Hola {{name}}!\n\nHemos recibido tu consulta para {{company}} con éxito.\nUn consultor de nuestro equipo analizará tus requisitos y te contactará en menos de 24 horas hábiles.\n\nCódigo de Consulta: {{code}}\nMensaje enviado: {{message}}\n\nSaludos cordiales,\nEl equipo de ReCode Studio'
  },
  quote_notification: {
    subject: 'Tu estimación de abono mensual - ReCode Studio',
    body_html: '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;"><h2 style="color: #ffffff; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">Estimación de Abono Realizada</h2><p>Hola {{name}},</p><p>Registramos tu cálculo de abono mensual interactivo para el proyecto de tipo <strong>{{project_type}}</strong>.</p><div style="background-color: #02031e; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee; text-align: center;"><span style="font-size: 12px; color: #9ca3af; text-transform: uppercase;">Cuota Mensual Estimada</span><h3 style="color: #22d3ee; margin: 10px 0; font-size: 24px;">{{price_range}} / mes</h3><p style="margin: 0; font-size: 12px; color: #9ca3af;">Contratación mínima: 12 meses</p><p style="margin: 5px 0 0 0; font-size: 14px; color: #ffffff;">Plazo de implementación: {{weeks}} semanas</p></div><p>Código de seguimiento: <strong>{{code}}</strong></p><p>Si querés avanzar con la propuesta final y ajustar los módulos, respondé a este email o agenda una llamada desde nuestro sitio.</p><p>Atentamente,<br/>ReCode Studio</p></div>',
    body_text: 'Hola {{name}},\n\nRegistramos tu cálculo de abono mensual interactivo para el proyecto de tipo {{project_type}}.\n\nCuota Mensual Estimada: {{price_range}} / mes\nContratación mínima: 12 meses\nPlazo de implementación: {{weeks}} semanas\n\nCódigo de seguimiento: {{code}}\n\nSi querés avanzar con la propuesta final y ajustar los módulos, respondé a este email o agenda una llamada desde nuestro sitio.\n\nAtentamente,\nReCode Studio'
  },
  meeting_scheduled: {
    subject: 'Reunión agendada con ReCode Studio',
    body_html: '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;"><h2 style="color: #ffffff; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">¡Reunión Confirmada!</h2><p>Hola {{name}},</p><p>Tu reunión de consultoría tecnológica ha sido agendada con éxito.</p><div style="background-color: #02031e; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee;"><p style="margin: 0; font-size: 14px;"><strong>Fecha y Hora:</strong> {{date_time}} (Argentina)</p><p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Tipo de Reunión:</strong> {{meeting_type}}</p><p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Enlace de Videollamada:</strong> <a href="{{link}}" style="color: #22d3ee; text-decoration: underline;">Acceder a la reunión</a></p></div><p>Te sugerimos tener a mano información sobre tus flujos de trabajo actuales y planillas Excel para hacer el relevamiento más ágil.</p><p>¡Nos vemos pronto!<br/>ReCode Studio</p></div>',
    body_text: 'Hola {{name}},\n\nTu reunión de consultoría tecnológica ha sido agendada con éxito.\n\nFecha y Hora: {{date_time}} (Argentina)\nTipo de Reunión: {{meeting_type}}\nEnlace de Videollamada: {{link}}\n\nTe sugerimos tener a mano información sobre tus flujos de trabajo actuales y planillas Excel para hacer el relevamiento más ágil.\n\n¡Nos vemos pronto!\nReCode Studio'
  },
  diagnostic_completed: {
    subject: 'Tu Diagnóstico Tecnológico - ReCode Studio',
    body_html: '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #010009; color: #f3f4f6; border-radius: 12px; border: 1px solid #174bff;"><h2 style="color: #ffffff; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">Tu Diagnóstico de Procesos está listo</h2><p>Hola {{name}},</p><p>Procesamos tus respuestas y generamos el informe de madurez digital para <strong>{{company}}</strong>.</p><div style="background-color: #02031e; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #22d3ee;"><p style="margin: 0; font-size: 14px;"><strong>Solución Recomendada:</strong> {{recommendation}}</p><p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Complejidad del Desarrollo:</strong> {{complexity}}</p><p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Módulos sugeridos:</strong> {{modules}}</p></div><p>Código de caso para seguimiento: <strong>{{code}}</strong></p><p>Podés ver y descargar tu informe de diagnóstico completo ingresando en nuestro sitio con tu código de caso.</p><p>Saludos cordiales,<br/>ReCode Studio</p></div>',
    body_text: 'Hola {{name}},\n\nProcesamos tus respuestas y generamos el informe de madurez digital para {{company}}.\n\nSolución Recomendada: {{recommendation}}\nComplejidad del Desarrollo: {{complexity}}\nMódulos sugeridos: {{modules}}\n\nCódigo de caso para seguimiento: {{code}}\n\nPodés ver y descargar tu informe de diagnóstico completo ingresando en nuestro sitio con tu código de caso.\n\nSaludos cordiales,\nReCode Studio'
  }
};

function renderTemplate(content: string, variables: any): string {
  let rendered = content;
  for (const key in variables) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    rendered = rendered.replace(regex, variables[key] || '');
  }
  return rendered;
}

// Bypasses RLS utilizing database security definer function
async function getEmailSetting(keyName: string, defaultValue: string): Promise<string> {
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('get_email_setting', { setting_key: keyName });
      if (!error && data !== null && data !== undefined) {
        return data as string;
      }
    } catch (e) {
      console.warn('RPC get_email_setting failed:', e);
    }
  }
  return defaultValue;
}

export async function POST(req: Request) {
  try {
    const { templateKey, toEmail, data } = await req.json();

    if (!toEmail) {
      return NextResponse.json({ error: 'Missing recipient email' }, { status: 400 });
    }

    // 1. Fetch Template
    let subject = '';
    let bodyHtml = '';
    let bodyText = '';

    if (supabase) {
      const { data: dbTemplate } = await supabase
        .from('email_templates')
        .select('*')
        .eq('key_name', templateKey)
        .single();

      if (dbTemplate) {
        subject = dbTemplate.subject;
        bodyHtml = dbTemplate.body_html;
        bodyText = dbTemplate.body_text;
      }
    }

    // Fallback to default template if not found
    if (!subject) {
      const fallback = DEFAULT_EMAIL_TEMPLATES[templateKey as keyof typeof DEFAULT_EMAIL_TEMPLATES];
      if (fallback) {
        subject = fallback.subject;
        bodyHtml = fallback.body_html;
        bodyText = fallback.body_text;
      } else {
        subject = `Notificación de ReCode Studio — ${templateKey}`;
        bodyHtml = `<div>Notificación de ReCode: ${JSON.stringify(data)}</div>`;
        bodyText = `Notificación de ReCode: ${JSON.stringify(data)}`;
      }
    }

    // Render variables
    subject = renderTemplate(subject, data);
    bodyHtml = renderTemplate(bodyHtml, data);
    bodyText = renderTemplate(bodyText, data);

    // 2. Fetch email credentials from settings table
    const provider = await getEmailSetting('provider', 'mock');
    const fromEmail = await getEmailSetting('from_email', 'no-reply@recodestudio.com');
    const fromName = await getEmailSetting('from_name', 'ReCode Studio');

    console.log(`[Email System] Sending template "${templateKey}" to <${toEmail}> using provider "${provider}"`);

    if (provider === 'resend') {
      const apiKey = await getEmailSetting('api_key', '');
      if (!apiKey) {
        console.error('[Email System] Resend API Key is missing!');
        return NextResponse.json({ error: 'Resend API Key is missing' }, { status: 500 });
      }

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: [toEmail],
          subject: subject,
          html: bodyHtml,
          text: bodyText
        })
      });

      if (!resendRes.ok) {
        const errorText = await resendRes.text();
        console.error('[Email System] Resend API error details:', errorText);
        return NextResponse.json({ error: 'Resend service failed to send email' }, { status: 500 });
      }

      const resendData = await resendRes.json();
      return NextResponse.json({ success: true, message: 'Email sent successfully via Resend', data: resendData });
    }

    if (provider === 'smtp') {
      const host = await getEmailSetting('smtp_host', '');
      const port = await getEmailSetting('smtp_port', '587');
      const user = await getEmailSetting('smtp_user', '');

      // Mock SMTP send output
      console.log(`[SMTP MOCK SENDER]
      Host: ${host}:${port}
      User: ${user}
      From: ${fromName} <${fromEmail}>
      To: ${toEmail}
      Subject: ${subject}
      Body length: ${bodyHtml.length} chars`);

      return NextResponse.json({
        success: true,
        message: 'SMTP simulation complete. Real SMTP requires nodemailer module.',
        details: { host, port, user, toEmail }
      });
    }

    // Default: Mock Provider
    console.log(`[MOCK SENDER OUTPUT]
    To: ${toEmail}
    From: ${fromName} <${fromEmail}>
    Subject: ${subject}
    --- HTML Body ---
    ${bodyHtml}
    --- Text Body ---
    ${bodyText}
    -----------------`);

    return NextResponse.json({
      success: true,
      message: 'Email processed successfully (Mock Mode)',
      details: { toEmail, subject }
    });

  } catch (error: any) {
    console.error('[Email System] Fatal error sending email:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
