import { useBlockedSites } from "@/hooks";
import {
  AddBlockedSiteForm,
  ListBlockedSites,
} from "../features/blocked-sites";

export function BlockedSites() {
  const { sites } = useBlockedSites();

  if (sites)
    return (
      <main className="px-1">
        <section>
          <h1>Blocked Sites</h1>
          <p>
            Add the websites you want to block. You can use full domains or
            subdomains.
          </p>

          <AddBlockedSiteForm />
        </section>

        <ListBlockedSites sites={sites} />
      </main>
    );
}
