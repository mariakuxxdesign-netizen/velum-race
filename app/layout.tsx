import type { Metadata } from "next";
import { ScrollReveal } from "./scroll-reveal";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velum Race",
  description: "Elite sailing clinics focused on technical progress and race performance.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
