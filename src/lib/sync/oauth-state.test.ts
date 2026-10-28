import { expect, test } from "vitest";
import { createState, parseStateCookie, stateCookieValue, verifyState } from "@/lib/sync/oauth-state";

test("createState : 32 octets aléatoires en base64url, jamais deux fois le même", () => {
  const a = createState();
  expect(a).toMatch(/^[A-Za-z0-9_-]{43}$/);
  expect(createState()).not.toBe(a);
});

test("verifyState : identiques → true ; différent, absent ou cookie vide → false", () => {
  const state = createState();
  expect(verifyState(state, state)).toBe(true);
  expect(verifyState(createState(), state)).toBe(false);
  expect(verifyState(null, state)).toBe(false);
  expect(verifyState(state, undefined)).toBe(false);
  expect(verifyState("", "")).toBe(false);
  expect(verifyState(state.slice(0, 10), state)).toBe(false);
});

test("le cookie garde le state et le mode choisi au départ", () => {
  const state = createState();
  expect(parseStateCookie(stateCookieValue(state, true))).toEqual({ state, simulated: true });
  expect(parseStateCookie(stateCookieValue(state, false))).toEqual({ state, simulated: false });
  expect(parseStateCookie(undefined)).toBeNull();
  expect(parseStateCookie("nimportequoi")).toBeNull();
});
