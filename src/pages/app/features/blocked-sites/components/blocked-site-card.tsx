import { deleteBlockedSite } from "@/pages/app/services/blocked-sites";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

type BlockedSiteCardProps = {
  site: string;
};

export function BlockedSiteCard({ site }: BlockedSiteCardProps) {
  async function handleDelete(url: string) {
    try {
      await deleteBlockedSite(url);
      toast.success("Site deleted successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
    }
  }
  return (
    <article>
      <header>
        <span> {site} </span>
      </header>

      <button className="secondary" onClick={() => handleDelete(site)}>
        <Trash />
      </button>
    </article>
  );
}
