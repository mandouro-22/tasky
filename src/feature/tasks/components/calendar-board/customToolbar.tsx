import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface CustomToolbarProps {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

export default function CustomToolbar({
  date,
  onNavigate,
}: CustomToolbarProps) {
  return (
    <div className="flex mb-4 gap-x-4 items-center w-full lg:w-auto justify-center lg:justify-start">
      <Button
        size={"icon"}
        variant={"secondary"}
        className="flex items-center"
        onClick={() => onNavigate("PREV")}
      >
        <ChevronLeftIcon className="size-5" />
      </Button>
      <div className="flex items-center">
        <CalendarIcon className="w-4 h-4 mr-2" />
        {format(date, "MMMM yyyy")}
      </div>
      <Button
        size={"icon"}
        variant={"secondary"}
        className="flex items-center"
        onClick={() => onNavigate("NEXT")}
      >
        <ChevronRightIcon className="size-5" />
      </Button>
    </div>
  );
}
