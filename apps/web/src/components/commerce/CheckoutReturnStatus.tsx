"use client";

import { useEffect, useState } from "react";
import { events } from "@/lib/gtag";
import { getOffer, type OfferSlug } from "@/lib/offers";
import OnboardingCTA from "./OnboardingCTA";

type CheckoutStatus = "approved" | "pending" | "rejected" | "unknown";

function parseStatus(value: string | null): CheckoutStatus {
  if (value === "approved") return "approved";
  if (value === "pending" || value === "in_process" || value === "in_mediation") return "pending";
  if (value === "rejected" || value === "cancelled" || value === "refunded" || value === "charged_back") return "rejected";
  return "unknown";
}

function parseOffer(value: string | null): OfferSlug | "unknown" {
  return value && getOffer(value) ? (value as OfferSlug) : "unknown";
}

export default function CheckoutReturnStatus() {
  const [status, setStatus] = useState<CheckoutStatus>("unknown");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextStatus = parseStatus(params.get("status") ?? params.get("collection_status"));
    const offer = parseOffer(params.get("external_reference"));
    const dedupeKey = `mga_checkout_return:${nextStatus}:${offer}`;

    setStatus(nextStatus);
    setReady(true);
    if (sessionStorage.getItem(dedupeKey) !== "1") {
      sessionStorage.setItem(dedupeKey, "1");
      events.checkoutReturn(nextStatus, offer);
    }
  }, []);

  if (!ready) return <div className="signal-checkout-status" aria-live="polite">Verificando el estado informado…</div>;

  const copy = {
    approved: "Mercado Pago informó que el pago fue aprobado. La acreditación definitiva se valida del lado del servidor.",
    pending: "El pago figura pendiente. Esperá la confirmación de Mercado Pago antes de considerarlo acreditado.",
    rejected: "El pago no fue aprobado. Podés volver a servicios para intentar nuevamente o contactarme.",
    unknown: "No recibimos un estado verificable en esta vuelta. Si ya pagaste, completá el onboarding con el comprobante para revisarlo.",
  }[status];

  return (
    <div className="space-y-5" aria-live="polite">
      <p className="text-gray-300">{copy}</p>
      {(status === "approved" || status === "unknown") && <OnboardingCTA />}
    </div>
  );
}
