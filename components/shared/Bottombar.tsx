"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              key={link.label}
              href={link.route}
              className={`bottombar_link ${isActive && "bg-primary-500"}`}>
              <Image
                src={link.imgURL}
                height={24}
                width={24}
                alt={link.label}></Image>

              <p className=" text-subtle-medium max-sm:hidden text-light-1  ">
                {link.label.split(/\s+./)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
