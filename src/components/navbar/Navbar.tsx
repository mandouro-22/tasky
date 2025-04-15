import { UserButton } from "@/feature/auth/components/user-button";
import MobileSidebar from "../sidebar/mobile-sidebar";

export default function Navbar() {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between gap-3">
      <div className="flex-col lg:flex hidden ">
        <h1 className="text-2xl font-semibold">Home</h1>
        <div className="text-muted-foreground">
          Monitor all you projects ang tags
        </div>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
}
