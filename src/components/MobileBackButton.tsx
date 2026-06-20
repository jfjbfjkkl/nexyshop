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
    window.setTimeout(() => {
      if (window.history.length > 1) {
        router.back();
        return;
      }

      router.push("/");
    }, 170);
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
