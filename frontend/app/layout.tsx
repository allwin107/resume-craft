import type { Metadata } from "next";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
    title: "Resume Analyzer - AI-Powered Resume Matching",
    description: "Analyze your resume against job descriptions with AI-powered insights and recommendations",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ErrorBoundary>
                    <ThemeProvider>
                        <ToastProvider>
                            <AuthProvider>
                                {children}
                            </AuthProvider>
                        </ToastProvider>
                    </ThemeProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}
