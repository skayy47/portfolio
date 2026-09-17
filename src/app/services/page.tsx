import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";

export const metadata: Metadata = {
  title: "Production AI for Accounting & Tax Firms — SKAY",
  description:
    "Custom AI assistants that answer from your firm's own documents — accurately, with sources, and without hallucinations. Book a free 20-minute teardown.",
  openGraph: {
    title: "Production AI for Accounting & Tax Firms — SKAY",
    description:
      "I build production AI assistants that answer from your firm's own documents — accurately, with sources, and without hallucinations.",
    type: "website",
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
