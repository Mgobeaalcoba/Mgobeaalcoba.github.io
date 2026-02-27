'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, CalendarDays } from 'lucide-react';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { events } from '@/lib/gtag';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Calendly?: any;
    }
}

const CALENDLY_URL = 'https://calendly.com/mariano-gobea-mercadolibre/30min';

export function AIAssistant() {
    const { messages, isLoading, isOpen, error, toggleChat, sendMessage } = useAIAssistant();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleOpenCalendly = () => {
        events.aiAssistantCalendlyClick();
        if (typeof window !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Calendly = (window as any).Calendly;
            if (Calendly) {
                Calendly.initPopupWidget({ url: CALENDLY_URL });
            } else {
                window.open(CALENDLY_URL, '_blank');
            }
        }
    };

    const renderMessageContent = (content: string) => {
        const calendlyTag = '[ACTION:CALENDLY]';
        const hasCalendly = content.includes(calendlyTag);
        const cleanContent = content.replace(calendlyTag, '').trim();

        return (
            <div className="flex flex-col space-y-2">
                <p className="text-sm whitespace-pre-wrap">{cleanContent}</p>
                {hasCalendly && (
                    <button
                        onClick={handleOpenCalendly}
                        className="mt-2 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all"
                    >
                        <CalendarDays size={16} />
                        <span>Agendar Reunión</span>
                    </button>
                )}
            </div>
        );
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-24 right-6 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col z-50 overflow-hidden mt-16"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shrink-0 flex items-center justify-between shadow-md">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                    <Bot className="text-white w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-sm">MGA Tech Assistant</h3>
                                    <p className="text-blue-100 text-xs">Asistente IA de Mariano</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleChat}
                                className="text-white/80 hover:text-white p-1 rounded-md transition-colors hover:bg-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950/50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                            }`}
                                    >
                                        <div
                                            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user'
                                                ? 'ml-2 bg-gray-200 dark:bg-gray-800'
                                                : 'mr-2 bg-gradient-to-br from-blue-500 to-indigo-600'
                                                }`}
                                        >
                                            {msg.role === 'user' ? (
                                                <User size={14} className="text-gray-600 dark:text-gray-300" />
                                            ) : (
                                                <Bot size={14} className="text-white" />
                                            )}
                                        </div>
                                        <div
                                            className={`p-3 rounded-2xl ${msg.role === 'user'
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm rounded-tl-none'
                                                }`}
                                        >
                                            {msg.role === 'user' ? (
                                                <p className="text-sm">{msg.content}</p>
                                            ) : (
                                                renderMessageContent(msg.content)
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex flex-row max-w-[85%]">
                                        <div className="shrink-0 w-8 h-8 mr-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                            <Bot size={14} className="text-white" />
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-tl-none flex space-x-1 items-center">
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                className="w-2 h-2 bg-gray-400 rounded-full"
                                            />
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                className="w-2 h-2 bg-gray-400 rounded-full"
                                            />
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                className="w-2 h-2 bg-gray-400 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div className="text-center mt-2">
                                    <p className="text-xs text-red-500">{error}</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shrink-0">
                            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Mensaje a MGA Assistant..."
                                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="p-2.5 rounded-full bg-blue-600 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex flex-col justify-center items-center"
                                >
                                    <Send size={16} className="-ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button (Siri Orb) */}
            <button
                onClick={toggleChat}
                className="fixed top-24 right-6 z-50 w-14 h-14 rounded-full shadow-lg group focus:outline-none mt-2"
                aria-label="Toggle AI Assistant"
            >
                <motion.div
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-indigo-500 to-purple-600 blur-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center border border-white/10 z-10">
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" size={24} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="bot"
                                initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                                transition={{ duration: 0.2 }}
                                className="relative"
                            >
                                <Bot className="text-blue-300 drop-shadow-[0_0_12px_rgba(147,197,253,0.8)]" size={26} />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-blue-400 rounded-full blur-xl -z-10"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </button>
        </>
    );
}
