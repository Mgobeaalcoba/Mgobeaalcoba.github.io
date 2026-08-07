-- Migration 010: Remove Calendly columns from cv_meta and cv_consulting_meta
--
-- Context:
--   Calendly was replaced site-wide by a contact form that routes messages to
--   WhatsApp or email. The URL fields are no longer referenced by the frontend
--   and are safe to drop.
--
-- Applied on: 2026-04-17

ALTER TABLE public.cv_meta
  DROP COLUMN IF EXISTS calendly;

ALTER TABLE public.cv_consulting_meta
  DROP COLUMN IF EXISTS calendly_url;
