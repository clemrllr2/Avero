import { PLATFORM_NAMES } from "@/components/ui/PlatformBadge";
import { Icon, type IconName } from "@/components/visual/Icon";
import { PostThumb } from "@/components/visual/PostThumb";
import { formatCompact, formatDate } from "@/lib/format";
import type { PostData } from "@/lib/types";

const MAX_ROWS = 12;

function Metric({ icon, label, value }: { icon: IconName; label: string; value: number | null }) {
  if (value === null) return null;
  return (
    <div title={label}>
      <dt className="sr-only">{label}</dt>
      <dd className="flex items-center gap-1.5 font-semibold">
        <Icon name={icon} className="size-3.5 shrink-0 text-muted" />
        {formatCompact(value)}
      </dd>
    </div>
  );
}

/**
 * Publications les plus récentes en cartes : vignette avec les vues, puis likes, commentaires, partages
 * (enregistrements et portée : Instagram uniquement).
 */
export function PostsTable({ posts }: { posts: PostData[] }) {
  const recent = [...posts].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()).slice(0, MAX_ROWS);
  if (recent.length === 0) return <p className="text-muted">Aucune publication pour le moment.</p>;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {recent.map((post) => (
        <li
          key={`${post.platform}-${post.externalId}`}
          className="flex gap-4 rounded-2xl border border-line bg-paper/60 p-3 transition-colors hover:border-cobalt/30 hover:bg-surface"
        >
          <PostThumb
            seed={`${post.platform}-${post.externalId}`}
            views={post.views}
            platform={post.platform}
            className="w-[92px] shrink-0 rounded-xl [&_.display]:text-xs"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2 py-1">
            <p className="line-clamp-2 text-sm font-medium">{post.caption ?? "Sans légende"}</p>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Icon name={post.platform === "INSTAGRAM" ? "instagram" : "tiktok"} className={`size-3.5 ${post.platform === "INSTAGRAM" ? "text-instagram" : "text-tiktok"}`} />
                {PLATFORM_NAMES[post.platform]}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="calendar" className="size-3.5" />
                {formatDate(post.publishedAt)}
              </span>
            </p>
            <dl className="mt-auto grid grid-cols-3 gap-x-3 gap-y-1.5 text-xs tabular-nums">
              <Metric icon="heart" label="Likes" value={post.likes} />
              <Metric icon="chat" label="Commentaires" value={post.comments} />
              <Metric icon="share" label="Partages" value={post.shares} />
              <Metric icon="bookmark" label="Enregistrements" value={post.saves} />
              <Metric icon="eye" label="Portée" value={post.reach} />
            </dl>
          </div>
        </li>
      ))}
    </ul>
  );
}
