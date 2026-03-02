import { useState, useCallback, useRef, useEffect } from 'react';
import { events } from '@/lib/gtag';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface UserIdentity {
    name: string;
    email: string;
}

function buildSystemPrompt(lang: 'es' | 'en'): string {
    const langInstruction = lang === 'en'
        ? 'IMPORTANT: The site is currently set to English. Your INITIAL welcome message MUST be in English. Then, ALWAYS reply in the SAME LANGUAGE the user writes in. If they write in Spanish, reply in Spanish. If they write in English, reply in English. Never mix languages in a single response.'
        : 'IMPORTANTE: El sitio está configurado en español. Tu mensaje de bienvenida INICIAL debe ser en español. Luego, responde SIEMPRE en el idioma en el que te escriba el usuario. Si te escribe en inglés, responde en inglés. Si te escribe en español, responde en español. Nunca mezcles idiomas en una misma respuesta.';

    return `You are the Technical and Commercial Assistant of Mariano Gobea Alcoba, designed specifically for the MGA Tech Consulting website.
Your main purpose is to qualify leads, answer professional queries about services, technology, portfolio, and get users to schedule a meeting.

${langInstruction}

STRICT RESPONSE RULES:
1. You CAN ONLY answer questions related to:
   - MGA Tech Consulting services (Automation, Artificial Intelligence, Data & BI, Mentoring).
   - Mariano Gobea Alcoba's professional profile, experience, and portfolio.
   - Blog content and resources published on the website.
   - How to schedule a meeting or contact Mariano.
2. If the user asks about ANYTHING else (weather, politics, history, general programming unrelated to services, jokes, etc.), you MUST POLITELY REFUSE.
   - Example refusal (adapt language to match user): "I'm sorry, as the MGA Tech Consulting assistant, I'm only trained to answer questions about Mariano's automation, AI and Data services, his portfolio, or to help you schedule a meeting. How can I assist you on these topics?"
3. MAIN GOAL: Whenever natural in the conversation, subtly persuade the user to schedule a meeting with Mariano.
4. To offer scheduling a meeting, use EXACTLY this tag at the end of your message: [ACTION:CALENDLY]
   - Example: "I'd love to discuss how we can automate your processes. You can schedule a call directly with Mariano here: [ACTION:CALENDLY]"
5. Always speak in first person plural (we/nosotros) when talking about the consultancy, or third person when referring specifically to Mariano's career.
6. Your tone: Professional, technical, solutions-focused, clear and friendly (B2B consultant style).
7. NEVER invent information. If you don't know something about Mariano's experience or services, clearly say you don't have that information and suggest scheduling a call. [ACTION:CALENDLY]

CONTEXT ABOUT MARIANO GOBEA ALCOBA AND MGA TECH CONSULTING:
- Mariano is a Data & Analytics Technical Leader at Mercado Libre, with over 6 years of experience.
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
    es: '¡Hola! Soy el asistente virtual de MGA Tech Consulting. Puedo ayudarte con:\n\n- **Cálculo de Impuesto a las Ganancias (Arg 2026)**\n- Consultas técnicas sobre automatización e IA\n- Información sobre el portfolio y trayectoria de Mariano\n- Búsqueda de soluciones específicas en nuestro Blog técnico\n- Agendar una reunión directamente conmigo\n\n¿En qué puedo ayudarte hoy?',
    en: 'Hi there! I\'m the MGA Tech Consulting virtual assistant. I can help you with:\n\n- **Income Tax Calculation (Argentina 2026)**\n- Technical queries about automation and AI\n- Information about Mariano\'s portfolio and experience\n- Searching for specific solutions in our Technical Blog\n- Scheduling a meeting directly with me\n\nHow can I help you today?',
};

export function useAIAssistant() {
    const { lang } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserIdentity | null>(null);

    const hasInitialized = useRef(false);
    const currentLang = useRef(lang);

    // Initialize messages and user identity on first mount
    useEffect(() => {
        if (!hasInitialized.current) {
            // Load user from localStorage
            const savedUser = localStorage.getItem('mga_assistant_user');
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    console.error('Error parsing saved user:', e);
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

    const identifyUser = useCallback((identity: UserIdentity) => {
        setUser(identity);
        localStorage.setItem('mga_assistant_user', JSON.stringify(identity));
        events.aiAssistantUserIdentified(); // Track event if needed
    }, []);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        events.aiAssistantMessageSent(content.length);

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            // Build message array: system prompt + history (excluding welcome) + new user message
            const systemPrompt = buildSystemPrompt(currentLang.current);
            const apiMessages = [
                { role: 'system', content: systemPrompt },
                ...messages.filter(m => m.role !== 'system' && m.id !== 'welcome-1').map(m => ({
                    role: m.role,
                    content: m.content
                })),
                { role: 'user', content: userMessage.content }
            ];

            // In Next.js static exports, NEXT_PUBLIC_ variables are replaced at build time.
            const rawApiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
            const apiKey = rawApiKey.replace(/"/g, '');
            const apiProxyUrl = process.env.NEXT_PUBLIC_AI_WEBHOOK_URL || '';
            const isProxyValid = apiProxyUrl.length > 0 && !apiProxyUrl.includes('tu-instancia.com');

            let responseContent = '';
            const startTime = Date.now();

            if (isProxyValid) {
                // Production mode using n8n webhook proxy
                const res = await fetch(apiProxyUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: apiMessages,
                        source_page: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
                        user_info: user // Send name and email to n8n
                    })
                });

                if (!res.ok) throw new Error('Network error from proxy');
                const data = await res.json();
                responseContent = data.content || data.output || data.message || 'Error in webhook response.';

            } else if (apiKey) {
                // Direct OpenRouter call
                const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'HTTP-Referer': 'https://www.mgatc.com',
                        'X-OpenRouter-Title': 'MGA Tech Consulting',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'z-ai/glm-4.5-air:free',
                        messages: apiMessages,
                    })
                });

                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(`OpenRouter API error: ${errText}`);
                }

                const data = await res.json();
                responseContent = data.choices[0].message.content;
            } else {
                throw new Error('No API Key or Webhook URL configured.');
            }

            const endTime = Date.now();
            const responseTime = Math.floor((endTime - startTime) / 1000);

            // Real-time logging to Supabase (Async fire-and-forget)
            // Logging AFTER response to capture responseTime and conversion status correctly
            if (user) {
                supabase.from('assistant_logs').insert({
                    user_name: user.name,
                    user_email: user.email,
                    content: content,
                    // Simple logic to tag intent/sentiment for the demo
                    intent: content.toLowerCase().includes('consult') || responseContent.toLowerCase().includes('reunion') ? 'consultancy' : 'general',
                    sentiment: 'neutral',
                    conversion: responseContent.includes('[ACTION:CALENDLY]'),
                    response_time: responseTime
                }).then(({ error }) => {
                    if (error) console.error('Error logging to Supabase:', error);
                });
            }

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseContent
            };

            setMessages(prev => [...prev, assistantMessage]);

        } catch (err) {
            console.error('Error sending message:', err);
            const errorMsg = currentLang.current === 'en'
                ? 'There was a connection error. Please make sure the AI credentials are configured and try again.'
                : 'Hubo un error de conexión al procesar tu solicitud. Asegúrate de que las credenciales de IA estén configuradas.';
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
