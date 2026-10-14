"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function RefreshSession() {
  const router = useRouter();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) {
      return;
    }
    started.current = true;
    const key = "pm-refresh-once";
    if (sessionStorage.getItem(key) === "1") {
      sessionStorage.removeItem(key);
      router.replace("/login");
      return;
    }
    sessionStorage.setItem(key, "1");
    void fetch("/api/auth/refresh", { method: "POST" }).then((response) => {
      if (response.ok) {
        sessionStorage.removeItem(key);
        router.refresh();
        return;
      }
      sessionStorage.removeItem(key);
      router.replace("/login");
    });
  }, [router]);

  return (
    <p role="status" className="text-sm text-zinc-600 dark:text-zinc-400">
      Restoring your session…
    </p>
  );
}
