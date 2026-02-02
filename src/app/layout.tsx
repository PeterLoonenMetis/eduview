import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CurriculumView - Curriculum Management",
  description: "Een webapplicatie die het curriculum van een hbo-opleiding volledig en samenhangend inzichtelijk maakt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
