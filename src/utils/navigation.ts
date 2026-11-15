import { INavigationItem } from "@/types/INavigationItem";

export const navigationItems: INavigationItem[] = [
  { title: "O mnie", href: "/o-mnie" },
  {
    title: "Warsztaty",
    children: [
      { title: "KURS OD ZERA", href: "/warsztaty/od-zera" },
      { title: "LEKCJA TOCZENIA", href: "/warsztaty/toczenie" },
      { title: "LEKCJA LEPIENIA", href: "/warsztaty/lepienie" },
      { title: "LEKCJA SZKLIWIENIA", href: "/warsztaty/szkliwienie" },
      { title: "SZLIF CERAMICZNY", href: "/warsztaty/szlif-ceramiczny" },
      { title: "GRUPY ZORGANIZOWANE", href: "/warsztaty/grupy-zorganizowane" },
    ],
  },
  { title: "Pracownia", href: "/pracownia" },
  { title: "Vouchery", href: "/vouchery" },
  { title: "Blog", href: "/blog" },
  { title: "Kontakt", href: "/kontakt" },
  { title: "Galeria", href: "/galeria" },
];

export const CONTACT = {
  phone: "660 632 805",
  email: "bottegadakris@gmail.com",
  address: "ul. Gdańska 19/15, 90-706 Łódź",
  facebook: "https://www.facebook.com/profile.php?id=61558277297300",
  instagram: "https://www.instagram.com/bottega_da_kris/",
};
