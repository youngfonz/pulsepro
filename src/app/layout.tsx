import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { AuthGuard } from "@/components/AuthGuard";
import { getClientCount } from "@/actions/dashboard";
import { auth } from "@clerk/nextjs/server";
import { isAdminUser } from "@/lib/auth";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pulsepro.app"),
  title: "Pulse Pro — Project & Task Management",
  description: "Plan, track, and manage your projects and tasks in one place. Organize clients, set deadlines, and stay on top of your work with Pulse Pro.",
  openGraph: {
    title: "Pulse Pro — Project & Task Management",
    description: "Plan, track, and manage your projects and tasks in one place. Organize clients, set deadlines, and stay on top of your work with Pulse Pro.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse Pro — Project & Task Management",
    description: "Plan, track, and manage your projects and tasks in one place.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientCount = await getClientCount();
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  let isAdmin = false;
  if (clerkEnabled) {
    try {
      const { userId } = await auth();
      isAdmin = userId ? isAdminUser(userId) : false;
    } catch {
      // auth() may fail on public routes — safe to ignore
    }
  }

  const innerContent = (
    <ThemeProvider>
      <LayoutWrapper clientCount={clientCount} clerkEnabled={clerkEnabled} isAdmin={isAdmin}>
        {children}
      </LayoutWrapper>
    </ThemeProvider>
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {clerkEnabled ? (
          <ClerkProvider>
            <AuthGuard>
              {innerContent}
            </AuthGuard>
          </ClerkProvider>
        ) : (
          innerContent
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
