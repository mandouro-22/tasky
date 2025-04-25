import { redirect } from "next/navigation";
import SettingPorject from "./client";
import { getCurrent } from "@/feature/auth/query";

export default async function ProjectIdSettings() {
  const user = await getCurrent();

  if (!user) {
    return redirect("/sign-in");
  }
  return <SettingPorject />;
}
