import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Brainstorming App",
  description: "A web application for brainstorming ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
