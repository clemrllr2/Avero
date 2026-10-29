"use client";

import { useState } from "react";
import { engagementRates, parseCount } from "@/lib/engagement-calculator";

const FIELDS = [
  { key: "views", label: "Vues", hint: "Vues moyennes par publication" },
  { key: "likes", label: "Likes", hint: "Likes moyens par publication" },
  { key: "comments", label: "Commentaires", hint: "Commentaires moyens par publication" },
  { key: "shares", label: "Partages", hint: "Partages moyens par publication" },
  { key: "followers", label: "Abonnés", hint: "Nombre d'abonnés du compte" },
] as const;

type Key = (typeof FIELDS)[number]["key"];

const PERCENT = new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 2 });
const NUMBER = new Intl.NumberFormat("fr-FR");

/** Calcul en direct, dans le navigateur : rien n'est envoyé ni enregistré. */
export function EngagementCalculator() {
  const [values, setValues] = useState<Record<Key, string>>({ views: "", likes: "", comments: "", shares: "", followers: "" });
  const n = (key: Key) => parseCount(values[key]);
  const rates = engagementRates({ followers: n("followers"), views: n("views"), likes: n("likes"), comments: n("comments"), shares: n("shares") });
  const ready = rates.interactions > 0;

  return (
    <div className="grid gap-6 rounded-[28px] border border-line bg-surface p-6 shadow-[0_40px_90px_-50px_rgba(15,16,48,0.45)] sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} aria-label="Chiffres de la publication">
        {FIELDS.map((field) => (
          <label key={field.key} className={`flex flex-col gap-1.5 ${field.key === "followers" ? "sm:col-span-2" : ""}`}>
            <span className="text-sm font-medium">{field.label}</span>
            <input
              inputMode="decimal"
              autoComplete="off"
              placeholder="0"
              value={values[field.key]}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className="rounded-[10px] border border-line bg-surface px-3.5 py-3 text-[17px] tabular-nums outline-none focus:border-cobalt"
            />
            <span className="text-xs text-muted">{field.hint}</span>
          </label>
        ))}
        <p className="text-xs text-muted sm:col-span-2">Vous pouvez écrire « 12 400 », « 12k » ou « 1,5 M ».</p>
      </form>

      <div aria-live="polite" className="flex flex-col justify-center gap-5 rounded-2xl bg-night p-6 text-paper">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-paper/60">Engagement par vues</span>
          <span className="display text-[44px] leading-none font-extrabold tabular-nums">
            {ready && rates.byViews !== null ? PERCENT.format(rates.byViews) : "—"}
          </span>
          <span className="text-xs text-paper/50">La méthode utilisée par AVERO</span>
        </div>
        <div className="flex flex-col gap-1 border-t border-paper/10 pt-5">
          <span className="text-sm text-paper/60">Engagement par abonnés</span>
          <span className="display text-[32px] leading-none font-bold tabular-nums">
            {ready && rates.byFollowers !== null ? PERCENT.format(rates.byFollowers) : "—"}
          </span>
        </div>
        <p className="text-sm text-paper/60">
          {ready ? `${NUMBER.format(rates.interactions)} interactions par publication.` : "Saisissez au moins les vues et les likes."}
        </p>
      </div>
    </div>
  );
}
