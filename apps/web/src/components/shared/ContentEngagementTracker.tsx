"use client";

import { useEffect } from "react";
import { events } from "@/lib/gtag";

interface ContentEngagementTrackerProps {
  contentType: "article" | "special_report" | "methodology";
  contentId: string;
  title?: string;
}

function currentScrollPercent(): number {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((window.scrollY / scrollable) * 100)));
}

export default function ContentEngagementTracker({
  contentType,
  contentId,
  title,
}: ContentEngagementTrackerProps) {
  useEffect(() => {
    let activeSeconds = 0;
    let maxScroll = currentScrollPercent();
    const key = `${contentType}:${contentId}`;
    const engagedKey = `mga_content_engaged:${key}`;
    const completedKey = `mga_content_complete:${key}`;

    const alreadyEngaged = sessionStorage.getItem(engagedKey) === "1";
    const alreadyCompleted = sessionStorage.getItem(completedKey) === "1";
    let engagedSent = alreadyEngaged;
    let completeSent = alreadyCompleted;

    const evaluate = () => {
      if (!engagedSent && activeSeconds >= 30 && maxScroll >= 50) {
        engagedSent = true;
        sessionStorage.setItem(engagedKey, "1");
        events.contentEngaged(contentType, contentId, activeSeconds, maxScroll);
        if (contentType === "article" && title) {
          events.blogPostRead(contentId, title);
        }
      }

      if (!completeSent && maxScroll >= 90) {
        completeSent = true;
        sessionStorage.setItem(completedKey, "1");
        events.contentComplete(contentType, contentId, maxScroll);
      }
    };

    const onScroll = () => {
      maxScroll = Math.max(maxScroll, currentScrollPercent());
      evaluate();
    };

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible" && document.hasFocus()) {
        activeSeconds += 1;
        evaluate();
      }
    }, 1_000);

    window.addEventListener("scroll", onScroll, { passive: true });
    evaluate();

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [contentId, contentType, title]);

  return null;
}
