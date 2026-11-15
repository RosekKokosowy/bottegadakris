'use client';

import { MenuOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import arrowLeft from "@/assets/arrowLeft.png";
import arrowRight from "@/assets/arrowRight.png";
import close from "@/assets/close.png";
import { Logo } from "@/components/Graphics/Logo";
import { navigationItems } from "@/utils/navigation";

const workshops = navigationItems.find((item) => item.children)?.children ?? [];

export function NavbarMobile() {
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  const [isSecondOpen, setIsSecondOpen] = useState(false);

  const closeAll = () => {
    setIsFirstOpen(false);
    setIsSecondOpen(false);
  };

  return (
    <nav className="pointer-events-auto">
      <div className="flex justify-between items-center p-3">
        <Link href="/" aria-label="Bottega da Kris — strona główna">
          <Logo color="#ffffff" />
        </Link>
        <button type="button" aria-label="Menu" onClick={() => setIsFirstOpen(!isFirstOpen)}>
          <MenuOutlined style={{ color: "white", cursor: "pointer", fontSize: "28px" }} />
        </button>

        {/* Menu 1 */}
        <div className={`fixed top-0 left-0 h-full w-2/3 bg-bottega-brown p-4 transition-transform duration-300 z-50 ${isFirstOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex justify-between items-center">
            <Link href="/" onClick={closeAll} aria-label="Bottega da Kris — strona główna">
              <Logo color="#ffffff" />
            </Link>
            <Image src={close} alt="Zamknij" className="h-5 w-auto cursor-pointer" onClick={() => setIsFirstOpen(false)} />
          </div>

          <div className="pt-5">
            {navigationItems.map((item) => (
              <div key={item.title} className="pt-5">
                <div className="flex justify-between">
                  <div className="pl-3 text-white text-xl font-normal font-poppins mb-[0.5em]">
                    {item.href ? <Link href={item.href} onClick={closeAll}>{item.title}</Link> : <span onClick={() => setIsSecondOpen(true)}>{item.title}</span>}
                  </div>
                  {item.children ? <Image src={arrowRight} alt="Rozwiń" className="cursor-pointer" onClick={() => setIsSecondOpen(true)} /> : null}
                </div>
                <div className="bg-black h-[2px] my-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Menu 2 */}
        <div className={`fixed top-0 left-0 h-full w-2/3 bg-bottega-brown p-4 transition-transform duration-300 z-50 ${isSecondOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center cursor-pointer" onClick={() => setIsSecondOpen(false)}>
              <Image src={arrowLeft} alt="Wróć" className="h-auto" />
              <div className="flex items-center  pl-6">
                <div className="text-white text-lg font-poppins font-normal mb-0">Warsztaty</div>
              </div>
            </div>

            <div className="flex items-center cursor-pointer">
              <Image src={close} alt="Zamknij" className="h-auto" onClick={closeAll} />
            </div>
          </div>

          <div className="pt-5">
            {workshops.map((item) => (
              <div key={item.title} className="pt-5">
                <div className="flex justify-between">
                  <div className="pl-3 text-white text-base font-normal font-poppins mb-[0.5em]">
                    <Link href={item.href ?? "/"} onClick={closeAll}>{item.title}</Link>
                  </div>
                </div>
                <div className="bg-black h-[2px] my-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
