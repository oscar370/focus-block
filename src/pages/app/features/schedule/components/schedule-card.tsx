import { deleteSchedule } from "@/pages/app/services/schedule";
import { Schedule } from "@/types";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

type ScheduleCardProps = {
  schedule: Schedule;
};

const DAY_LABELS: Record<string, string> = {
  sunday: "Sun",
  monday: "Mon",
  tuesday: "Tues",
  wednesday: "Wed",
  thursday: "Thurs",
  friday: "Fri",
  saturday: "Sat",
};

export function ScheduleCard({ schedule }: ScheduleCardProps) {
  const activeDays = Object.entries(schedule.days)
    .filter(([key, value]) => value === true && key in DAY_LABELS)
    .map(([key]) => DAY_LABELS[key]);

  async function handleDelete(id: string) {
    try {
      await deleteSchedule(id);
      toast.success("Schedule deleted successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
    }
  }

  return (
    <article>
      <header className="flex justify-between">
        <h3 className="mb-0! text-base!"> {schedule.name} </h3>
        <small>
          {schedule.startTime} – {schedule.endTime}
        </small>
      </header>

      <div className="flex gap-2">
        {activeDays.map((day) => (
          <kbd key={day}>{day}</kbd>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <button className="secondary" onClick={() => handleDelete(schedule.id)}>
          <Trash />
        </button>
      </div>
    </article>
  );
}
