"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/assets/logo.png";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface ChildrenProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: ChildrenProps) {
  const pathName = usePathname();
  const isLoginIn = pathName === "/sign-in";
  return (
    <main>
      <div className="bg-neutral-50 min-h-screen">
        <div className="mx-auto max-w-screen-2xl p-4">
          <nav className="flex items-center justify-between">
            <Image
              src={Logo}
              height={50}
              width={80}
              className="object-cover"
              alt="logo"
              loading="lazy"
            />

            <Button asChild variant={"secondary"}>
              <Link href={isLoginIn ? "/sign-up" : "/sign-in"}>
                {isLoginIn ? "Sign Up" : "Login"}
              </Link>
            </Button>
          </nav>
        </div>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}
