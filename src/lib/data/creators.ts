import { createCreatorData } from "@/lib/data/creator-data";
import { loadCreatorSources } from "@/lib/data/load";

// Les pages lisent les créateurs dans la base (Supabase), via Prisma.
export const { getCreatorDashboard, listCreatorsForBrand, getCreatorDetailForBrand, getCreatorsForComparison } =
  createCreatorData(loadCreatorSources);
