import { ConditionalRender } from "@/pages/app/components/conditional-render";
import { Schedule } from "@/types";
import { ScheduleCard } from "./schedule-card";

type ListSchedulesProps = {
  schedules: Schedule[];
};

export function ListSchedules({ schedules }: ListSchedulesProps) {
  return (
    <section>
      <h2> Added schedules </h2>

      <ConditionalRender when={schedules.length !== 0} fallback={<Fallback />}>
        {schedules.map((schedule) => (
          <ScheduleCard key={schedule.id} schedule={schedule} />
        ))}
      </ConditionalRender>
    </section>
  );
}

function Fallback() {
  return <p> No schedules added </p>;
}
