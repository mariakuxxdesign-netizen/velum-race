"use client";

import { useState } from "react";

const navItems = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About Us" },
  { href: "/#clinics", label: "Clinics" },
  { href: "/#locations", label: "Locations" },
  { href: "/#contact", label: "Contact Us" }
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="nav">
      <a className="brand" href="/#home" aria-label="Velum Race home" onClick={() => setIsOpen(false)}>
        <img src="/images/logo.svg" alt="" />
      </a>

      <button
        aria-controls="site-menu"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="menu-toggle"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={isOpen ? "is-open" : undefined} id="site-menu">
        {navItems.map((item) => (
          <a href={item.href} key={item.href} onClick={() => setIsOpen(false)}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
