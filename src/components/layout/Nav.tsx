"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export function Nav({ light = false }: { light?: boolean }) {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (light) {
      document.body.classList.add("light");
      return () => document.body.classList.remove("light");
    }
  }, [light]);

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically import GSAP only on client
    let gsapInstance: typeof import("gsap").gsap | null = null;

    import("gsap").then(({ gsap }) => {
      gsapInstance = gsap;
    });

    const hamburger = hamburgerRef.current;
    const panel = panelRef.current;
    const overlay = overlayRef.current;
    if (!hamburger || !panel || !overlay) return;

    const links = panel.querySelectorAll<HTMLElement>(".mobile-link");
    let menuOpen = false;

    function openMenu() {
      menuOpen = true;
      hamburger!.classList.add("open");
      hamburger!.setAttribute("aria-expanded", "true");
      panel!.classList.add("open");
      overlay!.classList.add("active");
      document.body.style.overflow = "hidden";
      if (gsapInstance) {
        gsapInstance.to(panel, { x: 0, duration: 0.4, ease: "power3.out" });
        gsapInstance.fromTo(links, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, stagger: 0.08, ease: "power2.out", delay: 0.15 });
      }
    }

    function closeMenu() {
      menuOpen = false;
      hamburger!.classList.remove("open");
      hamburger!.setAttribute("aria-expanded", "false");
      overlay!.classList.remove("active");
      document.body.style.overflow = "";
      if (gsapInstance) {
        gsapInstance.to(panel, { x: "100%", duration: 0.3, ease: "power2.in", onComplete: () => panel!.classList.remove("open") });
        gsapInstance.to(links, { opacity: 0, duration: 0.15 });
      }
    }

    const onHamburger = () => (menuOpen ? closeMenu() : openMenu());
    hamburger.addEventListener("click", onHamburger);
    overlay.addEventListener("click", closeMenu);

    return () => {
      hamburger.removeEventListener("click", onHamburger);
      overlay.removeEventListener("click", closeMenu);
      document.body.style.overflow = "";
    };
  }, []);

  const navClass = ["main-nav", (!isHomePage || light) && "scrolled", light && "light"].filter(Boolean).join(" ");

  return (
    <>
      <nav ref={navRef} className={navClass}>
        <div className="nav-logo">
          <Link href="/" className="nav-brand" aria-label="LiU AI Society home">
            <Image src="/images/LiUAISlogo.svg" className="nav-logo-image" alt="" width={220} height={168} priority />
            <Image src="/images/AI%20Society%20LiU.svg" className="nav-logo-image" alt="LiU AI Society" width={656} height={188} priority />
          </Link>
        </div>
        <div className="nav-links">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/events" className="nav-link">Events</Link>
          <Link href="/projects" className="nav-link">Projects</Link>
          <Link href="/courses" className="nav-link">Courses</Link>
          <Link href="/career" className="nav-link">Career</Link>
        </div>
      </nav>

      <button ref={hamburgerRef} className="hamburger" aria-label="Menu" aria-expanded="false">
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      <div ref={overlayRef} className="mobile-overlay" />
      <div ref={panelRef} className="mobile-panel">
        <Link href="/" className="mobile-logo nav-brand" aria-label="LiU AI Society home">
          <Image src="/images/LiUAISlogo.svg" className="nav-logo-image" alt="" width={220} height={168} />
          <Image src="/images/AI%20Society%20LiU.svg" alt="LiU AI Society" width={656} height={188} />
        </Link>
        <Link href="/" className="mobile-link">Home</Link>
        <Link href="/about" className="mobile-link">About</Link>
        <Link href="/events" className="mobile-link">Events</Link>
        <Link href="/projects" className="mobile-link">Projects</Link>
        <Link href="/courses" className="mobile-link">Courses</Link>
        <Link href="/career" className="mobile-link">Career</Link>
      </div>
    </>
  );
}
