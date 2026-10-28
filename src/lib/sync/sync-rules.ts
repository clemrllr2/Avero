import type { FollowerSnapshot } from "@/lib/types";
import type { FetchedAccount } from "@/lib/sync/types";

/** Bouton « Actualiser » : ignoré si la dernière synchro date de moins de 5 minutes (quotas des API). */
export const MANUAL_REFRESH_MIN_MS = 5 * 60 * 1000;
/** Connexion simulée : pas de quota, 10 secondes suffisent (permet de tester les scénarios « plus tard »). */
export const SIMULATED_MANUAL_REFRESH_MIN_MS = 10 * 1000;
/** Ouverture du tableau de bord : synchro automatique si les données ont plus de 24 heures. */
export const AUTO_REFRESH_MIN_MS = 24 * 60 * 60 * 1000;
/** Publications relues à chaque synchro. */
export const SYNC_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function isSyncDue(lastSyncedAt: Date | null, now: Date, minAgeMs: number): boolean {
  return lastSyncedAt === null || now.getTime() - lastSyncedAt.getTime() >= minAgeMs;
}

export function manualRefreshMinMs(simulated: boolean): number {
  return simulated ? SIMULATED_MANUAL_REFRESH_MIN_MS : MANUAL_REFRESH_MIN_MS;
}

/** Jour (UTC, sans l'heure), comme la colonne « date » des relevés. */
export function utcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** Relevés d'abonnés à enregistrer : l'historique fourni (un par jour) puis celui du jour, triés par date. */
export function followerSnapshots(
  account: Pick<FetchedAccount, "followers" | "followerHistory">,
  now: Date,
): FollowerSnapshot[] {
  const byDay = new Map<number, number>();
  for (const snapshot of account.followerHistory ?? []) byDay.set(utcDay(snapshot.date).getTime(), snapshot.followers);
  byDay.set(utcDay(now).getTime(), account.followers);
  return [...byDay.entries()].sort(([a], [b]) => a - b).map(([time, followers]) => ({ date: new Date(time), followers }));
}
