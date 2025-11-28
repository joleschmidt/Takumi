"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "cookie-consent";

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Prüfe ob bereits ein Consent gegeben wurde
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) {
            setShowBanner(true);
            // Kleine Verzögerung für Animation
            setTimeout(() => setIsVisible(true), 100);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, "accepted");
        setIsVisible(false);
        setTimeout(() => setShowBanner(false), 300);
    };

    const handleReject = () => {
        localStorage.setItem(CONSENT_KEY, "rejected");
        setIsVisible(false);
        setTimeout(() => setShowBanner(false), 300);
    };

    const handleOpenSettings = () => {
        // Lösche Consent, damit Banner wieder erscheint
        localStorage.removeItem(CONSENT_KEY);
        setShowBanner(true);
        setIsVisible(true);
    };

    // Expose function globally for Footer link
    useEffect(() => {
        (window as any).openCookieSettings = handleOpenSettings;
        return () => {
            delete (window as any).openCookieSettings;
        };
    }, []);

    if (!showBanner) return null;

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] text-[#FAFAF8] border-t-2 border-black transition-transform duration-300 ${isVisible ? "translate-y-0" : "translate-y-full"
                }`}
        >
            <div className="container mx-auto px-4 py-6 md:py-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
                    <div className="flex-1 space-y-2">
                        <h3 className="text-lg md:text-xl font-oswald font-bold uppercase tracking-tighter">
                            Cookie-Einstellungen
                        </h3>
                        <p className="text-sm md:text-base leading-relaxed text-gray-300">
                            Wir verwenden technisch notwendige Cookies, um die Funktionalität dieser Website zu gewährleisten.
                            Weitere Informationen finden Sie in unserer{" "}
                            <Link
                                href="/datenschutz"
                                className="text-[#6B7F59] hover:underline font-medium"
                            >
                                Datenschutzerklärung
                            </Link>.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button
                            onClick={handleReject}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 hover:text-white rounded-none uppercase tracking-wider font-bold text-sm px-6 py-2"
                        >
                            Ablehnen
                        </Button>
                        <Button
                            onClick={handleAccept}
                            className="bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-wider font-bold text-sm px-6 py-2"
                        >
                            Akzeptieren
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

