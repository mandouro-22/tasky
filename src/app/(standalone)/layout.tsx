import Link from "next/link";
import { UserButton } from "@/feature/auth/components/user-button";
import Logo from "@/components/logo/logo";

interface LayoutProps {
  children: React.ReactNode;
}
export default function layout({ children }: LayoutProps) {
  return (
    <main className="bg-nautral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl gap-2 px-4 py-2.5">
        <nav className="flex items-center justify-between h-[74px]">
          <Link href={"/"}>
            <Logo />
          </Link>

          <UserButton />
        </nav>

        <div className="flex flex-col justify-center align-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
}
