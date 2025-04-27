import { CircleCheckBig } from "lucide-react";
import React from "react";

export default function Logo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <CircleCheckBig className="size-6 text-blue-700 font-bold" />
      <h1 className="text-blue-700 text-xl font-bold">Tasky</h1>
    </div>
  );
}
