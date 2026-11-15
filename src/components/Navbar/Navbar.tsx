import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";

export function Navbar() {
  return (
    <>
      <div className="hidden md:block fixed top-0 left-0 w-full z-50">
        <NavbarDesktop />
      </div>

      <div className="block md:hidden absolute pointer-events-none top-0 left-0 w-full h-full bg-transparent z-50">
        <NavbarMobile />
      </div>
    </>
  );
}
