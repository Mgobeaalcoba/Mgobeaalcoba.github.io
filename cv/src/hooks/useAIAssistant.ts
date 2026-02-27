import { useState, useCallback, useRef, useEffect } from 'react';
import { events } from '@/lib/gtag';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const SYSTEM_PROMPT = `Eres el Asistente Técnico y Comercial de Mariano Gobea Alcoba, diseñado específicamente para su sitio web MGA Tech Consulting.
Tu propósito principal es calificar leads, responder consultas profesionales sobre sus servicios, tecnología, portfolio y lograr que el usuario agende una reunión.

REGLAS ESTRICTAS DE RESPUESTA:
1. SÓLO puedes responder preguntas relacionadas con:
   - Los servicios de MGA Tech Consulting (Automatización, Inteligencia Artificial, Data & BI, y Mentorías).
   - El perfil profesional, experiencia y portfolio de Mariano Gobea Alcoba.
   - El contenido del blog y recursos publicados en su sitio web.
   - Cómo agendar una reunión o contactar a Mariano.
2. Si el usuario pregunta cualquier otra cosa (clima, política, historia, programación en general no relacionada con los servicios, chistes, etc.), DEBES NEGARTE CORTÉSMENTE A RESPONDER.
   - Ejemplo de rechazo: "Lo siento, como asistente de MGA Tech Consulting solo estoy capacitado para responder sobre los servicios de automatización, IA y Data de Mariano, su portfolio o para ayudarte a agendar una reunión. ¿En qué te puedo asesorar sobre estos temas?"
3. OBJETIVO PRINCIPAL: Siempre que sea natural en la conversación, debes intentar persuadir sutilmente al usuario para que agende una reunión con Mariano para discutir su proyecto o necesidades.
4. Para ofrecer agendar una reunión DEBES usar EXACTAMENTE esta etiqueta al final de tu mensaje: [ACTION:CALENDLY]
   - Ejemplo de uso: "Me encantaría que hablemos sobre cómo automatizar tus procesos. Puedes agendar una llamada directa con Mariano aquí: [ACTION:CALENDLY]"
5. Habla siempre en primera persona del plural (nosotros) cuando hables de la consultora, o en tercera persona si hablas específicamente de la carrera de Mariano.
6. Tu tono debe ser: Profesional, tecnológico, resolutivo, claro y amable (tipo consultor B2B).
7. NUNCA inventes información. Si no sabes algo sobre la experiencia de Mariano o los servicios, di claramente que no tienes esa información y sugiere agendar una llamada para consultarlo directamente con él [ACTION:CALENDLY].

CONTEXTO SOBRE MARIANO GOBEA ALCOBA Y MGA TECH CONSULTING:
- Mariano es Data & Analytics Technical Leader en Mercado Libre, con más de 6 años de experiencia en el área.
- MGA Tech Consulting es una consultora orientada a PyMEs que quieren automatizar procesos, implementar Business Intelligence (BI) o adoptar IA sin un equipo técnico propio.
- Servicios ofrecidos: Automatización de Procesos (n8n, Zapier), Business Intelligence & Analytics, Transformación Digital con IA (RAG, agentes, fine-tuning).
- El sitio web tiene secciones de Portfolio (/portfolio), Blog (/blog), y Recursos Financieros (/recursos).`;

export function useAIAssistant() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!hasInitialized.current) {
            setMessages([
                { id: 'system-1', role: 'system', content: SYSTEM_PROMPT },
                { id: 'welcome-1', role: 'assistant', content: '¡Hola! Soy el asistente virtual de MGA Tech Consulting. ¿En qué puedo ayudarte hoy?' }
            ]);
            hasInitialized.current = true;
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            events.aiAssistantOpen();
        }
    }, [isOpen]);

    const toggleChat = useCallback(() => setIsOpen(prev => !prev), []);

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
            // Create message array for the API, excluding the welcome message if needed, or just keep it all.
            // Usually we pass system prompt + history
            const apiMessages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages.filter(m => m.role !== 'system' && m.id !== 'welcome-1').map(m => ({
                    role: m.role,
                    content: m.content
                })),
                { role: 'user', content: userMessage.content }
            ];

            // In Next.js static exports, NEXT_PUBLIC_ variables are replaced at build time.
            // Destructuring them directly helps the bundler trace the substitution.
            const rawApiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
            const apiKey = rawApiKey.replace(/"/g, '');
            const apiProxyUrl = process.env.NEXT_PUBLIC_AI_WEBHOOK_URL || '';
            const isProxyValid = apiProxyUrl.length > 0 && !apiProxyUrl.includes('tu-instancia.com');

            let responseContent = '';

            if (isProxyValid) {
                // Production mode using n8n webhook proxy
                const res = await fetch(apiProxyUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: apiMessages })
                });

                if (!res.ok) throw new Error('Network error from proxy');
                const data = await res.json();
                responseContent = data.content || data.output || data.message || 'Error en la respuesta del webhook.';

            } else if (apiKey) {
                // Dev mode using direct API
                const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'HTTP-Referer': 'https://www.mgatc.com',
                        'X-OpenRouter-Title': 'MGA Tech Consulting',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'z-ai/glm-4.5-air:free', // Model requested by user
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
                throw new Error('No API Key or Webhook URL configured. Please set NEXT_PUBLIC_OPENROUTER_API_KEY or NEXT_PUBLIC_AI_WEBHOOK_URL in your environment.');
            }

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseContent
            };

            setMessages(prev => [...prev, assistantMessage]);

        } catch (err) {
            console.error('Error sending message:', err);
            setError('Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.');
            // Add error message to chat
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Hubo un error de conexión al procesar tu solicitud. Asegúrate de que las credenciales de IA estén configuradas.'
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    return {
        messages: messages.filter(m => m.role !== 'system'), // Hide system messages from UI
        isLoading,
        isOpen,
        error,
        toggleChat,
        sendMessage,
        setIsOpen
    };
}
