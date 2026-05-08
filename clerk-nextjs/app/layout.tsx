import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Interview Prep AI",
	description: "AI-powered interview practice for DSA, HR, and System Design.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const themeScript = `(() => { try { const stored = localStorage.getItem('theme'); const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; const theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light'); document.documentElement.classList.toggle('dark', theme === 'dark'); localStorage.setItem('theme', theme); } catch (error) {} })();`;

	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
		>
			<body className="min-h-full bg-background text-foreground">
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				<ClerkProvider
					signInUrl="/sign-in"
					signUpUrl="/sign-up"
					signInForceRedirectUrl="/dashboard"
					signUpForceRedirectUrl="/dashboard"
					signInFallbackRedirectUrl="/dashboard"
					signUpFallbackRedirectUrl="/dashboard"
				>
					{children}
				</ClerkProvider>
				<Toaster richColors position="top-right" />
			</body>
		</html>
	);
}