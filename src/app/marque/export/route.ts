import { connection } from "next/server";
import { parseListQuery } from "@/lib/creator-query";
import { toCsv } from "@/lib/csv";
import { listCreatorsForBrand } from "@/lib/data/creators";
import { canAccess } from "@/lib/plans";
import { getCurrentUser } from "@/lib/session";

/** Export CSV de la liste des créateurs : réservé au plan PREMIUM (403 sinon). */
export async function GET(request: Request) {
  const user = await getCurrentUser();
  await connection();
  if (!user || user.role !== "BRAND") {
    return new Response("Connexion marque requise.", { status: 401 });
  }
  const plan = user.plan ?? "FREE";
  if (!canAccess(plan, "exportCsv")) {
    return new Response("L'export CSV est disponible avec le plan Premium.", { status: 403 });
  }

  const params = Object.fromEntries(new URL(request.url).searchParams);
  const rows = await listCreatorsForBrand(plan, parseListQuery(params));
  return new Response(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="avero-createurs.csv"',
      "Cache-Control": "no-store",
    },
  });
}
