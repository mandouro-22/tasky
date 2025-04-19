import { getCurrent } from "@/feature/auth/query";
import SignInCard from "@/feature/auth/components/sign-in-card";
import { redirect } from "next/navigation";

export default async function Login() {
  const user = await getCurrent();

  if (user) redirect("/");

  return <SignInCard />;
}
