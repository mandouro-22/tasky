// import Image from "next/image";
import Link from "next/link";
// import Logo from "../../../public/assets/logo.png";
import React from "react";
import DottedSeparatoo from "../dotted-separator";
import { Navigation } from "./Navigation";
import WorkspaceSwitcher from "../workspace/workspace-switcher";
import Projects from "../projects/projects";
import Logo from "../logo/logo";

export default function Sidebar() {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link
        href={"/"}
        className="flex items-center justify-start rounded-lg p-2  mb-4"
      >
        {/* <Image
          src={Logo}
          alt="logo"
          width={70}
          height={48}
          className=" object-cover"
        /> */}
        <Logo />
      </Link>
      <WorkspaceSwitcher />
      <DottedSeparatoo className="my-4" />
      <Navigation />
      <DottedSeparatoo className="my-4" />
      <Projects />
    </aside>
  );
}
