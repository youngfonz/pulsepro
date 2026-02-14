import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { AuthGuard } from "@/components/AuthGuard";
import { getClientCount } from "@/actions/dashboard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://project-tracker-rose-five.vercel.app"),
  title: "Pulse — Project & Task Management",
  description: "Plan, track, and manage your projects and tasks in one place. Organize clients, set deadlines, and stay on top of your work with Pulse.",
  openGraph: {
    title: "Pulse — Project & Task Management",
    description: "Plan, track, and manage your projects and tasks in one place. Organize clients, set deadlines, and stay on top of your work with Pulse.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pulse — Project & Task Management",
    description: "Plan, track, and manage your projects and tasks in one place.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientCount = await getClientCount();
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const innerContent = (
    <ThemeProvider>
      <LayoutWrapper clientCount={clientCount} clerkEnabled={clerkEnabled}>
        {children}
      </LayoutWrapper>
    </ThemeProvider>
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {clerkEnabled ? (
          <ClerkProvider fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse"><div className="w-10 h-10 bg-primary/20 rounded-lg"></div></div></div>}>
            <AuthGuard>
              {innerContent}
            </AuthGuard>
          </ClerkProvider>
        ) : (
          innerContent
        )}
      </body>
    </html>
  );
}
