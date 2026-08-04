"use client";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";

// Scroll-reveal wrapper: content rises and fades as it enters the viewport.
//
// PROGRESSIVE ENHANCEMENT, deliberately. The CSS leaves .rot-reveal fully visible;
// this component sets data-armed="1" on mount, which is what actually applies the
// hidden start state. So with JS off — and for every crawler — the page renders
// complete. Hiding content in CSS and revealing it with JS is how a page goes
// blank for exactly the visitors you can least afford to lose.
//
// One shared IntersectionObserver per element, disconnected after it fires: the
// reveal is a first-impression, not a scroll-linked effect, and re-animating on
// every scroll-back is the thing that makes these feel cheap.
//
// prefers-reduced-motion is handled in CSS, so a reader who asked for less motion
// gets the content with no transition at all.
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger, in ms. Keep under ~240 — longer reads as lag, not choreography. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Arm only now that JS is running.
    el.setAttribute("data-armed", "1");

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      el.classList.add("is-in");
      teardown();
    };

    // Anything already on screen at mount reveals immediately — otherwise the
    // hero would sit invisible until the first scroll.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal();
        }
      },
      // Fire slightly before the element is fully in view so it lands settled
      // rather than mid-animation.
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    // SAFETY NET — do not remove.
    //
    // IntersectionObserver only fires when a threshold is CROSSED. Move past an
    // element in a single frame and it goes from "below the fold, not
    // intersecting" straight to "above the fold, not intersecting" without ever
    // being intersecting on a sampled frame, so the callback never runs and the
    // content stays at opacity 0 PERMANENTLY. That is not a rare edge case:
    // clicking an in-page anchor, dragging the scrollbar, a hard flick on a
    // trackpad, and the browser restoring scroll position on reload all do it.
    // It stranded most of the home page invisible.
    //
    // So the observer is treated as the nice-to-have and this is the guarantee:
    // if the element has reached or passed the fold, it gets shown. The 0.92
    // matches the observer's -8% bottom margin, so both paths reveal at the
    // same point and the choreography is unchanged.
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) reveal();
    };

    function teardown() {
      io.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    }

    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();

    return teardown;
  }, []);

  return (
    <Tag
      ref={ref}
      className={`rot-reveal ${className}`}
      style={delay ? ({ "--rot-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
