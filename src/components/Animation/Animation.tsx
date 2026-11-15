import { ReactNode } from "react";

/** Fade-up on scroll; AOS itself is initialised once by <AosInit />. */
export function Animation({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="2500" className={className}>
      {children}
    </div>
  );
}
