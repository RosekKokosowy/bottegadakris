'use client';

import AOS from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AosInit() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // New page content needs AOS to pick up its [data-aos] elements.
  useEffect(() => {
    AOS.refreshHard();
  }, [pathname]);

  return null;
}
