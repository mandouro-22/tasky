import { ProjectAnalyticsResponseType } from "@/feature/projects/api/use-get-proejcts-analytics";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import AnalyticsCard from "./analytics-card";

export default function Analytics({ data }: ProjectAnalyticsResponseType) {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total tasks"
            value={data?.taskCount ?? 0}
            variant={data?.taskDifference || 0 > 0 ? "up" : "down"}
            increaseValue={data?.taskDifference || 0}
          />
          <AnalyticsCard
            title="Assignee tasks"
            value={data?.assigneeTaskCount ?? 0}
            variant={data?.assigneeTaskDifference || 0 > 0 ? "up" : "down"}
            increaseValue={data?.assigneeTaskCount ?? 0}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
