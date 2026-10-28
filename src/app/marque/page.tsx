import { requireRole } from "@/lib/session";

export default async function BrandCreatorsPage() {
  const user = await requireRole("BRAND");
  return <h1 className="display text-3xl font-extrabold">Bonjour {user.name}</h1>;
}
