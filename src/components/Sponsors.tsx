import Image from "next/image";
import Link from "next/link";
import { MapPin, Sparkles } from "lucide-react";
import { GROUPS } from "@/lib/tournament/data";
import { getCourtSponsor } from "@/lib/sponsors";
import { cn } from "@/lib/utils";
import type { Group } from "@/lib/tournament/types";

type SponsorRibbonProps = {
  className?: string;
  dark?: boolean;
  title?: string;
  groups?: Group[];
};

export function SponsorRibbon({ className, dark = false, title = "Quadras oficiais", groups = GROUPS }: SponsorRibbonProps) {
  return (
    <section
      className={cn(
        "rounded-lg border p-3 shadow-sm",
        dark ? "border-white/10 bg-slate-950 text-white" : "border-slate-200 bg-white/80 text-slate-950 backdrop-blur",
        className,
      )}
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className={cn("flex items-center gap-2 text-xs font-black uppercase", dark ? "text-emerald-300" : "text-emerald-700")}>
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {title}
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
          {groups.map((group) => (
            <CourtSponsorMini key={group.id} group={group} dark={dark} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SponsorWall() {
  return (
    <section className="overflow-hidden rounded-lg bg-slate-950 p-5 text-white shadow-broadcast">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-300">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Quadras oficiais
          </div>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-normal">Patrocinadores por quadra</h2>
        </div>
        <div className="rounded-md bg-white/10 px-4 py-3 text-sm font-black uppercase text-emerald-100 ring-1 ring-white/10">
          8 quadras · 8 patrocinadores
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {GROUPS.map((group) => (
          <CourtSponsorCard key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
}

export function CourtSponsorBackdrop({ group, className }: { group: Group; className?: string }) {
  const sponsor = getCourtSponsor(group.id);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]", className)}>
      <Image
        src={sponsor.src}
        alt=""
        fill
        sizes="900px"
        className="object-contain p-5 opacity-25 sm:p-6"
        style={{ objectPosition: sponsor.imagePosition ?? "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-white/10" />
    </div>
  );
}

function CourtSponsorCard({ group }: { group: Group }) {
  const sponsor = getCourtSponsor(group.id);

  return (
    <Link
      href={`/atleta?grupo=${group.id}`}
      className={`group relative min-h-44 overflow-hidden rounded-lg bg-gradient-to-br ${group.theme.gradient} p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-broadcast`}
    >
      <CourtSponsorBackdrop group={group} />
      <div className="relative z-10 flex h-full min-h-36 flex-col justify-between">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-md bg-white/15 px-2.5 py-1 text-xs font-black uppercase text-white backdrop-blur">
            Quadra {group.number}
          </span>
          <span className="rounded-md bg-slate-950/40 px-2.5 py-1 text-xs font-black uppercase text-white backdrop-blur">
            Grupo {group.number}
          </span>
        </div>
        <div>
          <div className="text-3xl font-black uppercase leading-none tracking-normal text-white drop-shadow">{group.shortName}</div>
          <div className="mt-2 text-sm font-black uppercase text-white/85">{sponsor.name}</div>
        </div>
      </div>
    </Link>
  );
}

function CourtSponsorMini({ group, dark }: { group: Group; dark: boolean }) {
  const sponsor = getCourtSponsor(group.id);

  return (
    <div className={`relative h-16 overflow-hidden rounded-md bg-gradient-to-br ${group.theme.gradient} p-2 text-white shadow-sm`}>
      <Image
        src={sponsor.src}
        alt=""
        fill
        sizes="160px"
        className="object-contain p-2.5 opacity-[0.28]"
        style={{ objectPosition: sponsor.imagePosition ?? "center" }}
      />
      <div className={cn("absolute inset-0", dark ? "bg-slate-950/42" : "bg-slate-950/32")} />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="text-[10px] font-black uppercase text-white/80">Quadra {group.number}</div>
        <div className="truncate text-sm font-black uppercase tracking-normal">{group.shortName}</div>
      </div>
    </div>
  );
}
