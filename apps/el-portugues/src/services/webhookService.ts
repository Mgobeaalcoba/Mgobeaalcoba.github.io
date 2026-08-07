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

const sendToWebhook = async (url: string, data: ContactFormData): Promise<WebhookResponse> => {
  if (!url) {
    console.warn('Webhook URL not configured. Set NEXT_PUBLIC_N8N_CONTACT_WEBHOOK in .env.local');
    return { success: false, message: 'Webhook URL not configured' };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      source: 'elportugues-landing',
      timestamp: new Date().toISOString(),
    }),
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
