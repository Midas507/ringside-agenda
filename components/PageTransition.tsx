"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      // Nouveau pathname : la page a déjà changé, on fait le fade in
      previousPathname.current = pathname;
      setVisible(false);
      // Force un repaint puis fade in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    }
  }, [pathname]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(15px)",
        transition: "opacity 350ms ease-out, transform 350ms ease-out",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
