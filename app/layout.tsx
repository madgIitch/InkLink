// app/layout.tsx
import type { Metadata } from "next";
import SWRegistrar from "./sw-registrar";

export const metadata: Metadata = {
  title: "InkLink — Tattoo Finder",
  description: "Encuentra tatuadores independientes cerca de ti.",
  themeColor: "#111827",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#111827" />
      </head>
      <body>
        {children}
        <SWRegistrar />
      </body>
    </html>
  );
}
