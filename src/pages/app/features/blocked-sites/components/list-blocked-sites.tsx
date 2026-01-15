import { ConditionalRender } from "@/pages/app/components/conditional-render";
import { SyncState } from "@/types";
import { BlockedSiteCard } from "./blocked-site-card";

type ListBlockedSitesProps = {
  sites: SyncState["blockedSites"];
};

export function ListBlockedSites({ sites }: ListBlockedSitesProps) {
  return (
    <section>
      <h2> Added sites </h2>

      <ConditionalRender when={sites.length !== 0} fallback={<FallBack />}>
        {sites.map((site) => (
          <BlockedSiteCard key={site} site={site} />
        ))}
      </ConditionalRender>
    </section>
  );
}

function FallBack() {
  return <p> No sites added </p>;
}
