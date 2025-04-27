"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Logo from "@/components/logo/logo";

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
            <Logo />

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
