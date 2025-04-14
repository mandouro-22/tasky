import { getCurrent } from "@/feature/auth/action";
import { UserButton } from "@/feature/auth/components/user-button";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();

  if (!user) return redirect("/sign-in");

  return (
    <div>
      <UserButton />
    </div>
  );
}
