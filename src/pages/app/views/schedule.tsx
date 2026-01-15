import { useSchedules } from "@/hooks";
import { AddScheduleForm, ListSchedules } from "../features/schedule";

export function Schedule() {
  const { schedules } = useSchedules();

  if (schedules)
    return (
      <main className="px-1">
        <section>
          <h1> Schedule </h1>

          <AddScheduleForm />
        </section>

        <ListSchedules schedules={schedules} />
      </main>
    );
}
