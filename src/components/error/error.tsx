import { AlertTriangle } from "lucide-react";
import React from "react";

export default function ErrorPage({ message = "Something went wrong" }) {
  return (
    <div className="w-full h-full flex flex-col gap-2 mx-auto items-center justify-center">
      <AlertTriangle className="size-6 text-muted-foreground mb-2" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
