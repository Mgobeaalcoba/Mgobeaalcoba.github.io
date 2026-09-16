export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  type: string;
  message: string;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
}

const CONTACT_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_CONTACT_WEBHOOK ?? '';
const QUOTE_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_QUOTE_WEBHOOK ?? '';
const ALLOWED_WEBHOOK_ORIGIN = 'https://mgobeaalcoba.app.n8n.cloud';

const allowedWebhookUrl = (value: string): string | null => {
  try {
    const url = new URL(value);
    return url.origin === ALLOWED_WEBHOOK_ORIGIN && url.pathname.startsWith('/webhook/') && !url.search && !url.hash
      ? url.toString()
      : null;
  } catch { return null; }
};

const sendToWebhook = async (url: string, data: ContactFormData): Promise<WebhookResponse> => {
  const endpoint = allowedWebhookUrl(url);
  if (!endpoint) throw new Error('webhook_not_configured');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      source: 'elportugues-landing',
      timestamp: new Date().toISOString(),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Webhook error: ${response.status}`);
  }

  return { success: true, message: 'Formulario enviado correctamente' };
};

export const sendContactForm = async (data: ContactFormData): Promise<WebhookResponse> => {
  return sendToWebhook(CONTACT_WEBHOOK_URL, data);
};

export const sendQuoteRequest = async (data: ContactFormData): Promise<WebhookResponse> => {
  return sendToWebhook(QUOTE_WEBHOOK_URL, data);
};
