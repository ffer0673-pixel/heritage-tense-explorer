import { useEffect } from "react";

export function ThemeApplier() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.add("dark");
  }, []);
  return null;
}