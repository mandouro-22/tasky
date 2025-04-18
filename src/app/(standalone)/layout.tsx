import Link from "next/link";
import Logo from "../../../public/assets/logo.png";
import Image from "next/image";
import { UserButton } from "@/feature/auth/components/user-button";

interface LayoutProps {
  children: React.ReactNode;
}
export default function layout({ children }: LayoutProps) {
  return (
    <main className="bg-nautral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl gap-2 px-4 py-2.5">
        <nav className="flex items-center justify-between h-[74px]">
          <Link href={"/"}>
            <Image
              src={Logo}
              alt="logo"
              height={40}
              width={70}
              className="object-cover"
            />
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
