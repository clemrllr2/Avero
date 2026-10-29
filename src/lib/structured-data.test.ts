import { expect, test } from "vitest";
import { FAQ_ITEMS } from "@/lib/landing-content";
import { PLAN_MONTHLY_PRICE_EUR } from "@/lib/plans";
import { homeJsonLd, serializeJsonLd } from "@/lib/structured-data";

const graph = homeJsonLd("https://avero.test")["@graph"];
const byType = (type: string) => graph.find((node) => node["@type"] === type);

test("organisation, site, logiciel et FAQ décrits pour les moteurs de recherche", () => {
  expect(graph.map((node) => node["@type"])).toEqual(["Organization", "WebSite", "SoftwareApplication", "FAQPage"]);
  expect(byType("Organization")).toMatchObject({ name: "AVERO", url: "https://avero.test/" });
});

test("les prix du logiciel viennent des plans (une seule source de vérité)", () => {
  const offers = byType("SoftwareApplication")?.offers as { name: string; price: string; priceCurrency: string }[];
  expect(offers.map((o) => [o.name, o.price, o.priceCurrency])).toEqual([
    ["Free", String(PLAN_MONTHLY_PRICE_EUR.FREE), "EUR"],
    ["Basic", String(PLAN_MONTHLY_PRICE_EUR.BASIC), "EUR"],
    ["Premium", String(PLAN_MONTHLY_PRICE_EUR.PREMIUM), "EUR"],
  ]);
});

test("la FAQ balisée reprend exactement les questions affichées", () => {
  const faq = byType("FAQPage")?.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
  expect(faq.map((q) => q.name)).toEqual(FAQ_ITEMS.map((item) => item.question));
  expect(faq[0].acceptedAnswer.text).toBe(FAQ_ITEMS[0].answer);
});

test("sérialisation sûre : « < » neutralisé pour ne jamais fermer la balise script", () => {
  expect(serializeJsonLd({ text: "</script><script>alert(1)</script>" })).not.toContain("<");
});
