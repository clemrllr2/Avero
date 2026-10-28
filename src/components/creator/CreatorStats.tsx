import { FollowersChart } from "@/components/charts/FollowersChart";
import { ViewsChart } from "@/components/charts/ViewsChart";
import { AudiencePanel } from "@/components/creator/AudiencePanel";
import type { KpiSparks } from "@/components/creator/KpiGrid";
import { KpiTabs } from "@/components/creator/KpiTabs";
import { PostsTable } from "@/components/creator/PostsTable";
import { Card } from "@/components/ui/Card";
import type { CreatorDashboard } from "@/lib/aggregate";
import { followersSeries, totalFollowers, viewsByWeek } from "@/lib/charts";
import type { NetworkData, Platform } from "@/lib/types";

/** Mini-courbes des tuiles : vues par semaine et abonnés, pour un ensemble de réseaux. */
function sparksFor(networks: NetworkData[], now: Date): KpiSparks {
  return {
    views: viewsByWeek(networks.flatMap((n) => n.posts), now).map((w) => w.views),
    followers: totalFollowers(followersSeries(networks)),
  };
}

/** Toutes les statistiques d'un créateur : réutilisé par l'espace créateur et la fiche PREMIUM des marques. */
export function CreatorStats({ dashboard, now }: { dashboard: CreatorDashboard; now: Date }) {
  const posts = dashboard.networks.flatMap((n) => n.posts);
  const sparks: Partial<Record<"ALL" | Platform, KpiSparks>> = { ALL: sparksFor(dashboard.networks, now) };
  for (const network of dashboard.networks) sparks[network.platform] = sparksFor([network], now);

  return (
    <div className="flex flex-col gap-6">
      <KpiTabs all={dashboard.kpis} byPlatform={dashboard.kpisByPlatform} sparks={sparks} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Vues par semaine de publication" icon="chart">
          <ViewsChart data={viewsByWeek(posts, now)} />
        </Card>
        <Card title="Abonnés" icon="users">
          <FollowersChart
            data={followersSeries(dashboard.networks)}
            platforms={dashboard.networks.map((n) => n.platform)}
          />
        </Card>
      </div>
      <Card title="Publications récentes" icon="play">
        <PostsTable posts={posts} />
      </Card>
      <Card title="Audience" icon="globe">
        <AudiencePanel networks={dashboard.networks} />
      </Card>
    </div>
  );
}
