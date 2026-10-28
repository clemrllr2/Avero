import { describe, expect, test } from "vitest";
import {
  getCreatorDashboard,
  getCreatorDetailForBrand,
  getCreatorsForComparison,
  listCreatorsForBrand,
} from "@/lib/data/creators";

describe("couche de données (mode démo)", () => {
  test("le tableau de bord du créateur démo c1 existe", async () => {
    const dashboard = await getCreatorDashboard("c1");
    expect(dashboard?.creatorId).toBe("c1");
    expect(dashboard?.networks.length).toBeGreaterThan(0);
  });

  test("créateur inconnu → null", async () => {
    expect(await getCreatorDashboard("inconnu")).toBeNull();
  });

  test("la liste FREE ne contient aucun KPI BASIC", async () => {
    const rows = await listCreatorsForBrand("FREE", { sort: "views30d", order: "desc" });
    expect(rows.length).toBe(8);
    for (const r of rows) expect(r).not.toHaveProperty("followers");
  });

  test("fiche détaillée réservée au PREMIUM", async () => {
    expect(await getCreatorDetailForBrand("FREE", "c1")).toBeNull();
    expect(await getCreatorDetailForBrand("BASIC", "c1")).toBeNull();
    expect((await getCreatorDetailForBrand("PREMIUM", "c1"))?.creatorId).toBe("c1");
  });

  test("comparaison réservée au PREMIUM, 4 créateurs max, sans doublon", async () => {
    expect(await getCreatorsForComparison("BASIC", ["c1", "c2"])).toEqual([]);
    const compared = await getCreatorsForComparison("PREMIUM", ["c1", "c1", "c2", "x", "c3", "c4", "c5"]);
    expect(compared.map((c) => c.creatorId)).toEqual(["c1", "c2", "c3", "c4"]);
  });
});
