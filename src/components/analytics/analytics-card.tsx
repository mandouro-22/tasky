import React from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: number;
  variant: "up" | "down";
  increaseValue: number;
}

export default function AnalyticsCard({
  title,
  value,
  variant,
  increaseValue,
}: AnalyticsCardProps) {
  const isIconColor = variant === "up" ? "text-emerald-500" : "text-red-500";
  const increaseValueColor = isIconColor;
  const Icon = variant === "up" ? FaCaretUp : FaCaretDown;

  return (
    <Card className="shadow-none border-none w-full">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncate text-base">{title}</span>

            <div className="flex items-center gap-x-1">
              <Icon className={cn(isIconColor, "size-4")} />
              <span
                className={cn(
                  increaseValueColor,
                  "truncate text-base font-meduim"
                )}
              >
                {increaseValue}
              </span>
            </div>
          </CardDescription>
        </div>
        <CardTitle className="3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
