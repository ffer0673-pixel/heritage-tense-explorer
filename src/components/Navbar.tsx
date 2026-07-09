import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/tenses", label: "Tenses" },
  { to: "/quiz", label: "Quiz" },
  { to: "/cerita", label: "Cerita" },
  { to: "/progress", label: "Progress" },
  { to: "/reference", label: "Reference" },
] as const;

function initWiggle(element: HTMLElement | Element, intensity: number) {
  const target = element.querySelector('[data-wiggle-target]') || element;
  gsap.set(target, { transformOrigin: 'center center' });
  let tween: gsap.core.Tween | undefined;
  const onEnter = () => {
    tween = gsap.to(target, { rotation: intensity, duration: 0.17, repeat: -1, yoyo: true, ease: 'steps(1)' });
  };
  const onLeave = () => {
    if (tween) {
      tween.kill();
      gsap.to(target, { rotation: 0, duration: 0.3, ease: 'power2.out' });
    }
  };
  element.addEventListener('mouseenter', onEnter);
  element.addEventListener('mouseleave', onLeave);
  return () => {
    element.removeEventListener('mouseenter', onEnter);
    element.removeEventListener('mouseleave', onLeave);
  };
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const navbar = document.querySelector('.navbar') as HTMLElement | null;

    const updateNavbarColor = () => {
      if (!navbar) return;

      const isHome = window.location.pathname === "/";
      if (!isHome) {
        // Adapt subpages to global dark/light theme
        const isDarkTheme = document.documentElement.classList.contains("dark") || document.body.classList.contains("dark");
        if (isDarkTheme) {
          navbar.classList.add("on-dark");
          navbar.classList.remove("on-light");
        } else {
          navbar.classList.add("on-light");
          navbar.classList.remove("on-dark");
        }
        return;
      }

      // Home page adaptive scroll color logic
      const scrollPos = window.scrollY + navbar.offsetHeight / 2;
      const contentSection = document.querySelector('.content-section');
      const footerEl = document.querySelector('.main-footer');
      if (!contentSection || !footerEl) return;

      const contentTop = contentSection.getBoundingClientRect().top + window.scrollY;

      const showreelSection = document.querySelector('#showreel-section');
      const showreelTop = showreelSection ? showreelSection.getBoundingClientRect().top + window.scrollY : Infinity;

      const serviceCardsSection = document.querySelector('.service-cards-wrapper');
      const serviceCardsTop = serviceCardsSection ? serviceCardsSection.getBoundingClientRect().top + window.scrollY : Infinity;

      const doubleMarquee = document.querySelector('.Double-marquee');
      const doubleMarqueeTop = doubleMarquee ? doubleMarquee.getBoundingClientRect().top + window.scrollY : Infinity;
      const footerTop = footerEl.getBoundingClientRect().top + window.scrollY;

      if (scrollPos >= footerTop) {
        navbar.classList.add('on-dark'); navbar.classList.remove('on-light');
      } else if (scrollPos >= doubleMarqueeTop) {
        navbar.classList.add('on-light'); navbar.classList.remove('on-dark');
      } else if (scrollPos >= serviceCardsTop) {
        navbar.classList.add('on-light'); navbar.classList.remove('on-dark');
      } else if (scrollPos >= showreelTop) {
        navbar.classList.add('on-dark'); navbar.classList.remove('on-light');
      } else if (scrollPos >= contentTop) {
        navbar.classList.add('on-light'); navbar.classList.remove('on-dark');
      } else {
        navbar.classList.add('on-dark'); navbar.classList.remove('on-light');
      }
    };

    const handleScrollState = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', updateNavbarColor);
    window.addEventListener('scroll', handleScrollState);
    updateNavbarColor();
    handleScrollState();

    // Wiggle hover animations
    const cleanups: (() => void)[] = [];
    const menuItems = document.querySelectorAll('.nav-menu-item, .nav-hamburger');
    menuItems.forEach(item => {
      cleanups.push(initWiggle(item, 2.5));
    });

    return () => {
      window.removeEventListener('scroll', updateNavbarColor);
      window.removeEventListener('scroll', handleScrollState);
      cleanups.forEach(fn => fn && fn());
    };
  }, [pathname]);

  return (
    <>
      <div className="nav-overlay"></div>
      <nav className={cn("navbar", scrolled && "navbar--scrolled")}>
        {/* Navigation Items (Right Aligned) */}
        <div className="nav-menu-right">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: 'active' }}
              className="nav-menu-item"
              style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className={cn("nav-hamburger", mobileOpen && "open")}
          aria-label="Toggle Menu"
          style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}
        >
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Fullscreen Menu Overlay */}
      <div className={cn("nav-mobile-overlay", mobileOpen && "open")}>
        <nav className="nav-mobile-menu">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: 'active' }}
              className="nav-mobile-item"
              style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
