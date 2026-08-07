"use client";

import { useCallback } from "react";
import { events } from "@/lib/gtag";
import { openContactModal } from "./ContactModal";

interface ContactButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  /** Analytics source label, defaults to "cv" */
  source?: string;
  /** Optional prefill for the message textarea */
  prefillMessage?: string;
}

export default function ContactButton({
  className,
  children,
  onClick,
  source = "cv",
  prefillMessage,
}: ContactButtonProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      events.contactClick(source);
      onClick?.();
      openContactModal(source, prefillMessage);
    },
    [onClick, source, prefillMessage]
  );

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
