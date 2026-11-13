import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Release Atlas — React & Next.js feature guide",
    template: "%s · Release Atlas",
  },
  description:
    "Practical before-and-after guides to significant React 19.2/19.3 and Next.js 15.3–16.4 features.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
