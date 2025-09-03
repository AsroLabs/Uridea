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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
