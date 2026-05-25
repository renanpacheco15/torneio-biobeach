import type { CourtStatus } from "@/lib/tournament/types";

export type CourtDefinition = {
  id: string;
  number: number;
  label: string;
  sponsor: string;
  groupNumber?: number;
  color: string;
  logo?: string;
  reserve?: boolean;
};

export const COURTS: CourtDefinition[] = [
  { id: "court-1", number: 1, label: "Quadra 1", sponsor: "Omega", groupNumber: 1, color: "from-blue-700 via-blue-600 to-sky-500", logo: "/sponsors/colegio-omega-clean.png" },
  { id: "court-2", number: 2, label: "Quadra 2", sponsor: "Amaro", groupNumber: 2, color: "from-orange-700 via-orange-500 to-amber-400", logo: "/sponsors/amaro-clean.png" },
  { id: "court-3", number: 3, label: "Quadra 3", sponsor: "Tintas Santa Terezinha", groupNumber: 3, color: "from-red-800 via-red-600 to-rose-500", logo: "/sponsors/tintas-santa-terezinha-clean.png" },
  { id: "court-4", number: 4, label: "Quadra 4", sponsor: "Sicoob", groupNumber: 4, color: "from-emerald-800 via-green-600 to-lime-400", logo: "/sponsors/sicoob-creditosudeste-clean.png" },
  { id: "court-5", number: 5, label: "Quadra 5", sponsor: "Faminas", groupNumber: 5, color: "from-sky-900 via-cyan-700 to-cyan-400", logo: "/sponsors/faminas-clean.png" },
  { id: "court-6", number: 6, label: "Quadra 6", sponsor: "Jerônimo Joias", groupNumber: 6, color: "from-zinc-900 via-zinc-700 to-zinc-400", logo: "/sponsors/jeronimo-joias-clean.png" },
  { id: "court-7", number: 7, label: "Quadra 7", sponsor: "Óticas Jerônimo", groupNumber: 7, color: "from-gray-950 via-red-950 to-rose-700", logo: "/sponsors/oticas-jeronimo-clean.png" },
  { id: "court-8", number: 8, label: "Quadra 8", sponsor: "Dr. Hélcio", groupNumber: 8, color: "from-yellow-900 via-amber-600 to-yellow-300", logo: "/sponsors/dr-helcio-rabelo-clean.png" },
  {
    id: "court-9",
    number: 9,
    label: "Quadra 9 Livre",
    sponsor: "Livre",
    color: "from-blue-800 via-blue-600 to-sky-400",
    logo: "/logos/quadra-9-livre.svg",
    reserve: true,
  },
];

export const DEFAULT_COURT_STATUSES: Record<string, CourtStatus> = COURTS.reduce(
  (statuses, court) => ({
    ...statuses,
    [court.id]: court.reserve ? "disabled" : "active",
  }),
  {} as Record<string, CourtStatus>,
);

export const DEFAULT_LIVE_STREAMS: Record<string, string> = COURTS.reduce(
  (streams, court) => ({
    ...streams,
    [court.id]: "",
  }),
  {} as Record<string, string>,
);

export function getCourtStatusLabel(status: CourtStatus): string {
  if (status === "active") return "Ativa";
  if (status === "unavailable") return "Indisponível";
  return "Desativada";
}
