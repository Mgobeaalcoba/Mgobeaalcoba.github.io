"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  ArrowUpRight,
  MessageSquareText,
  Mic,
  MicOff,
} from "lucide-react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { events } from "@/lib/gtag";
import { useLanguage } from "@/contexts/LanguageContext";
import { openContactModal } from "@/components/shared/ContactModal";
import Link from "next/link";
import Brand from "@/components/shared/Brand";
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
  const messagesViewportRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
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
          events.appError(
            "ai_assistant",
            "speech_recognition",
            "recognition_error",
            true,
            "cv"
          );
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
        events.appError(
          "ai_assistant",
          "speech_recognition_start",
          "start_error",
          true,
          "cv"
        );
      }
    }
  };

  const scrollToBottom = () => {
    const viewport = messagesViewportRef.current;
    viewport?.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && user) {
      scrollToBottom();
    }
  }, [messages, isOpen, user]);

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
    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    if (window.history.state?.mgaLayer !== "assistant") {
      window.history.pushState(
        { ...window.history.state, mgaLayer: "assistant" },
        "",
        window.location.href
      );
    }
    setIsOpen(true);
  }, [isOpen, setIsOpen]);

  const closeAssistant = useCallback(
    (method = "button") => {
      events.uiLayerClose("assistant", method, "assistant");
      setIsOpen(false);
      if (window.history.state?.mgaLayer === "assistant") {
        window.history.back();
      }
    },
    [setIsOpen]
  );

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

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current
      ?.querySelector<HTMLInputElement>("input:not(:disabled)")
      ?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      recognitionRef.current?.stop();
    };
  }, [isOpen]);

  const keepFocusInPanel = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const controls = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled), [tabindex="0"]'
      ) ?? []
    );
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

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
      events.formValidationError(
        "ai_assistant_identity",
        "required_fields",
        "required",
        "cv"
      );
      setFormError(
        lang === "en"
          ? "Please fill all fields"
          : "Por favor, completa todos los campos"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      events.formValidationError(
        "ai_assistant_identity",
        "email",
        "invalid",
        "cv"
      );
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
      await identifyUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
      });
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
      <div className="mga-chat__content">
        <div className="mga-chat__prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {cleanContent}
          </ReactMarkdown>
        </div>
        {hasContact && (
          <button onClick={handleOpenContact} className="mga-chat__contact">
            <MessageSquareText size={16} />
            <span>
              {lang === "en" ? "Contact our team" : "Contactar al equipo"}
            </span>
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <AnimatePresence
        onExitComplete={() => {
          if (
            openerRef.current?.isConnected &&
            openerRef.current.getClientRects().length
          )
            openerRef.current.focus();
          else if (window.matchMedia("(max-width: 820px)").matches)
            document
              .querySelector<HTMLButtonElement>(
                '.mga-mobile-bar button[aria-controls="mga-mobile-explore"]'
              )
              ?.focus();
          else triggerRef.current?.focus();
        }}
      >
        {isOpen && (
          <motion.div
            className="mga-chat-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeAssistant("outside")}
          >
            <motion.div
              id="mga-assistant-dialog"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mga-chat-title"
              className="mga-chat"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={keepFocusInPanel}
            >
              <header className="mga-chat__header">
                <div className="mga-chat__heading">
                  <Brand compact />
                  <span>
                    {lang === "en" ? "AI assistant" : "Asistente de IA"}
                  </span>
                </div>
                <h2 id="mga-chat-title" className="sr-only">
                  {lang === "en" ? "MGA assistant" : "Asistente de MGA"}
                </h2>
                <button
                  className="mga-chat__icon-button"
                  type="button"
                  onClick={() => closeAssistant("button")}
                  aria-label={
                    lang === "en" ? "Close assistant" : "Cerrar asistente"
                  }
                >
                  <X size={19} />
                </button>
              </header>

              <div
                ref={messagesViewportRef}
                className={`mga-chat__body${!user ? " mga-chat__body--intro" : ""}`}
              >
                {!user ? (
                  <div className="mga-chat__intro">
                    <span className="mga-kicker">
                      01 /{" "}
                      {lang === "en"
                        ? "Let's start here"
                        : "Antes de conversar"}
                    </span>
                    <h3>
                      {lang === "en"
                        ? "Let's find your next step."
                        : "Pensemos tu próximo paso."}
                    </h3>
                    <p>
                      {lang === "en"
                        ? "Questions about services, projects or technology? Tell us who you are so we can follow up on your inquiry."
                        : "¿Tenés una consulta sobre servicios, proyectos o tecnología? Contanos quién sos para darle seguimiento."}
                    </p>
                    <form
                      className="mga-chat__identity-form"
                      onSubmit={handleIdentify}
                      onInvalid={(event) => {
                        const field =
                          (event.target as HTMLInputElement).name || "unknown";
                        events.formValidationError(
                          "ai_assistant_identity",
                          field,
                          "invalid",
                          "cv"
                        );
                      }}
                    >
                      <div>
                        <label htmlFor="mga-chat-name">
                          {lang === "en" ? "Your name" : "Tu nombre"}
                        </label>
                        <input
                          id="mga-chat-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          maxLength={120}
                          disabled={isIdentifying}
                          onFocus={markIdentityFormStarted}
                          value={formData.name}
                          onChange={(event) =>
                            setFormData((previous) => ({
                              ...previous,
                              name: event.target.value,
                            }))
                          }
                          placeholder={
                            lang === "en"
                              ? "First and last name"
                              : "Nombre y apellido"
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="mga-chat-email">
                          {lang === "en" ? "Your email" : "Tu email"}
                        </label>
                        <input
                          id="mga-chat-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          maxLength={254}
                          disabled={isIdentifying}
                          onFocus={markIdentityFormStarted}
                          value={formData.email}
                          onChange={(event) =>
                            setFormData((previous) => ({
                              ...previous,
                              email: event.target.value,
                            }))
                          }
                          placeholder={
                            lang === "en"
                              ? "name@company.com"
                              : "nombre@empresa.com"
                          }
                        />
                      </div>
                      {formError && (
                        <p className="mga-chat__error" role="alert">
                          {formError}
                        </p>
                      )}
                      <button
                        type="submit"
                        className="mga-chat__primary"
                        disabled={isIdentifying}
                      >
                        {isIdentifying
                          ? lang === "en"
                            ? "Starting…"
                            : "Iniciando…"
                          : lang === "en"
                            ? "Start a conversation"
                            : "Empezar a conversar"}
                        <ArrowUpRight size={18} />
                      </button>
                      <p className="mga-chat__privacy">
                        {lang === "en"
                          ? "Your details are used to register and follow up on this inquiry."
                          : "Usamos tus datos para registrar y dar seguimiento a esta consulta."}{" "}
                        <Link href="/privacidad/">
                          {lang === "en" ? "Privacy" : "Privacidad"} ↗
                        </Link>
                      </p>
                    </form>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mga-chat__message${message.role === "user" ? " mga-chat__message--user" : ""}`}
                      >
                        <span className="mga-chat__message-label">
                          {message.role === "user"
                            ? lang === "en"
                              ? "You"
                              : "Vos"
                            : "MGA"}
                        </span>
                        <div className="mga-chat__message-body">
                          {message.role === "user" ? (
                            <p>{message.content}</p>
                          ) : (
                            renderMessageContent(message.content)
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="mga-chat__loading" role="status">
                        <span />
                        <span />
                        <span />
                        <span className="sr-only">
                          {lang === "en"
                            ? "Preparing a reply"
                            : "Preparando una respuesta"}
                        </span>
                      </div>
                    )}
                    {error && (
                      <p className="mga-chat__error" role="alert">
                        {error}
                      </p>
                    )}
                  </>
                )}
              </div>

              {user ? (
                <div className="mga-chat__composer">
                  <form onSubmit={handleSubmit}>
                    {isListening ? (
                      <div className="mga-chat__listening" role="status">
                        {lang === "en" ? "Listening…" : "Escuchando…"}
                        <span className="voice-wave">
                          <span className="voice-bar" />
                          <span className="voice-bar" />
                          <span className="voice-bar" />
                        </span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        maxLength={4000}
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        aria-label={
                          lang === "en" ? "Your message" : "Tu mensaje"
                        }
                        placeholder={
                          lang === "en"
                            ? "Write your question…"
                            : "Escribí tu consulta…"
                        }
                        disabled={isLoading}
                      />
                    )}
                    {hasSpeechSupport && (
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={`mga-chat__icon-button${isListening ? " is-listening" : ""}`}
                        aria-label={
                          lang === "en" ? "Voice input" : "Entrada de voz"
                        }
                        aria-pressed={isListening}
                      >
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                      </button>
                    )}
                    <button
                      type="submit"
                      className="mga-chat__send"
                      disabled={!inputValue.trim() || isLoading}
                      aria-label={
                        lang === "en" ? "Send message" : "Enviar mensaje"
                      }
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="mga-chat__footer-note">
                  MGA /{" "}
                  {lang === "en"
                    ? "Applied technology studio"
                    : "Estudio de tecnología aplicada"}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={triggerRef}
        onClick={isOpen ? () => closeAssistant("trigger") : openAssistant}
        className={`signal-assistant-trigger ${isOpen ? "is-open" : ""}`}
        aria-expanded={isOpen}
        aria-controls="mga-assistant-dialog"
        aria-label={
          isOpen
            ? lang === "en"
              ? "Close MGA assistant"
              : "Cerrar asistente MGA"
            : lang === "en"
              ? "Open MGA assistant"
              : "Abrir asistente MGA"
        }
      >
        <span className="signal-assistant-trigger__icon">
          {isOpen ? <X size={17} /> : <MessageSquareText size={17} />}
        </span>
        <span>{lang === "en" ? "Ask MGA" : "Preguntá a MGA"}</span>
      </button>
    </>
  );
}
