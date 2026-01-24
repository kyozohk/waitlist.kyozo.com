import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
  title: "Kyozo - Built by Creatives for Creatives",
  description: "Kyozo is built by creatives for creatives to discover audience and manage, community and share content with them.",
  keywords: "Kyozo, creatives, audience discovery, community management, content sharing",
  openGraph: {
    title: "Kyozo - Built by Creatives for Creatives",
    description: "Kyozo is built by creatives for creatives to discover audience and manage, community and share content with them.",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyozo - Built by Creatives for Creatives",
    description: "Kyozo is built by creatives for creatives to discover audience and manage, community and share content with them.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
