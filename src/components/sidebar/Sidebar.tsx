import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/assets/logo.png";
import React from "react";
import DottedSeparatoo from "../dotted-separator";
import { Navigation } from "./Navigation";

export default function Sidebar() {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href={"/"}>
        <Image
          src={Logo}
          alt="logo"
          width={70}
          height={48}
          className="rounded-full object-cover"
        />
      </Link>
      <DottedSeparatoo className="my-4" />
      <Navigation />
    </aside>
  );
}
