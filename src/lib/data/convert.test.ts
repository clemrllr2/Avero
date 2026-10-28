import { describe, expect, test } from "vitest";
import { parseBreakdowns, toCreatorSource, type CreatorProfileRow } from "@/lib/data/convert";

const d = (iso: string) => new Date(iso);

function profile(overrides: Partial<CreatorProfileRow["connections"][number]> = {}): CreatorProfileRow {
  return {
    id: "prof_1",
    userId: "user_1",
    displayName: "Léa Martin",
    createdAt: d("2026-09-01T00:00:00Z"),
    connections: [
      {
        id: "conn_1",
        creatorId: "prof_1",
        platform: "INSTAGRAM",
        externalUserId: "ig_1",
        username: "lea.martin",
        avatarUrl: "https://exemple.test/a.jpg",
        accessToken: "chiffré",
        refreshToken: null,
        tokenExpiresAt: null,
        status: "ACTIVE",
        lastSyncedAt: d("2026-10-27T10:00:00Z"),
        createdAt: d("2026-09-01T00:00:00Z"),
        snapshots: [
          { id: "s2", connectionId: "conn_1", date: d("2026-10-20T00:00:00Z"), followers: 1200 },
          { id: "s1", connectionId: "conn_1", date: d("2026-10-01T00:00:00Z"), followers: 1000 },
        ],
        posts: [
          {
            id: "p1",
            connectionId: "conn_1",
            externalId: "ext_1",
            publishedAt: d("2026-10-25T08:00:00Z"),
            caption: "Bonjour",
            thumbnailUrl: null,
            permalink: "https://instagram.com/p/1",
            views: 500,
            likes: 40,
            comments: 3,
            shares: 2,
            saves: 5,
            reach: 400,
          },
        ],
        audience: {
          id: "a1",
          connectionId: "conn_1",
          ages: [{ label: "18-24", count: 300 }],
          genders: [{ label: "F", count: 700 }],
          countries: [{ label: "FR", count: 900 }],
          updatedAt: d("2026-10-27T10:00:00Z"),
        },
        ...overrides,
      },
    ],
  };
}

describe("toCreatorSource", () => {
  test("convertit un profil et sa connexion au format des pages", () => {
    const source = toCreatorSource(profile());
    expect(source.creatorId).toBe("prof_1");
    expect(source.displayName).toBe("Léa Martin");
    expect(source.networks).toHaveLength(1);

    const network = source.networks[0];
    expect(network).toMatchObject({
      platform: "INSTAGRAM",
      username: "lea.martin",
      avatarUrl: "https://exemple.test/a.jpg",
      status: "ACTIVE",
      lastSyncedAt: d("2026-10-27T10:00:00Z"),
    });
    expect(network.posts[0]).toEqual({
      externalId: "ext_1",
      platform: "INSTAGRAM",
      publishedAt: d("2026-10-25T08:00:00Z"),
      caption: "Bonjour",
      thumbnailUrl: null,
      permalink: "https://instagram.com/p/1",
      views: 500,
      likes: 40,
      comments: 3,
      shares: 2,
      saves: 5,
      reach: 400,
    });
    expect(network.audience).toEqual({
      ages: [{ label: "18-24", count: 300 }],
      genders: [{ label: "F", count: 700 }],
      countries: [{ label: "FR", count: 900 }],
    });
  });

  test("les relevés d'abonnés sont triés par date croissante", () => {
    const { snapshots } = toCreatorSource(profile()).networks[0];
    expect(snapshots.map((s) => s.followers)).toEqual([1000, 1200]);
  });

  test("jamais synchronisé → date de connexion à la place de la dernière mise à jour", () => {
    const network = toCreatorSource(profile({ lastSyncedAt: null })).networks[0];
    expect(network.lastSyncedAt).toEqual(d("2026-09-01T00:00:00Z"));
  });

  test("sans audience enregistrée → null", () => {
    expect(toCreatorSource(profile({ audience: null })).networks[0].audience).toBeNull();
  });
});

describe("parseBreakdowns", () => {
  test("ignore les entrées mal formées du JSON", () => {
    expect(
      parseBreakdowns([
        { label: "FR", count: 10 },
        { label: "BE" },
        { label: 3, count: 2 },
        { label: "CH", count: Number.NaN },
        null,
        "texte",
      ]),
    ).toEqual([{ label: "FR", count: 10 }]);
  });

  test("autre chose qu'une liste → liste vide", () => {
    expect(parseBreakdowns({ FR: 10 })).toEqual([]);
    expect(parseBreakdowns(null)).toEqual([]);
  });
});
