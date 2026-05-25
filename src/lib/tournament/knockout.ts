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
    shortTitle: "Oitavas de Final",
    subtitle: "Dezesseis classificados entram no primeiro corte do mata-mata BioBeach.",
    accent: "lime",
    cta: "Valendo vaga nas quartas",
  },
  quarterfinal: {
    phase: "quarterfinal",
    route: "/quartas",
    eyebrow: "Mata-mata oficial",
    title: "Quartas de Final",
    shortTitle: "Quartas de Final",
    subtitle: "Os classificados dos grupos entram no caminho decisivo do Torneio BioBeach.",
    accent: "lime",
    cta: "Valendo vaga na semifinal",
  },
  semifinal: {
    phase: "semifinal",
    route: "/semifinais",
    eyebrow: "Reta decisiva",
    title: "Semifinais",
    shortTitle: "Semifinais",
    subtitle: "Dois confrontos, quatro duplas e a pressão máxima por uma vaga na final.",
    accent: "cyan",
    cta: "Valendo vaga na final",
  },
  final: {
    phase: "final",
    route: "/final",
    eyebrow: "Evento principal",
    title: "Grande Final",
    shortTitle: "Grande Final",
    subtitle: "O confronto que define campeão e vice-campeão do Torneio BioBeach.",
    accent: "amber",
    cta: "Valendo o título do torneio",
  },
};

export const KNOCKOUT_MATCH_META: Record<string, KnockoutMatchMeta> = {
  "R16-M1": {
    id: "R16-M1",
    code: "Oitavas de Final 1",
    courtGroupId: "G1",
    time: "A definir",
    detail: "1º geral x 16º geral",
  },
  "R16-M2": {
    id: "R16-M2",
    code: "Oitavas de Final 2",
    courtGroupId: "G2",
    time: "A definir",
    detail: "2º geral x 15º geral",
  },
  "R16-M3": {
    id: "R16-M3",
    code: "Oitavas de Final 3",
    courtGroupId: "G3",
    time: "A definir",
    detail: "3º geral x 14º geral",
  },
  "R16-M4": {
    id: "R16-M4",
    code: "Oitavas de Final 4",
    courtGroupId: "G4",
    time: "A definir",
    detail: "4º geral x 13º geral",
  },
  "R16-M5": {
    id: "R16-M5",
    code: "Oitavas de Final 5",
    courtGroupId: "G5",
    time: "A definir",
    detail: "5º geral x 12º geral",
  },
  "R16-M6": {
    id: "R16-M6",
    code: "Oitavas de Final 6",
    courtGroupId: "G6",
    time: "A definir",
    detail: "6º geral x 11º geral",
  },
  "R16-M7": {
    id: "R16-M7",
    code: "Oitavas de Final 7",
    courtGroupId: "G7",
    time: "A definir",
    detail: "7º geral x 10º geral",
  },
  "R16-M8": {
    id: "R16-M8",
    code: "Oitavas de Final 8",
    courtGroupId: "G8",
    time: "A definir",
    detail: "8º geral x 9º geral",
  },
  "QF-M1": {
    id: "QF-M1",
    code: "Quartas de Final 1",
    courtGroupId: "G1",
    time: "A definir",
    detail: "Vencedor Oitavas de Final 1 x Vencedor Oitavas de Final 2",
  },
  "QF-M2": {
    id: "QF-M2",
    code: "Quartas de Final 2",
    courtGroupId: "G2",
    time: "A definir",
    detail: "Vencedor Oitavas de Final 3 x Vencedor Oitavas de Final 4",
  },
  "QF-M3": {
    id: "QF-M3",
    code: "Quartas de Final 3",
    courtGroupId: "G3",
    time: "A definir",
    detail: "Vencedor Oitavas de Final 5 x Vencedor Oitavas de Final 6",
  },
  "QF-M4": {
    id: "QF-M4",
    code: "Quartas de Final 4",
    courtGroupId: "G4",
    time: "A definir",
    detail: "Vencedor Oitavas de Final 7 x Vencedor Oitavas de Final 8",
  },
  "SF-M1": {
    id: "SF-M1",
    code: "Semifinal 1",
    courtGroupId: "G7",
    time: "A definir",
    detail: "Vencedor Quartas de Final 1 x Vencedor Quartas de Final 2",
  },
  "SF-M2": {
    id: "SF-M2",
    code: "Semifinal 2",
    courtGroupId: "G4",
    time: "A definir",
    detail: "Vencedor Quartas de Final 3 x Vencedor Quartas de Final 4",
  },
  "FINAL-M1": {
    id: "FINAL-M1",
    code: "Grande Final",
    courtGroupId: "G4",
    time: "A definir",
    detail: "Vencedor Semifinal 1 x Vencedor Semifinal 2",
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
