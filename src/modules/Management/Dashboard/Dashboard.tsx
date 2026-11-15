import Image from "next/image";
import Link from "next/link";
import gallery from "@/assets/management/gallery.png";
import payments from "@/assets/management/payments.svg";
import posts from "@/assets/management/posts.png";
import prices from "@/assets/management/prices.svg";
import schedule from "@/assets/management/schedule.svg";
import users from "@/assets/management/users.png";
import vouchers from "@/assets/management/vouchers.svg";

const tiles = [
  { src: schedule, title: "GRAFIK", path: "schedule", png: false },
  { src: vouchers, title: "VOUCHERY", path: "vouchers", png: false },
  { src: payments, title: "PŁATNOŚCI", path: "payments", png: false },
  { src: prices, title: "CENY", path: "prices", png: false },
  { src: users, title: "KARTOTEKA", path: "customers", png: true },
  { src: posts, title: "BLOG", path: "blog", png: true },
  { src: gallery, title: "GALERIA", path: "gallery", png: true },
];

export default function Dashboard() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,270px)] gap-6 place-content-center pt-24 ">
      {tiles.map((tile) => (
        <Link
          key={tile.path}
          href={`/olimp/${tile.path}`}
          className="w-full h-[270px] bg-white p-5 rounded-lg border border-bottega-brown shadow-md flex flex-col items-center cursor-pointer hover:shadow-lg transition duration-300 hover:-translate-y-1"
        >
          <Image className={`max-h-[170px] w-auto ${tile.png ? "scale-95" : ""}`} src={tile.src} alt="" sizes="230px" />
          <p className="text-center text-xl pt-5 font-semibold mt-auto">{tile.title}</p>
        </Link>
      ))}
    </div>
  );
}
