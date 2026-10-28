import { requireRole } from "@/lib/session";

export default async function CreatorDashboardPage() {
  const user = await requireRole("CREATOR");
  return <h1 className="display text-3xl font-extrabold">Bonjour {user.name}</h1>;
}
