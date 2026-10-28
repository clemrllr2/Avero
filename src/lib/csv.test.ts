import { describe, expect, test } from "vitest";
import type { CreatorRow } from "@/lib/creator-query";
import { CSV_HEADERS, toCsv } from "@/lib/csv";

const row: CreatorRow = {
  creatorId: "c1",
  displayName: "Léa Martin",
  avatarUrl: null,
  platforms: ["INSTAGRAM", "TIKTOK"],
  lastSyncedAt: new Date("2026-10-26T10:00:00Z"),
  views30d: 1234567,
  followers: 174000,
  avgViewsPerPost: 57890.4,
  engagementRate: 0.0625,
  posts30d: 20,
  followerGrowth30d: 1200,
};

const lines = (csv: string) => csv.replace(/^﻿/, "").split("\r\n");

describe("toCsv", () => {
  test("commence par le BOM UTF-8 puis les en-têtes exacts", () => {
    const csv = toCsv([]);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(lines(csv)[0]).toBe(
      "Créateur;Réseaux;Vues (30 j);Abonnés;Vues moyennes;Taux d'engagement;Publications (30 j);Évolution abonnés (30 j);Mis à jour le",
    );
    expect(CSV_HEADERS).toHaveLength(9);
  });

  test("une ligne par créateur, valeurs lisibles dans Excel", () => {
    expect(lines(toCsv([row]))[1]).toBe(
      "Léa Martin;Instagram, TikTok;1234567;174000;57890;6,3 %;20;1200;26/10/2026",
    );
  });

  test("les valeurs contenant ; ou \" sont entourées de guillemets", () => {
    const tricky = { ...row, displayName: 'Maison "Lumière";Paris' };
    expect(lines(toCsv([tricky]))[1].startsWith('"Maison ""Lumière"";Paris";')).toBe(true);
  });

  test("valeurs absentes ou null → cellules vides", () => {
    const partial: CreatorRow = { ...row, engagementRate: null, followerGrowth30d: undefined };
    expect(lines(toCsv([partial]))[1]).toBe("Léa Martin;Instagram, TikTok;1234567;174000;57890;;20;;26/10/2026");
  });
});
