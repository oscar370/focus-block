import { addBlockedSite } from "@/pages/app/services/blocked-sites";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

export function AddBlockedSiteForm() {
  async function handleSubmit(data: FormData) {
    const url = (data.get("url") as string).trim();

    try {
      await addBlockedSite(url);
      toast.success("Site added successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
    }
  }

  return (
    <form action={handleSubmit} onSubmit={(e) => e.preventDefault}>
      <fieldset role="group">
        <input
          name="url"
          pattern="^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$"
          placeholder="example.com"
          required
        />
        <button type="submit">
          <Plus />
        </button>
      </fieldset>
    </form>
  );
}
