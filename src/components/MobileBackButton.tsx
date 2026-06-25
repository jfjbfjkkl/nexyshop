"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function MobileBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [clicking, setClicking] = useState(false);

  if (pathname === "/") return null;

  const goBack = () => {
    if (clicking) return;

    setClicking(true);
    const historyIndex = window.history.state && typeof window.history.state.idx === "number" ? window.history.state.idx : 0;

    if (historyIndex > 0 || document.referrer) {
      router.back();
    } else {
      router.push("/");
    }

    window.setTimeout(() => setClicking(false), 320);
  };

  return (
    <button
      className={`mobile-back-return ${clicking ? "is-clicking" : ""}`}
      type="button"
      aria-label="Retourner à la page précédente"
      onClick={goBack}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 6 9 12l6 6" />
      </svg>
    </button>
  );
}
