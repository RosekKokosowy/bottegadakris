'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { Facebook } from "@/components/Graphics/Facebook";
import { Instagram } from "@/components/Graphics/Instagram";
import { Logo } from "@/components/Graphics/Logo";
import { ScheduleButton } from "@/components/ScheduleButton/ScheduleButton";
import { CONTACT, navigationItems } from "@/utils/navigation";

const linkHover = "text-base hover:text-bottega-dark-brown transition-colors duration-300 ease-in-out";

export function NavbarDesktop() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 200);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`px-5 w-full z-10 transition-colors ${isScrolled ? "bg-bottega-brown duration-300 ease-out" : "bg-transparent"}`}>
      <div className="flex items-center gap-[10px] text-xl pl-7">
        <Link href="/" aria-label="Bottega da Kris — strona główna">
          <Logo color="#ffffff" />
        </Link>

        <div className="flex-1 flex justify-center items-center gap-5 font-poppins pl-28">
          {navigationItems.map((item) => (
            <div key={item.title} className="relative group">
              <div className="text-white flex gap-2 items-center uppercase">
                {item.href ? (
                  <Link href={item.href} className={isScrolled ? linkHover : "text-base hover:text-bottega-brown transition-colors duration-300 ease-in-out"}>
                    {item.title}
                  </Link>
                ) : (
                  <span className="text-base">{item.title}</span>
                )}
              </div>
              {item.children && (
                <div className="hidden z-50 absolute group-hover:flex flex-col bg-bottega-brown rounded-b-md p-[15px] min-w-max">
                  {item.children.map((child) => (
                    <Link key={child.title} href={child.href ?? "/"} className={`${linkHover} text-white p-[10px] `}>
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <ScheduleButton className="border border-white text-xl text-white py-2 px-4 hover:shadow-lg hover:bg-bottega-brown hover:text-white hover:border-bottega-brown transform transition ease-in-out" />
        <a href={CONTACT.facebook} aria-label="Facebook" className="ml-3 cursor-pointer transform transition-transform ease-in-out hover:translate-y-0.5">
          <Facebook color="#ffffff" size="26" />
        </a>
        <a href={CONTACT.instagram} aria-label="Instagram" className="ml-0 cursor-pointer transform transition-transform ease-in-out hover:translate-y-0.5">
          <Instagram color="#ffffff" size="26" />
        </a>
      </div>
    </nav>
  );
}
