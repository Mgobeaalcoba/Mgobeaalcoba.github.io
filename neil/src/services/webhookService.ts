const CONTACT_WEBHOOK = process.env.NEXT_PUBLIC_N8N_CONTACT_WEBHOOK ?? '';
const QUOTE_WEBHOOK = process.env.NEXT_PUBLIC_N8N_QUOTE_WEBHOOK ?? '';

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
  if (!url) {
    console.warn('[webhookService] Webhook URL not configured. Simulating success.');
    return true;
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error('[webhookService] Failed to send webhook:', err);
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
