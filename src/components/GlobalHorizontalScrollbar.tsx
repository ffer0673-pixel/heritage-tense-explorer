import React, { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

export function GlobalHorizontalScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isPointerDown = useRef(false);

  // Update geometry calculations (scroll progress percentage)
  const updateGeometry = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const maxScroll = scrollHeight - clientHeight;

    if (maxScroll > 0) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));
      setScrollProgress(progress);
    } else {
      setScrollProgress(0);
    }
  };

  useEffect(() => {
    updateGeometry();

    const resizeObserver = new ResizeObserver(() => {
      updateGeometry();
    });
    
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);

    window.addEventListener("resize", updateGeometry);
    window.addEventListener("scroll", updateGeometry, { passive: true });

    const intervalId = setInterval(updateGeometry, 500);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateGeometry);
      window.removeEventListener("scroll", updateGeometry);
      clearInterval(intervalId);
    };
  }, [pathname]);

  // Helper to scroll page to a specific progress (0.0 to 1.0)
  const scrollToProgress = (progress: number) => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const maxScroll = scrollHeight - clientHeight;
    const targetScrollTop = progress * maxScroll;

    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(targetScrollTop, { immediate: true });
    } else {
      window.scrollTo(0, targetScrollTop);
    }
    setScrollProgress(progress);
  };

  // Slider pointer dragging/clicking logic on the track element
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;

    isPointerDown.current = true;
    setIsDragging(true);
    track.setPointerCapture(e.pointerId);

    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));
    
    scrollToProgress(progress);
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));
    
    scrollToProgress(progress);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    setIsDragging(false);
    
    try {
      trackRef.current?.releasePointerCapture(e.pointerId);
    } catch (err) {
      // Capture released cleanly
    }
  };

  // Click handler for left/right ends navigation arrows
  const handleArrowClick = (direction: "left" | "right") => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) return;

    const scrollStep = clientHeight * 0.25;
    const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
    const targetScrollTop = direction === "left"
      ? Math.max(0, currentScrollTop - scrollStep)
      : Math.min(maxScroll, currentScrollTop + scrollStep);

    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(targetScrollTop, { immediate: false });
    } else {
      window.scrollTo({
        top: targetScrollTop,
        behavior: "smooth"
      });
    }
  };

  // Keyboard navigation when scrollbar wrapper is active/focused
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) return;

    let targetScrollTop = window.scrollY || document.documentElement.scrollTop;
    const step = 45; // Pixels per key stroke

    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      targetScrollTop = Math.max(0, targetScrollTop - step);
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      targetScrollTop = Math.min(maxScroll, targetScrollTop + step);
    } else if (e.key === "PageUp") {
      targetScrollTop = Math.max(0, targetScrollTop - clientHeight);
    } else if (e.key === "PageDown") {
      targetScrollTop = Math.min(maxScroll, targetScrollTop + clientHeight);
    } else if (e.key === "Home") {
      targetScrollTop = 0;
    } else if (e.key === "End") {
      targetScrollTop = maxScroll;
    } else {
      return;
    }

    e.preventDefault();
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(targetScrollTop, { immediate: true });
    } else {
      window.scrollTo(0, targetScrollTop);
    }
  };

  return (
    <div
      className="global-horizontal-scrollbar-wrapper"
      role="scrollbar"
      aria-orientation="horizontal"
      aria-label="Global page horizontal scrollbar"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "16px",
        zIndex: 99999,
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 6px",
        userSelect: "none",
        outline: "none",
        boxSizing: "border-box",
      }}
    >
      {/* Left Navigation Arrow Button */}
      <button
        onClick={() => handleArrowClick("left")}
        aria-label="Scroll up"
        tabIndex={-1}
        className="global-scrollbar-arrow"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "14px",
          height: "16px",
          outline: "none",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{ width: "8px", height: "8px", fill: "currentColor" }}
        >
          <polygon points="100,0 0,50 100,100" />
        </svg>
      </button>

      {/* Track Area */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          flex: 1,
          height: "16px",
          position: "relative",
          margin: "0 8px",
          cursor: "pointer",
          borderRadius: "9999px",
        }}
      >
        {/* Full-width solid thumb centered vertically */}
        <div
          className={`global-scrollbar-thumb ${isDragging ? "dragging" : ""}`}
          style={{
            position: "absolute",
            left: "4px",
            width: "calc(100% - 8px)",
            height: "10px",
            top: "3px",
          }}
        />
      </div>

      {/* Right Navigation Arrow Button */}
      <button
        onClick={() => handleArrowClick("right")}
        aria-label="Scroll down"
        tabIndex={-1}
        className="global-scrollbar-arrow"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "14px",
          height: "16px",
          outline: "none",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{ width: "8px", height: "8px", fill: "currentColor" }}
        >
          <polygon points="0,0 100,50 0,100" />
        </svg>
      </button>
    </div>
  );
}
