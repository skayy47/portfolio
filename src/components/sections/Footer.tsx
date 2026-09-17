"use client";

import { useLang } from "@/components/providers/LangProvider";
import { IDENTITY } from "@/lib/identity";

export function Footer() {
  const { c } = useLang();
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <div className="footer-brand">
          <span className="brand">
            <span className="brand-dot" />
            {IDENTITY.handle}
          </span>
          <p className="footer-quote font-mono">{c.footer.quote}</p>
        </div>
        <div className="footer-links">
          <a href={IDENTITY.socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={IDENTITY.socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={IDENTITY.socials.email}>Email</a>
        </div>
      </div>
      <div className="shell footer-base font-mono">
        <span>© {new Date().getFullYear()} {IDENTITY.name}</span>
        <span>{c.footer.built}</span>
      </div>
    </footer>
  );
}
