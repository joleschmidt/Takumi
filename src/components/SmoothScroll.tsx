"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export function SmoothScroll({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // Check if we are on a shop/list page where we want faster scrolling
    const isShopPage = pathname?.startsWith('/werkzeuge');

    useEffect(() => {
        const lenis = new Lenis({
            duration: isShopPage ? 0.8 : 1.2, // Faster response on shop pages
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: isShopPage ? 1.2 : 1, // Slightly more responsive wheel on shop pages
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, [isShopPage]);

    return <>{children}</>;
}
