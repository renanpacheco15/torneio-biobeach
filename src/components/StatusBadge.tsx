import { CheckCircle2, Clock3, Radio } from "lucide-react";
import type { MatchStatus } from "@/lib/tournament/types";

const statusMap = {
  pending: {
    label: "Pendente",
    className: "bg-white/10 text-slate-200 border-white/10",
    icon: Clock3,
  },
  live: {
    label: "Em andamento",
    className: "bg-red-500/15 text-red-100 border-red-400/30 shadow-[0_0_16px_rgba(239,68,68,0.16)]",
    icon: Radio,
  },
  finished: {
    label: "Finalizado",
    className: "bg-emerald-400/10 text-emerald-100 border-emerald-300/30",
    icon: CheckCircle2,
  },
} satisfies Record<MatchStatus, { label: string; className: string; icon: typeof Clock3 }>;

export function StatusBadge({ status }: { status: MatchStatus }) {
  const current = statusMap[status];
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-black uppercase ${current.className}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {current.label}
    </span>
  );
}
