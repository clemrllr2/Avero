import { FollowersChart } from "@/components/charts/FollowersChart";
import { ViewsChart } from "@/components/charts/ViewsChart";
import { AudiencePanel } from "@/components/creator/AudiencePanel";
import { KpiTabs } from "@/components/creator/KpiTabs";
import { PostsTable } from "@/components/creator/PostsTable";
import { Card } from "@/components/ui/Card";
import type { CreatorDashboard } from "@/lib/aggregate";
import { followersSeries, viewsByWeek } from "@/lib/charts";

/** Toutes les statistiques d'un créateur : réutilisé par l'espace créateur et la fiche PREMIUM des marques. */
export function CreatorStats({ dashboard, now }: { dashboard: CreatorDashboard; now: Date }) {
  const posts = dashboard.networks.flatMap((n) => n.posts);
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <KpiTabs all={dashboard.kpis} byPlatform={dashboard.kpisByPlatform} />
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Vues par semaine de publication">
          <ViewsChart data={viewsByWeek(posts, now)} />
        </Card>
        <Card title="Abonnés">
          <FollowersChart
            data={followersSeries(dashboard.networks)}
            platforms={dashboard.networks.map((n) => n.platform)}
          />
        </Card>
      </div>
      <Card title="Publications récentes">
        <PostsTable posts={posts} />
      </Card>
      <Card title="Audience">
        <AudiencePanel networks={dashboard.networks} />
      </Card>
    </div>
  );
}
