import { describe, expect, test } from "vitest";
import { generateMockCreators } from "@/lib/data/mock/generate";
import { computeCombinedKpis } from "@/lib/kpi";

const now = new Date("2026-10-26T12:00:00Z");

describe("generateMockCreators", () => {
  const creators = generateMockCreators(now);

  test("renvoie 8 créateurs c1…c8", () => {
    expect(creators.map((c) => c.creatorId)).toEqual(["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"]);
  });

  test("est déterministe pour un même instant", () => {
    expect(generateMockCreators(now)).toEqual(creators);
  });

  test("couvre les cas limites utiles à l'interface", () => {
    const tiktokOnly = creators.filter((c) => c.networks.every((n) => n.platform === "TIKTOK"));
    expect(tiktokOnly.length).toBeGreaterThan(0);
    expect(tiktokOnly.every((c) => c.networks.every((n) => n.audience === null))).toBe(true);

    expect(creators.some((c) => computeCombinedKpis(c.networks, now).posts30d === 0)).toBe(true);
    expect(creators.some((c) => c.networks.some((n) => n.snapshots.length === 1))).toBe(true);
    expect(creators.some((c) => c.networks.some((n) => n.platform === "INSTAGRAM" && n.audience === null))).toBe(true);
  });

  test("relevés triés par date croissante et données cohérentes", () => {
    for (const creator of creators) {
      for (const network of creator.networks) {
        const times = network.snapshots.map((s) => s.date.getTime());
        expect(times).toEqual([...times].sort((a, b) => a - b));
        for (const post of network.posts) {
          expect(post.platform).toBe(network.platform);
          expect(post.publishedAt.getTime()).toBeLessThanOrEqual(now.getTime());
          if (network.platform === "TIKTOK") expect(post.saves).toBeNull();
        }
      }
    }
  });
});
