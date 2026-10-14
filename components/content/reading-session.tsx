"use client";

import { useEffect } from "react";
import { progressAction, viewAction } from "@/lib/product/actions";

export function ReadingSession({
  id,
  signedIn,
  initialScroll = 0,
}: {
  id: string;
  signedIn: boolean;
  initialScroll?: number;
}) {
  useEffect(() => {
    if (!signedIn) {
      return;
    }
    void viewAction(id);
    const article = document.getElementById("piece-body");
    if (article && initialScroll > 0) {
      window.scrollTo(0, initialScroll);
    }
    const onScroll = () => {
      const height = document.body.scrollHeight - window.innerHeight;
      const percent = height <= 0 ? 100 : Math.round((window.scrollY / height) * 100);
      sessionStorage.setItem(`pm-scroll-${id}`, String(window.scrollY));
      void progressAction(id, Math.min(100, Math.max(0, percent)), window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [id, initialScroll, signedIn]);
  return null;
}
