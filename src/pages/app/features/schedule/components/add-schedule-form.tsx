import { addSchedule } from "@/pages/app/services/schedule";
import { Days, Schedule } from "@/types";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type DaysInputs = {
  name: keyof Days;
  label: string;
};

const daysInputs: DaysInputs[] = [
  {
    name: "sunday",
    label: "Sunday",
  },
  {
    name: "monday",
    label: "Monday",
  },
  {
    name: "tuesday",
    label: "Tuesday",
  },
  {
    name: "wednesday",
    label: "Wednesday",
  },
  {
    name: "thursday",
    label: "Thursday",
  },
  {
    name: "friday",
    label: "Friday",
  },
  {
    name: "saturday",
    label: "Saturday",
  },
];

export function AddScheduleForm() {
  const { register, handleSubmit } = useForm<Schedule>();

  async function onSubmit(data: Schedule) {
    try {
      const daysArray = Object.values(data.days);

      if (!daysArray.includes(true)) {
        throw new Error("At least one day must be selected");
      }

      const schedule = {
        ...data,
        id: crypto.randomUUID(),
      };
      await addSchedule(schedule);
      toast.success("Schedule added successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Name
        <input type="text" {...register("name")} required />
      </label>

      <fieldset>
        <legend> Days of the week </legend>

        {daysInputs.map((day) => (
          <label key={day.name}>
            <input type="checkbox" {...register(`days.${day.name}`)} />
            {day.label}
          </label>
        ))}
      </fieldset>

      <fieldset className="flex gap-2">
        <label className="w-full">
          Start time
          <input
            type="time"
            aria-label="Start time"
            required
            {...register("startTime")}
          />
        </label>

        <label className="w-full">
          End time
          <input
            type="time"
            aria-label="End time"
            required
            {...register("endTime")}
          />
        </label>
      </fieldset>

      <button type="submit"> Save schedule </button>
    </form>
  );
}
