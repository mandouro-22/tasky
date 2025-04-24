"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col gap-2 mx-auto items-center justify-center">
      <AlertTriangle className="size-6" />
      <p className="text-sm">Something went wrong</p>
      <Button variant={"secondary"} size={"sm"}>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
