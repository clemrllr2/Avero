import { describe, expect, test } from "vitest";
import { createCreatorData, type CreatorSourceLoader } from "@/lib/data/creator-data";
import { generateMockCreators } from "@/lib/data/mock/generate";

// Source de test : les créateurs d'exemple, filtrés comme le fait la base.
const calls: (string[] | undefined)[] = [];
const loadMock: CreatorSourceLoader = async (where) => {
  calls.push(where?.creatorIds);
  return generateMockCreators(new Date())
    .filter((c) => c.networks.length > 0)
    .filter((c) => !where?.creatorIds || where.creatorIds.includes(c.creatorId));
};

const { getCreatorDashboard, getCreatorDetailForBrand, getCreatorsForComparison, listCreatorsForBrand } =
  createCreatorData(loadMock);

describe("couche de données", () => {
  test("le tableau de bord du créateur c1 existe", async () => {
    const dashboard = await getCreatorDashboard("c1");
    expect(dashboard?.creatorId).toBe("c1");
    expect(dashboard?.networks.length).toBeGreaterThan(0);
  });

  test("le tableau de bord ne charge que le créateur demandé", async () => {
    calls.length = 0;
    await getCreatorDashboard("c2");
    expect(calls).toEqual([["c2"]]);
  });

  test("créateur inconnu → null", async () => {
    expect(await getCreatorDashboard("inconnu")).toBeNull();
  });

  test("la liste FREE ne contient aucun KPI BASIC", async () => {
    const rows = await listCreatorsForBrand("FREE", { sort: "views30d", order: "desc" });
    expect(rows.length).toBe(8);
    for (const r of rows) expect(r).not.toHaveProperty("followers");
  });

  test("fiche détaillée réservée au PREMIUM, sans charger de données sinon", async () => {
    calls.length = 0;
    expect(await getCreatorDetailForBrand("FREE", "c1")).toBeNull();
    expect(await getCreatorDetailForBrand("BASIC", "c1")).toBeNull();
    expect(calls).toEqual([]);
    expect((await getCreatorDetailForBrand("PREMIUM", "c1"))?.creatorId).toBe("c1");
  });

  test("comparaison réservée au PREMIUM, 4 créateurs max, sans doublon, dans l'ordre demandé", async () => {
    calls.length = 0;
    expect(await getCreatorsForComparison("BASIC", ["c1", "c2"])).toEqual([]);
    expect(calls).toEqual([]);
    const compared = await getCreatorsForComparison("PREMIUM", ["c3", "c1", "c1", "x", "c2", "c4", "c5"]);
    expect(compared.map((c) => c.creatorId)).toEqual(["c3", "c1", "c2", "c4"]);
  });
});
