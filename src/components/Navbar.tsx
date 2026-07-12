import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/tenses", label: "Tenses" },
  { to: "/quiz", label: "Quiz" },
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
  const [isMobile, setIsMobile] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Track responsive screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const navbar = document.querySelector('.navbar') as HTMLElement | null;
    let ticking = false;

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
      const doubleMarquee = document.querySelector('.Double-marquee');
      const footerEl = document.querySelector('.main-footer');
      if (!doubleMarquee || !footerEl) return;

      const doubleMarqueeTop = doubleMarquee.getBoundingClientRect().top + window.scrollY;
      const footerTop = footerEl.getBoundingClientRect().top + window.scrollY;

      if (scrollPos >= footerTop) {
        navbar.classList.add('on-dark'); navbar.classList.remove('on-light');
      } else if (scrollPos >= doubleMarqueeTop) {
        navbar.classList.add('on-light'); navbar.classList.remove('on-dark');
      } else {
        navbar.classList.add('on-dark'); navbar.classList.remove('on-light');
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateNavbarColor();
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateNavbarColor();
    setScrolled(window.scrollY > 20);

    // Wiggle hover animation for mobile hamburger only
    const cleanups: (() => void)[] = [];
    const mobileHam = document.querySelector('.nav-hamburger');
    if (mobileHam) {
      cleanups.push(initWiggle(mobileHam, 2.5));
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cleanups.forEach(fn => fn && fn());
    };
  }, [pathname]);

  const getIsActive = (to: string) => {
    if (to === "/") {
      return pathname === "/";
    }
    return pathname === to || pathname.startsWith(to + "/");
  };

  return (
    <>
      <div className="nav-overlay"></div>
      <div className="navbar-wrapper">
        <motion.nav 
          className={cn("navbar", scrolled && "navbar--scrolled")}
        >
          {/* Brand Logo "TensesAroundUs" placed inside nav for flex alignment */}
          <div className="navbar-logo-container">
            <Link 
              to="/" 
              className="navbar-logo-link" 
              style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}
            >
              <h1 className="navbar-logo__title">
                <span className="navbar-logo__word is--relative">
                  <span>Tenses</span>
                  <div className="navbar-logo__smiley">
                    <img
                      src="/assets/VimeoHero SVG/smiley-face.svg"
                      alt=""
                      className="navbar-logo__smiley-svg"
                    />
                  </div>
                </span>

                <span className="navbar-logo__word is--relative">
                  <div className="navbar-logo__star">
                    <div className="navbar-logo__star-inner">
                      <img
                        src="/assets/VimeoHero SVG/pink-star.svg"
                        alt=""
                        className="navbar-logo__star-svg"
                      />
                    </div>
                  </div>
                  {/* Oval underline */}
                  <img
                    src="/assets/VimeoHero SVG/oval-underline.svg"
                    alt=""
                    className="navbar-logo__underline-svg"
                  />
                  <span>AroundUs</span>
                </span>
              </h1>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="nav-menu-right">
            {NAV_ITEMS.map((item) => {
              const isActive = getIsActive(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className={cn(
                    "nav-menu-item",
                    `menu-item-${item.label.toLowerCase()}`,
                    isActive && "active"
                  )}
                  style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}
                >
                  <span className="nav-item-text">
                    {item.label}
                  </span>
                </Link>
              );
            })}
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
        </motion.nav>
      </div>

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
              className={cn("nav-mobile-item", `menu-item-${item.label.toLowerCase()}`)}
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
