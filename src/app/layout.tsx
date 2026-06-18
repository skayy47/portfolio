import type { Metadata } from "next";
import { Archivo, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeBootScript } from "@/components/providers/ThemeProvider";
import { LangProvider, langBootScript } from "@/components/providers/LangProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { IDENTITY } from "@/lib/identity";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const jb = JetBrains_Mono({
  variable: "--font-jb",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${IDENTITY.name} — AI Engineer & Data Scientist`,
  description:
    "Oussama Skia (SKAY) — AI Engineer & Data Scientist. I build systems that survive production: multi-agent orchestration, production RAG, full-stack data intelligence. EN / FR.",
  keywords: ["AI Engineer", "Data Scientist", "Multi-agent AI", "RAG", "Big Data", "Casablanca", "SKAY", "Oussama Skia"],
  authors: [{ name: IDENTITY.name }],
  openGraph: {
    title: `${IDENTITY.name} — AI Engineer & Data Scientist`,
    description: "I build AI systems that survive production.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="aurora"
      suppressHydrationWarning
      className={`${archivo.variable} ${grotesk.variable} ${jb.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script dangerouslySetInnerHTML={{ __html: langBootScript }} />
      </head>
      <body>
        <ThemeProvider>
          <LangProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
