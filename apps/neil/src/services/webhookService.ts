const CONTACT_WEBHOOK = process.env.NEXT_PUBLIC_N8N_CONTACT_WEBHOOK ?? '';
const QUOTE_WEBHOOK = process.env.NEXT_PUBLIC_N8N_QUOTE_WEBHOOK ?? '';
const ALLOWED_WEBHOOK_ORIGIN = 'https://mgobeaalcoba.app.n8n.cloud';

function allowedWebhookUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.origin === ALLOWED_WEBHOOK_ORIGIN && url.pathname.startsWith('/webhook/') && !url.search && !url.hash
      ? url.toString()
      : null;
  } catch { return null; }
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  message: string;
  type: string;
  lang: string;
  source: 'neil-landing';
  timestamp: string;
}

export interface QuoteFormData extends ContactFormData {
  vehicle?: string;
  product?: string;
}

async function sendToWebhook(url: string, data: ContactFormData | QuoteFormData): Promise<boolean> {
  const endpoint = allowedWebhookUrl(url);
  if (!endpoint) return false;
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export const sendContactForm = (data: Omit<ContactFormData, 'source' | 'timestamp'>): Promise<boolean> =>
  sendToWebhook(CONTACT_WEBHOOK, {
    ...data,
    source: 'neil-landing',
    timestamp: new Date().toISOString(),
  });

export const sendQuoteRequest = (data: Omit<QuoteFormData, 'source' | 'timestamp'>): Promise<boolean> =>
  sendToWebhook(QUOTE_WEBHOOK, {
    ...data,
    source: 'neil-landing',
    timestamp: new Date().toISOString(),
  });
