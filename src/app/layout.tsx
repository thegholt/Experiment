import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevoCompare",
  description:
    "Search UK parliamentary constituencies to understand devolution arrangements, powers and governance."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
