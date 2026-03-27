import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Returns true when the viewport width is below the mobile breakpoint (768px).
 * Updates reactively on window resize.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return isMobile;
}
