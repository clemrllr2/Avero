import { Avatar } from "@/components/visual/Avatar";
import { Icon } from "@/components/visual/Icon";
import { PostThumb } from "@/components/visual/PostThumb";
import { RadialGauge } from "@/components/visual/RadialGauge";
import { Sparkline } from "@/components/visual/Sparkline";

const VIEWS_SPARK = [22, 30, 26, 41, 38, 52, 61, 74];

/** Écran de démonstration affiché dans le téléphone (hero, pages de connexion) : un tableau de bord créateur. */
export function PhoneDashboard() {
  return (
    <div className="flex size-full flex-col gap-3 bg-paper px-3.5 pt-11 pb-4 text-[11px]" aria-hidden>
      <div className="flex items-center gap-2.5">
        <Avatar name="Léa Martin" size="sm" />
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] text-muted">Bonjour</span>
          <span className="display text-[13px] font-bold">Léa Martin</span>
        </div>
        <span className="ml-auto flex gap-1">
          <span className="grid size-5 place-items-center rounded-full bg-instagram/12 text-instagram">
            <Icon name="instagram" className="size-3" />
          </span>
          <span className="grid size-5 place-items-center rounded-full bg-tiktok/12 text-tiktok">
            <Icon name="tiktok" className="size-3" />
          </span>
        </span>
      </div>

      <div className="relative isolate overflow-hidden rounded-2xl bg-night p-3 text-paper">
        <div aria-hidden className="absolute -top-8 -right-6 -z-10 size-24 rounded-full bg-violet/60 blur-2xl" />
        <div aria-hidden className="absolute -bottom-10 -left-6 -z-10 size-24 rounded-full bg-cobalt/70 blur-2xl" />
        <span className="text-[10px] text-paper/70">Vues sur 30 jours</span>
        <span className="display text-gradient block text-[26px] leading-tight font-extrabold">1,8 M</span>
        <Sparkline values={VIEWS_SPARK} color="#b9a6ff" className="mt-1 h-8 w-full" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1 rounded-xl bg-surface p-2.5 shadow-sm">
          <span className="grid size-5 place-items-center rounded-md bg-cobalt/10 text-cobalt">
            <Icon name="users" className="size-3" />
          </span>
          <span className="display text-[15px] font-bold">174 k</span>
          <span className="text-[9px] text-muted">Abonnés</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-surface p-2.5 shadow-sm">
          <RadialGauge value={0.64} size={36}>
            <span className="display text-[9px] font-bold">6,4</span>
          </RadialGauge>
          <span className="text-[9px] leading-tight text-muted">Taux d&apos;engagement</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {["lea-1", "lea-2", "lea-3"].map((seed, i) => (
          <PostThumb key={seed} seed={seed} views={[412_000, 1_240_000, 286_000][i]} className="rounded-lg !shadow-none [&_.display]:text-[10px]" />
        ))}
      </div>
    </div>
  );
}
