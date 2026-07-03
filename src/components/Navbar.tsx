import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/quiz", label: "Quiz" },
  { to: "/cerita", label: "Cerita" },
  { to: "/progress", label: "Progress" },
  { to: "/reference", label: "Reference" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between gap-3 px-4 pointer-events-auto">
        {/* Logo */}
        <Link
          to="/"
          className={cn(
            "group flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300",
            scrolled && "glass-nav"
          )}
        >
         <img
  src="/logo.png"
  alt="Logo"
  className="h-8 w-8 rounded-lg object-cover"
/>
          <span className="text-sm font-medium tracking-tight">Tenses Around Us</span>
        </Link>

        {/* Center pill */}
        <nav
          className={cn(
            "hidden lg:flex items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-300",
            scrolled ? "glass-nav" : "bg-transparent"
          )}
        >
          {NAV_ITEMS.map((it) => {
            const active =
              it.to === "/"
                ? pathname === "/"
                : pathname === it.to || pathname.startsWith(it.to + "/");
            return (
              <Link
                key={it.to}
                to={it.to}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-muted"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
         
          <Link
            to="/tenses/simple-present"
            className="hidden sm:inline-flex items-center rounded-full bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5"
          >
            Mulai Belajar
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full lg:hidden",
              scrolled ? "glass-nav" : "bg-muted/40"
            )}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden pointer-events-auto mx-4 mt-2 glass-nav rounded-2xl p-2"
          >
            <nav className="grid gap-1">
              {NAV_ITEMS.map((it) => (
                <Link
                  key={it.to}
                  to={it.to}
                  className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  {it.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
