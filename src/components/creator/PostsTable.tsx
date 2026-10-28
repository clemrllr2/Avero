import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { formatDate, formatNumber } from "@/lib/format";
import type { PostData } from "@/lib/types";

const MAX_ROWS = 12;

const optional = (n: number | null) => (n === null ? "—" : formatNumber(n));

/** Publications les plus récentes, avec leurs statistiques (enregistrements et portée : Instagram uniquement). */
export function PostsTable({ posts }: { posts: PostData[] }) {
  const recent = [...posts].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()).slice(0, MAX_ROWS);
  if (recent.length === 0) return <p className="text-muted">Aucune publication pour le moment.</p>;

  return (
    <div className="-mx-5 overflow-x-auto sm:-mx-6">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-muted">
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">Publication</th>
            <th scope="col" className="px-3 py-3 font-medium">Date</th>
            {["Vues", "Likes", "Commentaires", "Partages", "Enregistr.", "Portée"].map((h) => (
              <th key={h} scope="col" className="px-3 py-3 text-right font-medium last:pr-5 sm:last:pr-6">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {recent.map((post) => (
            <tr key={`${post.platform}-${post.externalId}`} className="border-b border-line last:border-0">
              <th scope="row" className="px-5 py-3 font-normal sm:px-6">
                <span className="flex items-center gap-3">
                  <PlatformBadge platform={post.platform} />
                  <span className="max-w-[24ch] truncate">{post.caption ?? "Sans légende"}</span>
                </span>
              </th>
              <td className="px-3 py-3 whitespace-nowrap text-muted">{formatDate(post.publishedAt)}</td>
              <td className="px-3 py-3 text-right font-semibold">{formatNumber(post.views)}</td>
              <td className="px-3 py-3 text-right">{formatNumber(post.likes)}</td>
              <td className="px-3 py-3 text-right">{formatNumber(post.comments)}</td>
              <td className="px-3 py-3 text-right">{formatNumber(post.shares)}</td>
              <td className="px-3 py-3 text-right">{optional(post.saves)}</td>
              <td className="px-3 py-3 pr-5 text-right sm:pr-6">{optional(post.reach)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
