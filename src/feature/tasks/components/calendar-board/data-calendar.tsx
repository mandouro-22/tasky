"use client";
import { useState } from "react";
import {
  format,
  getDay,
  parse,
  // startOfMonth,
  addMonths,
  subMonths,
  startOfWeek,
} from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { enUS } from "date-fns/locale";
import { Task, TasksStatus } from "../../type";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data-calendar.css";
import EventCard from "./EventCard";
import CustomToolbar from "./customToolbar";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface DataCalendarProps {
  data: Task[];
}

export function DataCalendar({ data }: DataCalendarProps) {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  );

  const events = data.map((task) => ({
    end: new Date(task.dueDate),
    start: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    id: task.$id,
  }));

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setValue((prev) => subMonths(prev, 1));
    } else if (action === "NEXT") {
      setValue((prev) => addMonths(prev, 1));
    } else if (action === "TODAY") {
      setValue(new Date());
    }
  };

  return (
    <div className="mt-3">
      <Calendar
        localizer={localizer}
        events={events}
        date={value}
        defaultView="month"
        views={["month"]}
        showAllEvents
        toolbar
        className="h-full"
        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
        formats={{
          weekdayFormat: (date, culture, localizer) =>
            localizer?.format(date, "EEE", culture) ?? "",
        }}
        components={{
          eventWrapper: ({ event }) => (
            <EventCard
              id={event.id}
              title={event.title}
              project={event.project}
              assignee={event.assignee.name}
              status={event.status as TasksStatus}
            />
          ),
          toolbar: () => (
            <CustomToolbar date={value} onNavigate={handleNavigate} />
          ),
        }}
      />
    </div>
  );
}
