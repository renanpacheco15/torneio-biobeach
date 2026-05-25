import { CheckCircle2, Clock3, Radio } from "lucide-react";
import type { MatchStatus } from "@/lib/tournament/types";

const statusMap = {
  pending: {
    label: "Pendente",
    className: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock3,
  },
  live: {
    label: "Em andamento",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: Radio,
  },
  finished: {
    label: "Finalizado",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
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
