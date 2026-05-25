import type { GroupId, KnockoutMatch, KnockoutPhase, MatchStatus, Pair } from "./types";

export type KnockoutMatchMeta = {
  id: string;
  code: string;
  courtGroupId: GroupId;
  time: string;
  detail: string;
};

export type KnockoutStageConfig = {
  phase: KnockoutPhase;
  route: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  accent: string;
  cta: string;
};

export const KNOCKOUT_STAGES: Record<KnockoutPhase, KnockoutStageConfig> = {
  round16: {
    phase: "round16",
    route: "/oitavas",
    eyebrow: "Playoff oficial",
    title: "Oitavas de Final",
    shortTitle: "Oitavas",
    subtitle: "Dezesseis classificados entram no primeiro corte do mata-mata BioBeach.",
    accent: "lime",
    cta: "Valendo vaga nas quartas",
  },
  quarterfinal: {
    phase: "quarterfinal",
    route: "/quartas",
    eyebrow: "Mata-mata oficial",
    title: "Quartas de Final",
    shortTitle: "Quartas",
    subtitle: "Os classificados dos grupos entram no caminho decisivo do Torneio BioBeach.",
    accent: "lime",
    cta: "Valendo vaga na semifinal",
  },
  semifinal: {
    phase: "semifinal",
    route: "/semifinais",
    eyebrow: "Reta decisiva",
    title: "Semifinais",
    shortTitle: "Semis",
    subtitle: "Dois confrontos, quatro duplas e a pressão máxima por uma vaga na final.",
    accent: "cyan",
    cta: "Valendo vaga na final",
  },
  final: {
    phase: "final",
    route: "/final",
    eyebrow: "Evento principal",
    title: "Grande Final",
    shortTitle: "Final",
    subtitle: "O confronto que define campeão e vice-campeão do Torneio BioBeach.",
    accent: "amber",
    cta: "Valendo o título do torneio",
  },
};

export const KNOCKOUT_MATCH_META: Record<string, KnockoutMatchMeta> = {
  "R16-M1": {
    id: "R16-M1",
    code: "O1",
    courtGroupId: "G1",
    time: "A definir",
    detail: "1º Grupo 1 x 2º Grupo 8",
  },
  "R16-M2": {
    id: "R16-M2",
    code: "O2",
    courtGroupId: "G2",
    time: "A definir",
    detail: "1º Grupo 2 x 2º Grupo 7",
  },
  "R16-M3": {
    id: "R16-M3",
    code: "O3",
    courtGroupId: "G3",
    time: "A definir",
    detail: "1º Grupo 3 x 2º Grupo 6",
  },
  "R16-M4": {
    id: "R16-M4",
    code: "O4",
    courtGroupId: "G4",
    time: "A definir",
    detail: "1º Grupo 4 x 2º Grupo 5",
  },
  "R16-M5": {
    id: "R16-M5",
    code: "O5",
    courtGroupId: "G5",
    time: "A definir",
    detail: "1º Grupo 5 x 2º Grupo 4",
  },
  "R16-M6": {
    id: "R16-M6",
    code: "O6",
    courtGroupId: "G6",
    time: "A definir",
    detail: "1º Grupo 6 x 2º Grupo 3",
  },
  "R16-M7": {
    id: "R16-M7",
    code: "O7",
    courtGroupId: "G7",
    time: "A definir",
    detail: "1º Grupo 7 x 2º Grupo 2",
  },
  "R16-M8": {
    id: "R16-M8",
    code: "O8",
    courtGroupId: "G8",
    time: "A definir",
    detail: "1º Grupo 8 x 2º Grupo 1",
  },
  "QF-M1": {
    id: "QF-M1",
    code: "QF1",
    courtGroupId: "G1",
    time: "A definir",
    detail: "Vencedor O1 x Vencedor O2",
  },
  "QF-M2": {
    id: "QF-M2",
    code: "QF2",
    courtGroupId: "G2",
    time: "A definir",
    detail: "Vencedor O3 x Vencedor O4",
  },
  "QF-M3": {
    id: "QF-M3",
    code: "QF3",
    courtGroupId: "G3",
    time: "A definir",
    detail: "Vencedor O5 x Vencedor O6",
  },
  "QF-M4": {
    id: "QF-M4",
    code: "QF4",
    courtGroupId: "G4",
    time: "A definir",
    detail: "Vencedor O7 x Vencedor O8",
  },
  "SF-M1": {
    id: "SF-M1",
    code: "SF1",
    courtGroupId: "G7",
    time: "A definir",
    detail: "Vencedor QF1 x Vencedor QF2",
  },
  "SF-M2": {
    id: "SF-M2",
    code: "SF2",
    courtGroupId: "G4",
    time: "A definir",
    detail: "Vencedor QF3 x Vencedor QF4",
  },
  "FINAL-M1": {
    id: "FINAL-M1",
    code: "FINAL",
    courtGroupId: "G4",
    time: "A definir",
    detail: "Vencedor SF1 x Vencedor SF2",
  },
};

export function getKnockoutMeta(matchId: string): KnockoutMatchMeta {
  return KNOCKOUT_MATCH_META[matchId] ?? {
    id: matchId,
    code: matchId,
    courtGroupId: "G4",
    time: "A definir",
    detail: "Confronto do mata-mata",
  };
}

export function getKnockoutStatusLabel(status: MatchStatus): string {
  if (status === "live") return "AO VIVO";
  if (status === "finished") return "FINALIZADO";
  return "AGUARDANDO";
}

export function getKnockoutWinner(match: KnockoutMatch, pairA?: Pair, pairB?: Pair): Pair | undefined {
  if (!match.winnerId) return undefined;
  if (pairA?.id === match.winnerId) return pairA;
  if (pairB?.id === match.winnerId) return pairB;
  return undefined;
}

export function getKnockoutRunnerUp(match: KnockoutMatch, pairA?: Pair, pairB?: Pair): Pair | undefined {
  if (!match.winnerId) return undefined;
  if (pairA?.id === match.winnerId) return pairB;
  if (pairB?.id === match.winnerId) return pairA;
  return undefined;
}
