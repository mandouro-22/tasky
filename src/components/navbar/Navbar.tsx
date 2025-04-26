"use client";
import { UserButton } from "@/feature/auth/components/user-button";
import MobileSidebar from "../sidebar/mobile-sidebar";
import { usePathname } from "next/navigation";

const pathnameMap = {
  tasks: {
    title: "My Tasks",
    description: "View all of your tasks",
  },
  projects: {
    title: "My Projects",
    description: "View all of your projects",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all you projects ang tags",
};

export default function Navbar() {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");

  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;
  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="pt-4 px-6 flex items-center justify-between gap-3">
      <div className="flex-col lg:flex hidden ">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="text-muted-foreground">{description}</div>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
}
