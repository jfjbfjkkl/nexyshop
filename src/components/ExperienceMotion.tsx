"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ExperienceMotion() {
  const pathname = usePathname();
  const [motionKey, setMotionKey] = useState(0);

  useEffect(() => {
    setMotionKey((key) => key + 1);
  }, [pathname]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const control = target.closest<HTMLButtonElement | HTMLAnchorElement>(
        "button:not(:disabled), a[href], [role='button']",
      );

      if (!control) return;

      control.classList.remove("is-tapping");
      window.requestAnimationFrame(() => control.classList.add("is-tapping"));
      window.setTimeout(() => control.classList.remove("is-tapping"), 320);
    };

    document.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div className="experience-route-motion" aria-hidden="true" key={motionKey}>
      <span />
      <i />
    </div>
  );
}
