import { useState, useCallback, useRef, useEffect } from 'react';
import { events } from '@/lib/gtag';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCareerExperienceYears } from '@/lib/experience';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface UserIdentity {
    name: string;
    email: string;
}

const ASSISTANT_LEAD_WEBHOOK = 'https://mgobeaalcoba.app.n8n.cloud/webhook/contacto-webhook';
const ASSISTANT_PROXY_ORIGIN = 'https://mgobeaalcoba.app.n8n.cloud';

function getAssistantProxyUrl(): string | null {
    const configured = process.env.NEXT_PUBLIC_AI_WEBHOOK_URL?.trim();
    if (!configured) return null;
    try {
        const url = new URL(configured);
        const allowedPath = url.pathname.startsWith('/webhook/');
        if (url.origin !== ASSISTANT_PROXY_ORIGIN || !allowedPath || url.search || url.hash) return null;
        return url.toString();
    } catch {
        return null;
    }
}

function latencyBand(milliseconds: number): 'under_2s' | '2s_to_5s' | 'over_5s' {
    if (milliseconds < 2_000) return 'under_2s';
    if (milliseconds <= 5_000) return '2s_to_5s';
    return 'over_5s';
}

function buildSystemPrompt(lang: 'es' | 'en'): string {
    const langInstruction = lang === 'en'
        ? 'IMPORTANT: The site is currently set to English. Your INITIAL welcome message MUST be in English. Then, ALWAYS reply in the SAME LANGUAGE the user writes in. If they write in Spanish, reply in Spanish. If they write in English, reply in English. Never mix languages in a single response.'
        : 'IMPORTANTE: El sitio está configurado en español. Tu mensaje de bienvenida INICIAL debe ser en español. Luego, responde SIEMPRE en el idioma en el que te escriba el usuario. Si te escribe en inglés, responde en inglés. Si te escribe en español, responde en español. Nunca mezcles idiomas en una misma respuesta.';

    return `You are the Technical and Commercial Assistant of Mariano Gobea Alcoba, designed specifically for the MGA Tech Consulting website.
Your main purpose is to qualify leads, answer professional queries about services, technology, portfolio, and get users to contact Mariano directly via WhatsApp or email.

${langInstruction}

STRICT RESPONSE RULES:
1. You CAN ONLY answer questions related to:
   - MGA Tech Consulting services (Automation, Artificial Intelligence, Data & BI, Mentoring).
   - Mariano Gobea Alcoba's professional profile, experience, and portfolio.
   - Blog content and resources published on the website.
   - How to contact Mariano.
2. If the user asks about ANYTHING else (weather, politics, history, general programming unrelated to services, jokes, etc.), you MUST POLITELY REFUSE.
   - Example refusal (adapt language to match user): "I'm sorry, as the MGA Tech Consulting assistant, I'm only trained to answer questions about Mariano's automation, AI and Data services, his portfolio, or to help you contact him. How can I assist you on these topics?"
3. MAIN GOAL: Whenever natural in the conversation, subtly persuade the user to contact Mariano directly through the contact form (WhatsApp or email).
4. To offer contacting Mariano, use EXACTLY this tag at the end of your message: [ACTION:CONTACT]
   - Example: "I'd love to discuss how we can automate your processes. You can reach Mariano directly from here: [ACTION:CONTACT]"
   - IMPORTANT: Do NOT mention Calendly, scheduling, or booking a meeting — contact happens via a short form that sends a WhatsApp message or email.
5. Always speak in first person plural (we/nosotros) when talking about the consultancy, or third person when referring specifically to Mariano's career.
6. Your tone: Professional, technical, solutions-focused, clear and friendly (B2B consultant style).
7. NEVER invent information. If you don't know something about Mariano's experience or services, clearly say you don't have that information and suggest contacting him. [ACTION:CONTACT]

CONTEXT ABOUT MARIANO GOBEA ALCOBA AND MGA TECH CONSULTING:
- Mariano is a Data & Analytics Technical Leader at Mercado Libre, with over ${getCareerExperienceYears()} years of experience since May 2019.
- MGA Tech Consulting is a consultancy focused on SMEs that want to automate processes, implement Business Intelligence (BI), or adopt AI without their own technical team.
- Services: Process Automation (n8n, Zapier), Business Intelligence & Analytics, Digital Transformation with AI (RAG, agents, fine-tuning).
- The website has Portfolio (/portfolio), Blog (/blog), and Financial Resources (/recursos) sections.
- TAX CALCULATOR CAPABILITY: You have access to a real-time Tax Calculator for Argentina (Ganancias 2026). When a user asks about their salary, net pay, or taxes:
  1. If they haven't provided their Gross Salary (Sueldo Bruto) and any annual bonuses/extras, ask for them to ensure a complete calculation.
  2. Ask if they have dependents (children/hijos) or a spouse (cónyuge) to provide a more accurate calculation.
  3. Inform them that you will calculate the values based on the latest 2026 regulations.
  4. Note: The actual calculation is handled by the backend, you just need to gather the data or explain the results you receive.`;
}

const WELCOME_MESSAGES: Record<'es' | 'en', string> = {
    es: '¡Hola! Soy el asistente virtual de MGA Tech Consulting. Puedo ayudarte con:\n\n- **Cálculo de Impuesto a las Ganancias (Arg 2026)**\n- Consultas técnicas sobre automatización e IA\n- Información sobre el portfolio y trayectoria de Mariano\n- Búsqueda de soluciones específicas en nuestro Blog técnico\n- Contactar a Mariano por WhatsApp o email\n\n¿En qué puedo ayudarte hoy?',
    en: 'Hi there! I\'m the MGA Tech Consulting virtual assistant. I can help you with:\n\n- **Income Tax Calculation (Argentina 2026)**\n- Technical queries about automation and AI\n- Information about Mariano\'s portfolio and experience\n- Searching for specific solutions in our Technical Blog\n- Contacting Mariano via WhatsApp or email\n\nHow can I help you today?',
};

export function useAIAssistant() {
    const { lang } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // The identity gate feeds user_info to the n8n lead workflow on the first message.
    const [user, setUser] = useState<UserIdentity | null>(null);

    const hasInitialized = useRef(false);
    const currentLang = useRef(lang);

    // Initialize messages and user identity on first mount
    useEffect(() => {
        if (!hasInitialized.current) {
            // Keep contact data scoped to the current browser tab/session.
            const savedUser = sessionStorage.getItem('mga_assistant_user');
            if (savedUser) {
                try {
                    const parsed = JSON.parse(savedUser) as UserIdentity;
                    if (parsed.name?.trim() && parsed.email?.trim()) {
                        setUser(parsed);
                    } else {
                        sessionStorage.removeItem('mga_assistant_user');
                    }
                } catch {
                    sessionStorage.removeItem('mga_assistant_user');
                }
            }

            setMessages([
                { id: 'system-1', role: 'system', content: buildSystemPrompt(lang) },
                { id: 'welcome-1', role: 'assistant', content: WELCOME_MESSAGES[lang] }
            ]);
            hasInitialized.current = true;
            currentLang.current = lang;
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // When language changes, reset the chat with updated messages
    useEffect(() => {
        if (hasInitialized.current && lang !== currentLang.current) {
            currentLang.current = lang;
            setMessages([
                { id: 'system-1', role: 'system', content: buildSystemPrompt(lang) },
                { id: 'welcome-1', role: 'assistant', content: WELCOME_MESSAGES[lang] }
            ]);
        }
    }, [lang]);

    useEffect(() => {
        if (isOpen) {
            events.aiAssistantOpen();
        }
    }, [isOpen]);

    const toggleChat = useCallback(() => setIsOpen(prev => !prev), []);

    const identifyUser = useCallback(async (identity: UserIdentity) => {
        const safeIdentity = {
            name: identity.name.trim().slice(0, 120),
            email: identity.email.trim().slice(0, 254),
        };
        const response = await fetch(ASSISTANT_LEAD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: safeIdentity.name,
                email: safeIdentity.email,
                message: 'Nuevo interesado registrado desde el asistente IA.',
                channel: 'email',
                source: 'ai_assistant',
                form_type: 'ai_assistant_identity',
                page: typeof window !== 'undefined' ? window.location.pathname : '/',
                timestamp: new Date().toISOString(),
                language: typeof document !== 'undefined' ? document.documentElement.lang : 'es',
            }),
            signal: AbortSignal.timeout(8000),
        });

        if (!response.ok) throw new Error(`Assistant lead webhook returned ${response.status}`);
        setUser(safeIdentity);
        sessionStorage.setItem('mga_assistant_user', JSON.stringify(safeIdentity));
        events.aiAssistantUserIdentified();
        events.leadDelivery('success', 'ai_assistant', 'ai_assistant_identity');
        events.leadFormSent('ai_assistant', 'ai_assistant_identity');
    }, []);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        const safeContent = content.trim().slice(0, 4_000);
        events.aiAssistantMessageSent(safeContent.length);

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: safeContent
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);
        const requestStartedAt = Date.now();

        try {
            // Build message array: system prompt + history (excluding welcome) + new user message
            const systemPrompt = buildSystemPrompt(currentLang.current);
            const apiMessages = [
                { role: 'system', content: systemPrompt },
                ...messages.filter(m => m.role !== 'system' && m.id !== 'welcome-1').slice(-12).map(m => ({
                    role: m.role,
                    content: m.content.slice(0, 4_000)
                })),
                { role: 'user', content: userMessage.content }
            ];

            // AI credentials stay server-side. The browser only calls the allowlisted n8n proxy.
            const apiProxyUrl = getAssistantProxyUrl();
            if (!apiProxyUrl) throw new Error('assistant_proxy_unavailable');

            const res = await fetch(apiProxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: apiMessages,
                    source_page: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
                    user_info: user,
                }),
                signal: AbortSignal.timeout(20_000),
            });

            if (!res.ok) throw new Error('assistant_proxy_error');
            const data = await res.json() as Record<string, unknown>;
            const candidate = data.content ?? data.output ?? data.message;
            if (typeof candidate !== 'string' || !candidate.trim()) {
                throw new Error('assistant_invalid_response');
            }
            const responseContent = candidate.trim().slice(0, 8_000);

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseContent
            };

            setMessages(prev => [...prev, assistantMessage]);
            events.aiAssistantResponseResult('success', latencyBand(Date.now() - requestStartedAt));

        } catch {
            events.aiAssistantResponseResult('error', latencyBand(Date.now() - requestStartedAt));
            const errorMsg = currentLang.current === 'en'
                ? 'There was a connection error while processing your request. Please try again.'
                : 'Hubo un error de conexión al procesar tu solicitud. Por favor, intentá nuevamente.';
            setError(currentLang.current === 'en' ? 'There was an error. Please try again.' : 'Hubo un error. Por favor, intenta nuevamente.');
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: errorMsg
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, user]);

    return {
        messages: messages.filter(m => m.role !== 'system'),
        isLoading,
        isOpen,
        error,
        user,
        toggleChat,
        sendMessage,
        identifyUser,
        setIsOpen
    };
}
