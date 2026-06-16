"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageSquare, Mail, Loader2, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { events } from "@/lib/gtag";

export const CONTACT_MODAL_EVENT = "open-contact-modal";

const CONTACT_EMAIL = "mariano@mgatc.com";
const CONTACT_PHONE_E164 = "5491127475569"; // wa.me format (no +)
const CONTACT_PHONE_DISPLAY = "+54 9 11 2747 5569";

const WEBHOOK_URL =
  "https://mgobeaalcoba.app.n8n.cloud/webhook/contacto-webhook";

type Channel = "whatsapp" | "email";

interface ContactModalEventDetail {
  source?: string;
  prefillMessage?: string;
}

export default function ContactModal() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<string>("cv");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState<Channel | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const reset = useCallback(() => {
    setForm({ name: "", email: "", message: "" });
    setSubmitted(false);
    setSending(null);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(reset, 300);
  }, [reset]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ContactModalEventDetail>).detail;
      setSource(detail?.source ?? "cv");
      if (detail?.prefillMessage) {
        setForm((prev) => ({ ...prev, message: detail.prefillMessage! }));
      }
      setOpen(true);
      events.contactModalOpen(detail?.source ?? "cv");
    };
    window.addEventListener(CONTACT_MODAL_EVENT, handler as EventListener);
    return () =>
      window.removeEventListener(CONTACT_MODAL_EVENT, handler as EventListener);
  }, []);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const postToWebhook = async (channel: Channel) => {
    // Fire-and-forget; don't block on errors
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          channel,
          source,
          form_type: "contact_modal",
          page:
            typeof window !== "undefined" ? window.location.pathname : "/",
          timestamp: new Date().toISOString(),
          userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : "",
          language:
            typeof document !== "undefined"
              ? document.documentElement.lang
              : "es",
        }),
        signal: AbortSignal.timeout(8000),
      });
    } catch {
      // Silent — we still open the channel app
    }
  };

  const openWhatsApp = async () => {
    if (sending) return;
    if (!form.message.trim()) return;
    setSending("whatsapp");
    events.contactChannelSelect("whatsapp", source);
    events.leadFormSent(source, "contact_modal");
    await postToWebhook("whatsapp");
    const greeting = form.name.trim()
      ? `Hola Mariano, soy ${form.name.trim()}.`
      : "Hola Mariano,";
    const text = encodeURIComponent(`${greeting} ${form.message.trim()}`);
    const url = `https://wa.me/${CONTACT_PHONE_E164}?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    setSending(null);
  };

  const openEmail = async () => {
    if (sending) return;
    if (!form.message.trim()) return;
    setSending("email");
    events.contactChannelSelect("email", source);
    events.leadFormSent(source, "contact_modal");
    await postToWebhook("email");
    const subject = encodeURIComponent(
      lang === "es"
        ? "Contacto desde mgatc.com"
        : "Contact from mgatc.com"
    );
    const bodyLines = [
      form.name.trim() ? `${lang === "es" ? "Nombre" : "Name"}: ${form.name.trim()}` : null,
      form.email.trim() ? `Email: ${form.email.trim()}` : null,
      "",
      form.message.trim(),
    ].filter(Boolean);
    const body = encodeURIComponent(bodyLines.join("\n"));
    const url = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    window.location.href = url;
    setSubmitted(true);
    setSending(null);
  };

  const t = (es: string, en: string) => (lang === "es" ? es : en);
  const messageValid = form.message.trim().length > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={close}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative glass rounded-2xl p-6 sm:p-7 w-full max-w-lg max-h-[92vh] overflow-y-auto border border-white/10"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t("Formulario de contacto", "Contact form")}
          >
            <button
              onClick={close}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              aria-label={t("Cerrar", "Close")}
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-8 gap-3">
                <div className="text-5xl">✅</div>
                <p className="text-gray-100 font-semibold text-lg">
                  {t("¡Gracias por contactarme!", "Thanks for reaching out!")}
                </p>
                <p className="text-gray-400 text-sm max-w-xs">
                  {t(
                    "Abrí tu app para enviar el mensaje. Te respondo en menos de 24hs.",
                    "Your app should open to send the message. I'll reply within 24h."
                  )}
                </p>
                <button
                  onClick={close}
                  className="mt-2 px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium text-sm transition-colors"
                >
                  {t("Cerrar", "Close")}
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-100 mb-1">
                  {t("Contactame", "Contact me")}
                </h3>
                <p className="text-gray-400 text-sm mb-5">
                  {t(
                    "Escribí tu mensaje y elegí por dónde preferís enviarlo. Te respondo en menos de 24hs.",
                    "Write your message and choose how to send it. I'll reply within 24h."
                  )}
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">
                      {t("Tu nombre", "Your name")}{" "}
                      <span className="text-gray-600">
                        ({t("opcional", "optional")})
                      </span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder={t("Ej: Juan Pérez", "e.g. John Doe")}
                      disabled={!!sending}
                      className="w-full glass px-4 py-2.5 rounded-lg text-sm text-gray-200 border border-white/10 focus:border-sky-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">
                      {t("Tu email", "Your email")}{" "}
                      <span className="text-gray-600">
                        ({t("para responder", "to reply")})
                      </span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder={t("Ej: juan@ejemplo.com", "e.g. john@example.com")}
                      disabled={!!sending}
                      className="w-full glass px-4 py-2.5 rounded-lg text-sm text-gray-200 border border-white/10 focus:border-sky-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">
                      {t("Mensaje", "Message")} <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      rows={4}
                      placeholder={t(
                        "Contame brevemente qué necesitás o sobre qué querés charlar...",
                        "Briefly tell me what you need or what you'd like to chat about..."
                      )}
                      disabled={!!sending}
                      className="w-full glass px-4 py-2.5 rounded-lg text-sm text-gray-200 border border-white/10 focus:border-sky-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  <button
                    type="button"
                    onClick={openWhatsApp}
                    disabled={!messageValid || !!sending}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending === "whatsapp" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <MessageSquare size={16} />
                    )}
                    {t("Enviar por WhatsApp", "Send via WhatsApp")}
                  </button>
                  <button
                    type="button"
                    onClick={openEmail}
                    disabled={!messageValid || !!sending}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending === "email" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Mail size={16} />
                    )}
                    {t("Enviar por Email", "Send via Email")}
                  </button>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10">
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">
                    {t("O contactame directo", "Or reach me directly")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 text-xs text-gray-400">
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="flex items-center gap-2 hover:text-sky-400 transition-colors"
                    >
                      <Mail size={14} />
                      {CONTACT_EMAIL}
                    </a>
                    <span className="hidden sm:inline text-gray-700">·</span>
                    <a
                      href={`tel:+${CONTACT_PHONE_E164}`}
                      className="flex items-center gap-2 hover:text-green-400 transition-colors"
                    >
                      <Phone size={14} />
                      {CONTACT_PHONE_DISPLAY}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-5 text-[11px] text-gray-600">
                  <Send size={11} />
                  {t(
                    "Tu mensaje se registra para hacer seguimiento.",
                    "Your message is logged so I can follow up."
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Dispatch this to open the modal from anywhere */
export function openContactModal(source = "cv", prefillMessage?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ContactModalEventDetail>(CONTACT_MODAL_EVENT, {
      detail: { source, prefillMessage },
    })
  );
}
