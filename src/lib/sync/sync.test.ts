import { expect, test } from "vitest";
import {
  AUTO_REFRESH_MIN_MS,
  MANUAL_REFRESH_MIN_MS,
  followerSnapshots,
  isSyncDue,
  manualRefreshMinMs,
} from "@/lib/sync/sync-rules";

const NOW = new Date("2026-10-28T12:00:00Z");
const MIN = 60 * 1000;

test("isSyncDue : jamais synchronisé → true ; il y a 4 min avec un minimum de 5 min → false ; il y a 6 min → true", () => {
  expect(isSyncDue(null, NOW, MANUAL_REFRESH_MIN_MS)).toBe(true);
  expect(isSyncDue(new Date(NOW.getTime() - 4 * MIN), NOW, MANUAL_REFRESH_MIN_MS)).toBe(false);
  expect(isSyncDue(new Date(NOW.getTime() - 6 * MIN), NOW, MANUAL_REFRESH_MIN_MS)).toBe(true);
  expect(isSyncDue(new Date(NOW.getTime() - 23 * 60 * MIN), NOW, AUTO_REFRESH_MIN_MS)).toBe(false);
  expect(isSyncDue(new Date(NOW.getTime() - 25 * 60 * MIN), NOW, AUTO_REFRESH_MIN_MS)).toBe(true);
});

test("délai entre deux actualisations manuelles : 5 min en réel, 10 s en simulé", () => {
  expect(manualRefreshMinMs(false)).toBe(5 * MIN);
  expect(manualRefreshMinMs(true)).toBe(10 * 1000);
});

test("followerSnapshots : relevé du jour seul quand le réseau ne donne pas d'historique", () => {
  expect(followerSnapshots({ followers: 1200 }, NOW)).toEqual([{ date: new Date("2026-10-28T00:00:00Z"), followers: 1200 }]);
});

test("followerSnapshots : historique ramené au jour, un relevé par jour, celui du jour = abonnés actuels", () => {
  const history = [
    { date: new Date("2026-10-01T09:00:00Z"), followers: 900 },
    { date: new Date("2026-10-01T18:00:00Z"), followers: 950 },
    { date: new Date("2026-10-28T08:00:00Z"), followers: 1100 },
  ];
  expect(followerSnapshots({ followers: 1200, followerHistory: history }, NOW)).toEqual([
    { date: new Date("2026-10-01T00:00:00Z"), followers: 950 },
    { date: new Date("2026-10-28T00:00:00Z"), followers: 1200 },
  ]);
});
