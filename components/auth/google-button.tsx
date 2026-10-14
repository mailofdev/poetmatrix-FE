"use client";

import { useEffect, useRef } from "react";
import { googleAction } from "@/lib/auth/actions";

type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential: string }) => void;
      }) => void;
      renderButton: (element: HTMLElement, options: { theme: string; size: string }) => void;
    };
  };
};

export function GoogleButton({ next }: { next?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !host.current) {
      return;
    }
    const target = host.current;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      const google = (window as Window & { google?: GoogleIdentity }).google;
      if (!google) {
        return;
      }
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          void googleAction(response.credential, next);
        },
      });
      google.accounts.id.renderButton(target, { theme: "outline", size: "large" });
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [clientId, next]);

  if (!clientId) {
    return null;
  }
  return <div ref={host} />;
}
