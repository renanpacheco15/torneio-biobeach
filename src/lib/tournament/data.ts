import type {
  Group,
  GroupId,
  GroupMatch,
  KnockoutMatch,
  Pair,
  TournamentState,
} from "./types";
import { DEFAULT_COURT_STATUSES, DEFAULT_LIVE_STREAMS } from "@/lib/courts";

export const GROUPS: Group[] = [
  {
    id: "G1",
    number: 1,
    slug: "omega",
    court: "Quadra 1",
    name: "OMEGA",
    sponsor: "Colégio Omega",
    shortName: "Omega",
    theme: {
      primary: "#0757d8",
      secondary: "#073073",
      accent: "#3b82f6",
      soft: "#eaf2ff",
      text: "#082f6f",
      border: "#bfdbfe",
      gradient: "from-blue-700 via-blue-600 to-sky-500",
    },
  },
  {
    id: "G2",
    number: 2,
    slug: "amaro",
    court: "Quadra 2",
    name: "AMARO",
    sponsor: "Amaro",
    shortName: "Amaro",
    theme: {
      primary: "#f97316",
      secondary: "#7c2d12",
      accent: "#fb923c",
      soft: "#fff3e7",
      text: "#8a3412",
      border: "#fed7aa",
      gradient: "from-orange-700 via-orange-500 to-amber-400",
    },
  },
  {
    id: "G3",
    number: 3,
    slug: "santa-terezinha",
    court: "Quadra 3",
    name: "SANTA TEREZINHA",
    sponsor: "Tintas Santa Terezinha",
    shortName: "Santa Terezinha",
    theme: {
      primary: "#dc2626",
      secondary: "#7f1d1d",
      accent: "#ef4444",
      soft: "#fff1f2",
      text: "#991b1b",
      border: "#fecaca",
      gradient: "from-red-800 via-red-600 to-rose-500",
    },
  },
  {
    id: "G4",
    number: 4,
    slug: "sicoob",
    court: "Quadra 4",
    name: "SICOOB CREDISUDESTE",
    sponsor: "Sicoob Credisudeste",
    shortName: "Sicoob",
    theme: {
      primary: "#16803d",
      secondary: "#064e3b",
      accent: "#8bc53f",
      soft: "#edfdf4",
      text: "#065f46",
      border: "#bbf7d0",
      gradient: "from-emerald-800 via-green-600 to-lime-400",
    },
  },
  {
    id: "G5",
    number: 5,
    slug: "faminas",
    court: "Quadra 5",
    name: "FAMINAS",
    sponsor: "Faminas",
    shortName: "Faminas",
    theme: {
      primary: "#075985",
      secondary: "#082f49",
      accent: "#06b6d4",
      soft: "#ecfeff",
      text: "#164e63",
      border: "#a5f3fc",
      gradient: "from-sky-900 via-cyan-700 to-cyan-400",
    },
  },
  {
    id: "G6",
    number: 6,
    slug: "jeronimo-joias",
    court: "Quadra 6",
    name: "JERÔNIMO JOIAS",
    sponsor: "Jerônimo Joias",
    shortName: "Jerônimo Joias",
    theme: {
      primary: "#52525b",
      secondary: "#09090b",
      accent: "#a1a1aa",
      soft: "#f4f4f5",
      text: "#27272a",
      border: "#d4d4d8",
      gradient: "from-zinc-900 via-zinc-700 to-zinc-400",
    },
  },
  {
    id: "G7",
    number: 7,
    slug: "oticas-jeronimo",
    court: "Quadra 7",
    name: "ÓTICAS JERÔNIMO",
    sponsor: "Óticas Jerônimo",
    shortName: "Óticas Jerônimo",
    theme: {
      primary: "#7f1d1d",
      secondary: "#111827",
      accent: "#be123c",
      soft: "#fff1f2",
      text: "#7f1d1d",
      border: "#fecdd3",
      gradient: "from-gray-950 via-red-950 to-rose-700",
    },
  },
  {
    id: "G8",
    number: 8,
    slug: "dr-helcio",
    court: "Quadra 8",
    name: "DR. HÉLCIO",
    sponsor: "Dr. Hélcio Rabelo Jr.",
    shortName: "Dr. Hélcio",
    theme: {
      primary: "#b8860b",
      secondary: "#1f1600",
      accent: "#f5c542",
      soft: "#fffbeb",
      text: "#854d0e",
      border: "#fde68a",
      gradient: "from-yellow-900 via-amber-600 to-yellow-300",
    },
  },
];

const OFFICIAL_PAIRS: Record<GroupId, string[]> = {
  G1: [
    "Dudu Sicoob x João Pedro Leopoldina",
    "Chico x Fernandinho",
    "Lucas Advogado x Roberto",
    "Dr Marcelo x Escobar",
    "Roger x Vitinho do Dídio",
  ],
  G2: [
    "Matheus Gato x Vitim Mansur",
    "Fernando Tigrinho x Maycon de Laje",
    "Renan do Colina x Toin",
    "Rafael Barros x Felipinho",
    "André Monteiro x Abraão",
  ],
  G3: [
    "Tiago Conserta x Vezê",
    "Felipe Goreti x Diogo Freixo",
    "Guilherme x Ezequiel",
    "Dandan x João da 032",
    "Igor Sartoni x Neymar",
  ],
  G4: [
    "Pastor Dodi x Vitor do Via Park",
    "Randolph x Sorriso",
    "Wilder x Juninho Modelo",
    "Thiago Silva x Rogério Coroa",
    "Juninho Fritz x Giovanni Dídio",
  ],
  G5: [
    "Thiago Reis x Rafael Promotor",
    "Justinho x Vandinho",
    "Kaiser x Dieguinho",
    "Frazão x Flávio",
    "Ericsson Fire x Moto Moto",
  ],
  G6: [
    "Ataliba x Palmero",
    "Emanuel x Thiago Portilho",
    "Henrique Paes x Willian Benção",
    "Fabinho x Daniel do Cartão",
    "Juninho Shaque x Paulo Louro",
  ],
  G7: [
    "João Careca x Henrique Primo do Roberto",
    "Rafael Leal x Daniel Gêmeos",
    "Gabriel Raul x Messias",
    "Bruno Temaki x Vitinho Drumond",
    "Paulo Leal x Rafael Gêmeos",
  ],
  G8: [
    "Guilherme Mantovani x Pedro Pombo",
    "Brenno x PENDENTE",
    "Hamilton x PENDENTE",
    "Igor Baza x PENDENTE",
    "Milane x PENDENTE",
  ],
};

export const GROUP_GAME_ORDER: Array<[number, number]> = [
  [1, 2],
  [3, 4],
  [5, 1],
  [2, 3],
  [4, 5],
  [1, 3],
  [2, 4],
  [5, 3],
  [1, 4],
  [2, 5],
];

export function getInitialPairs(): Pair[] {
  return GROUPS.flatMap((group) =>
    OFFICIAL_PAIRS[group.id].map((name, index) => ({
      id: `${group.id}-P${index + 1}`,
      groupId: group.id,
      seed: index + 1,
      name,
    })),
  );
}

export function getInitialGroupMatches(): GroupMatch[] {
  return GROUPS.flatMap((group) =>
    GROUP_GAME_ORDER.map(([seedA, seedB], index) => ({
      id: `${group.id}-M${index + 1}`,
      groupId: group.id,
      order: index + 1,
      pairAId: `${group.id}-P${seedA}`,
      pairBId: `${group.id}-P${seedB}`,
      scoreA: null,
      scoreB: null,
      status: "pending",
    })),
  );
}

export function getInitialKnockoutMatches(): KnockoutMatch[] {
  const round16Seeds: Array<Pick<KnockoutMatch, "seedA" | "seedB">> = [
    {
      seedA: { type: "group", groupId: "G1", position: 1 },
      seedB: { type: "group", groupId: "G8", position: 2 },
    },
    {
      seedA: { type: "group", groupId: "G2", position: 1 },
      seedB: { type: "group", groupId: "G7", position: 2 },
    },
    {
      seedA: { type: "group", groupId: "G3", position: 1 },
      seedB: { type: "group", groupId: "G6", position: 2 },
    },
    {
      seedA: { type: "group", groupId: "G4", position: 1 },
      seedB: { type: "group", groupId: "G5", position: 2 },
    },
    {
      seedA: { type: "group", groupId: "G5", position: 1 },
      seedB: { type: "group", groupId: "G4", position: 2 },
    },
    {
      seedA: { type: "group", groupId: "G6", position: 1 },
      seedB: { type: "group", groupId: "G3", position: 2 },
    },
    {
      seedA: { type: "group", groupId: "G7", position: 1 },
      seedB: { type: "group", groupId: "G2", position: 2 },
    },
    {
      seedA: { type: "group", groupId: "G8", position: 1 },
      seedB: { type: "group", groupId: "G1", position: 2 },
    },
  ];

  const round16: KnockoutMatch[] = round16Seeds.map((seeds, index) => ({
    id: `R16-M${index + 1}`,
    phase: "round16",
    order: index + 1,
    ...seeds,
    scoreA: null,
    scoreB: null,
    status: "pending",
  }));

  const quarterfinals: KnockoutMatch[] = [1, 2, 3, 4].map((order) => ({
    id: `QF-M${order}`,
    phase: "quarterfinal",
    order,
    seedA: { type: "winner", matchId: `R16-M${order * 2 - 1}` },
    seedB: { type: "winner", matchId: `R16-M${order * 2}` },
    scoreA: null,
    scoreB: null,
    status: "pending",
  }));

  const semifinals: KnockoutMatch[] = [1, 2].map((order) => ({
    id: `SF-M${order}`,
    phase: "semifinal",
    order,
    seedA: { type: "winner", matchId: `QF-M${order * 2 - 1}` },
    seedB: { type: "winner", matchId: `QF-M${order * 2}` },
    scoreA: null,
    scoreB: null,
    status: "pending",
  }));

  const final: KnockoutMatch = {
    id: "FINAL-M1",
    phase: "final",
    order: 1,
    seedA: { type: "winner", matchId: "SF-M1" },
    seedB: { type: "winner", matchId: "SF-M2" },
    scoreA: null,
    scoreB: null,
    status: "pending",
  };

  return [...round16, ...quarterfinals, ...semifinals, final];
}

const INITIAL_STATE_TIMESTAMP = "2026-01-01T00:00:00.000Z";

export function createInitialTournamentState(): TournamentState {
  const now = INITIAL_STATE_TIMESTAMP;

  return {
    version: 1,
    updatedAt: now,
    groups: GROUPS,
    pairs: getInitialPairs(),
    groupMatches: getInitialGroupMatches(),
    knockoutMatches: getInitialKnockoutMatches(),
    manualRankOrder: {},
    settings: {
      locked: false,
      courtStatuses: DEFAULT_COURT_STATUSES,
      liveStreams: DEFAULT_LIVE_STREAMS,
    },
    logs: [
      {
        id: "system-start",
        at: now,
        actor: "system",
        message: "Sistema BioBeach iniciado com grupos oficiais.",
      },
    ],
  };
}
