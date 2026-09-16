"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, MessageSquareText, Mic, MicOff } from "lucide-react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { events } from "@/lib/gtag";
import { useLanguage } from "@/contexts/LanguageContext";
import { openContactModal } from "@/components/shared/ContactModal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function AIAssistant() {
  const {
    messages,
    isLoading,
    isOpen,
    error,
    user,
    sendMessage,
    identifyUser,
    setIsOpen,
  } = useAIAssistant();
  const { lang } = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [formError, setFormError] = useState("");
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identityFormStarted, setIdentityFormStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isListening, setIsListening] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setHasSpeechSupport(true);
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = lang === "en" ? "en-US" : "es-ES";

        rec.onstart = () => {
          setIsListening(true);
        };
        rec.onend = () => {
          setIsListening(false);
        };
        rec.onerror = () => {
          events.appError("ai_assistant", "speech_recognition", "recognition_error", true, "cv");
          setIsListening(false);
        };
        rec.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          if (text) {
            setInputValue((prev) => (prev ? prev + " " + text : text));
          }
        };

        recognitionRef.current = rec;
      }
    }
  }, [lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch {
        events.appError("ai_assistant", "speech_recognition_start", "start_error", true, "cv");
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen || user) return;
    events.aiAssistantFormView();
    events.formView("ai_assistant_identity", "cv");
  }, [isOpen, user]);

  const markIdentityFormStarted = () => {
    if (identityFormStarted) return;
    setIdentityFormStarted(true);
    events.formStart("ai_assistant_identity", "cv");
  };

  const openAssistant = useCallback(() => {
    if (isOpen) return;
    if (window.history.state?.mgaLayer !== "assistant") {
      window.history.pushState(
        { ...window.history.state, mgaLayer: "assistant" },
        "",
        window.location.href
      );
    }
    setIsOpen(true);
  }, [isOpen, setIsOpen]);

  const closeAssistant = useCallback((method = "button") => {
    events.uiLayerClose("assistant", method, "assistant");
    setIsOpen(false);
    if (window.history.state?.mgaLayer === "assistant") {
      window.history.back();
    }
  }, [setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onPopState = () => {
      if (window.history.state?.mgaLayer !== "assistant") {
        events.uiLayerClose("assistant", "browser_back", "assistant");
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAssistant("escape");
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeAssistant, setIsOpen]);

  // Global event listener to open assistant from other components
  useEffect(() => {
    const handleOpen = () => {
      openAssistant();
    };
    window.addEventListener("open-ai-assistant", handleOpen);
    return () => window.removeEventListener("open-ai-assistant", handleOpen);
  }, [openAssistant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.email.trim()) {
      events.formValidationError("ai_assistant_identity", "required_fields", "required", "cv");
      setFormError(
        lang === "en"
          ? "Please fill all fields"
          : "Por favor, completa todos los campos"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      events.formValidationError("ai_assistant_identity", "email", "invalid", "cv");
      setFormError(
        lang === "en"
          ? "Please enter a valid email"
          : "Por favor, ingresa un email válido"
      );
      return;
    }

    events.formSubmitAttempt("ai_assistant_identity", "cv");
    setIsIdentifying(true);
    try {
      await identifyUser({ name: formData.name.trim(), email: formData.email.trim() });
    } catch {
      events.leadDelivery("error", "ai_assistant", "ai_assistant_identity");
      setFormError(
        lang === "en"
          ? "We couldn't register your details. Please try again."
          : "No pudimos registrar tus datos. Por favor, intentá nuevamente."
      );
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleOpenContact = () => {
    events.aiAssistantContactClick();
    openContactModal("ai_assistant");
  };

  const renderMessageContent = (content: string) => {
    const contactTagRegex = /\[ACTION:CONTACT\]/g;
    const hasContact = contactTagRegex.test(content);
    const cleanContent = content.replace(contactTagRegex, "").trim();

    return (
      <div className="flex flex-col space-y-2">
        <div className="text-sm prose dark:prose-invert prose-p:leading-relaxed prose-pre:bg-gray-800/50 prose-pre:text-gray-100 prose-pre:whitespace-pre-wrap break-words max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {cleanContent}
          </ReactMarkdown>
        </div>
        {hasContact && (
          <button
            onClick={handleOpenContact}
            className="mt-2 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all"
          >
            <MessageSquareText size={16} />
            <span>
              {lang === "en" ? "Contact Mariano" : "Contactar a Mariano"}
            </span>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="signal-assistant-scrim fixed inset-0 z-[75] bg-black/[0.03]"
            onClick={() => closeAssistant("outside")}
          >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="signal-assistant-panel fixed bottom-20 right-4 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100dvh-6rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col z-[80] overflow-hidden sm:right-5"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shrink-0 flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                  <Bot className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">
                    MGA Tech Assistant
                  </h3>
                  <p className="text-blue-100 text-xs">
                    {lang === "en"
                      ? "Mariano's AI Assistant"
                      : "Asistente IA de Mariano"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => closeAssistant("button")}
                className="text-white/80 hover:text-white p-1 rounded-md transition-colors hover:bg-white/10"
                aria-label={lang === "en" ? "Close assistant" : "Cerrar asistente"}
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950/50 flex flex-col">
              {!user ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col justify-center py-4"
                >
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h4 className="text-gray-800 dark:text-gray-100 font-semibold mb-2 text-center">
                      {lang === "en" ? "Welcome!" : "¡Bienvenido!"}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-6 text-center leading-relaxed">
                      {lang === "en"
                        ? "Tell us who you are to start. Your details help us follow up on your inquiry."
                        : "Contanos quién sos para comenzar. Tus datos nos permiten registrar y dar seguimiento a tu consulta."}
                    </p>

                    <form
                      onSubmit={handleIdentify}
                      onInvalid={(event) => {
                        const field = (event.target as HTMLInputElement).name || "unknown";
                        events.formValidationError("ai_assistant_identity", field, "invalid", "cv");
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-1 ml-1">
                          {lang === "en" ? "Full Name" : "Nombre Completo"}
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          maxLength={120}
                          onFocus={markIdentityFormStarted}
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder={
                            lang === "en" ? "John Doe" : "Tu nombre..."
                          }
                          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-1 ml-1">
                          {lang === "en"
                            ? "Email Address"
                            : "Correo Electrónico"}
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          maxLength={254}
                          onFocus={markIdentityFormStarted}
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="email@example.com"
                          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 transition-all"
                        />
                      </div>

                      {formError && (
                        <p className="text-[10px] text-red-500 text-center animate-pulse">
                          {formError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isIdentifying}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] mt-2 disabled:cursor-wait disabled:opacity-70"
                      >
                        {isIdentifying
                          ? (lang === "en" ? "Registering..." : "Registrando...")
                          : lang === "en"
                          ? "Continue to the assistant"
                          : "Ingresar al asistente"}
                      </button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[85%] ${
                          msg.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            msg.role === "user"
                              ? "ml-2 bg-gray-200 dark:bg-gray-800"
                              : "mr-2 bg-gradient-to-br from-blue-500 to-indigo-600"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <User
                              size={14}
                              className="text-gray-600 dark:text-gray-300"
                            />
                          ) : (
                            <Bot size={14} className="text-white" />
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-2xl ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm rounded-tl-none"
                          }`}
                        >
                          {msg.role === "user" ? (
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
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: 0,
                            }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: 0.2,
                            }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: 0.4,
                            }}
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
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className={`p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shrink-0 transition-opacity duration-300 ${!user ? "opacity-30 pointer-events-none grayscale" : "opacity-100"}`}
            >
              <form
                onSubmit={handleSubmit}
                className="flex items-center space-x-2"
              >
                {isListening ? (
                  <div className="flex-1 bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/50 text-sm rounded-full py-2.5 px-4 flex items-center justify-between">
                    <span className="text-sky-500 dark:text-sky-400 animate-pulse font-medium text-xs">
                      {lang === "en" ? "Listening..." : "Escuchando..."}
                    </span>
                    <div className="voice-wave shrink-0">
                      <div className="voice-bar" />
                      <div className="voice-bar" />
                      <div className="voice-bar" />
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    maxLength={4000}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      lang === "en"
                        ? "Message MGA Assistant..."
                        : "Mensaje a MGA Assistant..."
                    }
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    disabled={isLoading}
                  />
                )}
                {hasSpeechSupport && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-2.5 rounded-full transition-all flex flex-col justify-center items-center ${
                      isListening
                        ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                    title={lang === "en" ? "Voice Input" : "Entrada de voz"}
                    aria-label={lang === "en" ? "Voice input" : "Entrada de voz"}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2.5 rounded-full bg-blue-600 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex flex-col justify-center items-center"
                  aria-label={lang === "en" ? "Send message" : "Enviar mensaje"}
                >
                  <Send size={16} className="-ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact assistant trigger — intentionally avoids covering page content. */}
      <button
        onClick={isOpen ? () => closeAssistant("trigger") : openAssistant}
        className={`signal-assistant-trigger ${isOpen ? "is-open" : ""}`}
        aria-label={isOpen
          ? (lang === "en" ? "Close MGA assistant" : "Cerrar asistente MGA")
          : (lang === "en" ? "Open MGA assistant" : "Abrir asistente MGA")}
      >
        <span className="signal-assistant-trigger__icon">{isOpen ? <X size={17} /> : <Bot size={17} />}</span>
        <span>{lang === "en" ? "Ask MGA" : "Preguntá a MGA"}</span>
      </button>
    </>
  );
}
