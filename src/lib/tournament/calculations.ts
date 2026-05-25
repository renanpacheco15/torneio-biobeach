import { GROUPS, getInitialKnockoutMatches } from "./data";
import type {
  Group,
  GroupId,
  GroupMatch,
  KnockoutMatch,
  KnockoutSeed,
  OverallRankedPair,
  Pair,
  RankedPair,
  TournamentState,
} from "./types";
import { getKnockoutMeta } from "./knockout";

export function getGroupById(state: TournamentState, groupId: GroupId): Group {
  return state.groups.find((group) => group.id === groupId) ?? GROUPS[0];
}

export function findGroupByParam(state: TournamentState, param: string): Group | undefined {
  const normalized = normalizeText(param);

  return state.groups.find((group) => {
    const candidates = [
      group.id,
      String(group.number),
      `grupo-${group.number}`,
      group.slug,
      group.name,
      group.shortName,
    ];

    return candidates.some((candidate) => normalizeText(candidate) === normalized);
  });
}

export function getPairsByGroup(state: TournamentState, groupId: GroupId): Pair[] {
  return state.pairs
    .filter((pair) => pair.groupId === groupId)
    .sort((a, b) => a.seed - b.seed);
}

export function getMatchesByGroup(state: TournamentState, groupId: GroupId): GroupMatch[] {
  return state.groupMatches
    .filter((match) => match.groupId === groupId)
    .sort((a, b) => a.order - b.order);
}

export function getPairName(state: TournamentState, pairId?: string): string {
  if (!pairId) return "A definir";
  return state.pairs.find((pair) => pair.id === pairId)?.name ?? "A definir";
}

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateScore(scoreA: number | null, scoreB: number | null): string | null {
  if (scoreA === null || scoreB === null) return "Preencha os dois placares.";
  if (!Number.isFinite(scoreA) || !Number.isFinite(scoreB)) return "Use apenas números.";
  if (scoreA < 0 || scoreB < 0) return "Placar não pode ser negativo.";
  if (scoreA === scoreB) return "Empate não é permitido.";
  return null;
}

export function calculateGroupRanking(state: TournamentState, groupId: GroupId): RankedPair[] {
  const pairs = getPairsByGroup(state, groupId);
  const stats = new Map<string, RankedPair>();

  pairs.forEach((pair) => {
    stats.set(pair.id, {
      pair,
      position: pair.seed,
      played: 0,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      balance: 0,
      winRate: 0,
      classifying: false,
    });
  });

  getMatchesByGroup(state, groupId)
    .filter((match) => match.status === "finished" && match.scoreA !== null && match.scoreB !== null)
    .forEach((match) => {
      const scoreA = match.scoreA ?? 0;
      const scoreB = match.scoreB ?? 0;
      const teamA = stats.get(match.pairAId);
      const teamB = stats.get(match.pairBId);

      if (!teamA || !teamB) return;

      teamA.played += 1;
      teamA.pointsFor += scoreA;
      teamA.pointsAgainst += scoreB;

      teamB.played += 1;
      teamB.pointsFor += scoreB;
      teamB.pointsAgainst += scoreA;

      if (scoreA > scoreB) {
        teamA.wins += 1;
        teamB.losses += 1;
      } else {
        teamB.wins += 1;
        teamA.losses += 1;
      }
    });

  const ranking = Array.from(stats.values()).map((item) => ({
    ...item,
    balance: item.pointsFor - item.pointsAgainst,
    winRate: item.played > 0 ? item.wins / item.played : 0,
  }));

  const manualOrder = state.manualRankOrder[groupId] ?? [];
  const groupMatches = getMatchesByGroup(state, groupId);

  ranking.sort((a, b) => {
    const numericCriteria =
      b.wins - a.wins ||
      b.balance - a.balance ||
      b.pointsFor - a.pointsFor ||
      a.pointsAgainst - b.pointsAgainst;

    if (numericCriteria !== 0) return numericCriteria;

    const directWinner = getHeadToHeadWinner(groupMatches, a.pair.id, b.pair.id);
    if (directWinner === a.pair.id) return -1;
    if (directWinner === b.pair.id) return 1;

    const manualA = manualOrder.indexOf(a.pair.id);
    const manualB = manualOrder.indexOf(b.pair.id);
    if (manualA !== -1 && manualB !== -1 && manualA !== manualB) return manualA - manualB;
    if (manualA !== -1 && manualB === -1) return -1;
    if (manualB !== -1 && manualA === -1) return 1;

    return a.pair.seed - b.pair.seed;
  });

  return ranking.map((item, index) => ({
    ...item,
    position: index + 1,
    classifying: index < 2,
  }));
}

function getHeadToHeadWinner(matches: GroupMatch[], pairAId: string, pairBId: string): string | null {
  const directMatch = matches.find(
    (match) =>
      match.status === "finished" &&
      match.scoreA !== null &&
      match.scoreB !== null &&
      ((match.pairAId === pairAId && match.pairBId === pairBId) ||
        (match.pairAId === pairBId && match.pairBId === pairAId)),
  );

  if (!directMatch || directMatch.scoreA === directMatch.scoreB) return null;

  const firstWon = (directMatch.scoreA ?? 0) > (directMatch.scoreB ?? 0);
  return firstWon ? directMatch.pairAId : directMatch.pairBId;
}

export function getAllRankings(state: TournamentState): Record<GroupId, RankedPair[]> {
  return state.groups.reduce(
    (rankings, group) => {
      rankings[group.id] = calculateGroupRanking(state, group.id);
      return rankings;
    },
    {} as Record<GroupId, RankedPair[]>,
  );
}

export function calculateOverallRanking(state: TournamentState): OverallRankedPair[] {
  const ranking = state.groups.flatMap((group) =>
    calculateGroupRanking(state, group.id).map((row) => ({
      ...row,
      group,
      groupPosition: row.position,
      overallPosition: 0,
      overallStatus: "eliminated" as const,
      overallStatusLabel: "ELIMINADO",
      manualDecision: state.manualOverallDecisions[row.pair.id],
    })),
  );

  const selectedRunnerUps = new Set(getClassifiedRunnerUps(state).map((row) => row.pair.id));
  ranking.sort(compareOverallRows);

  return ranking.map((row, index) => ({
    ...row,
    overallPosition: index + 1,
    classifying: row.groupPosition === 1 || selectedRunnerUps.has(row.pair.id),
    overallStatus:
      row.groupPosition === 1
        ? "group-winner"
        : selectedRunnerUps.has(row.pair.id)
          ? "best-runner-up"
          : "eliminated",
    overallStatusLabel:
      row.groupPosition === 1
        ? "CLASSIFICADO — 1º DO GRUPO"
        : selectedRunnerUps.has(row.pair.id)
          ? row.manualDecision === "classified"
            ? "CLASSIFICADO — DECISÃO MANUAL"
            : "CLASSIFICADO — MELHOR SEGUNDO"
          : "ELIMINADO",
  }));
}

export function getQualifiedPairs(state: TournamentState): RankedPair[] {
  return getQualifiedOverallRanking(state);
}

export function getSecondPlaceRanking(state: TournamentState): OverallRankedPair[] {
  const rows = state.groups.flatMap((group) => {
    const second = calculateGroupRanking(state, group.id)[1];
    if (!second) return [];

    return [
      {
        ...second,
        group,
        groupPosition: second.position,
        overallPosition: 0,
        overallStatus: "manual-pending" as const,
        overallStatusLabel: "AGUARDANDO CRITÉRIO MANUAL",
        manualDecision: state.manualOverallDecisions[second.pair.id],
      },
    ];
  });

  return applyManualRunnerUpOrder(state, rows).map((row, index) => ({
    ...row,
    overallPosition: index + 1,
  }));
}

export function getQualifiedOverallRanking(state: TournamentState): OverallRankedPair[] {
  const winners = state.groups.flatMap((group) => {
    const first = calculateGroupRanking(state, group.id)[0];
    if (!first) return [];

    return [
      {
        ...first,
        group,
        groupPosition: first.position,
        overallPosition: 0,
        overallStatus: "group-winner" as const,
        overallStatusLabel: "CLASSIFICADO — 1º DO GRUPO",
        manualDecision: state.manualOverallDecisions[first.pair.id],
      },
    ];
  });

  const runnerUps = getClassifiedRunnerUps(state).map((row) => ({
    ...row,
    classifying: true,
    overallStatus: "best-runner-up" as const,
    overallStatusLabel: row.manualDecision === "classified" ? "CLASSIFICADO — DECISÃO MANUAL" : "CLASSIFICADO — MELHOR SEGUNDO",
  }));

  return [...winners, ...runnerUps].sort(compareOverallRows).slice(0, 16).map((row, index) => ({
    ...row,
    overallPosition: index + 1,
    classifying: true,
  }));
}

function getClassifiedRunnerUps(state: TournamentState): OverallRankedPair[] {
  const orderedSeconds = applyManualRunnerUpOrder(
    state,
    getSecondPlaceRows(state),
  );
  const forcedClassified = orderedSeconds.filter((row) => row.manualDecision === "classified");
  const neutral = orderedSeconds.filter((row) => !row.manualDecision);
  const forcedEliminated = new Set(orderedSeconds.filter((row) => row.manualDecision === "eliminated").map((row) => row.pair.id));
  const selected: OverallRankedPair[] = [];

  [...forcedClassified, ...neutral].forEach((row) => {
    if (selected.length >= 7) return;
    if (forcedEliminated.has(row.pair.id)) return;
    if (selected.some((item) => item.pair.id === row.pair.id)) return;
    selected.push(row);
  });

  return selected;
}

function getSecondPlaceRows(state: TournamentState): OverallRankedPair[] {
  return state.groups.flatMap((group) => {
    const second = calculateGroupRanking(state, group.id)[1];
    if (!second) return [];

    return [
      {
        ...second,
        group,
        groupPosition: second.position,
        overallPosition: 0,
        overallStatus: "manual-pending" as const,
        overallStatusLabel: "AGUARDANDO CRITÉRIO MANUAL",
        manualDecision: state.manualOverallDecisions[second.pair.id],
      },
    ];
  });
}

function applyManualRunnerUpOrder(state: TournamentState, rows: OverallRankedPair[]): OverallRankedPair[] {
  const automaticOrder = [...rows].sort(compareOverallRows);
  const automaticIndex = new Map(automaticOrder.map((row, index) => [row.pair.id, index]));
  const manualIndex = new Map((state.manualOverallSecondOrder ?? []).map((pairId, index) => [pairId, index]));

  return [...rows].sort((a, b) => {
    const decisionPriority = decisionWeight(a.manualDecision) - decisionWeight(b.manualDecision);
    if (decisionPriority !== 0) return decisionPriority;

    const manualA = manualIndex.get(a.pair.id);
    const manualB = manualIndex.get(b.pair.id);
    if (manualA !== undefined && manualB !== undefined && manualA !== manualB) return manualA - manualB;
    if (manualA !== undefined) return -1;
    if (manualB !== undefined) return 1;

    return (automaticIndex.get(a.pair.id) ?? 0) - (automaticIndex.get(b.pair.id) ?? 0);
  });
}

function decisionWeight(decision?: "classified" | "eliminated"): number {
  if (decision === "classified") return 0;
  if (decision === "eliminated") return 2;
  return 1;
}

function compareOverallRows(a: OverallRankedPair, b: OverallRankedPair): number {
  return (
    b.wins - a.wins ||
    b.balance - a.balance ||
    b.pointsFor - a.pointsFor ||
    a.pointsAgainst - b.pointsAgainst ||
    b.played - a.played ||
    b.winRate - a.winRate ||
    a.group.number - b.group.number ||
    a.pair.seed - b.pair.seed
  );
}

export function getTournamentProgress(state: TournamentState) {
  const total = state.groupMatches.length;
  const finished = state.groupMatches.filter((match) => match.status === "finished").length;
  const live = state.groupMatches.filter((match) => match.status === "live").length;

  return {
    total,
    finished,
    live,
    pending: total - finished - live,
    percent: total > 0 ? Math.round((finished / total) * 100) : 0,
  };
}

export function getRecentResults(state: TournamentState, limit = 6): GroupMatch[] {
  return state.groupMatches
    .filter((match) => match.status === "finished")
    .sort((a, b) => (b.finishedAt ?? b.updatedAt ?? "").localeCompare(a.finishedAt ?? a.updatedAt ?? ""))
    .slice(0, limit);
}

export function getUpcomingMatches(state: TournamentState, limit = 6): GroupMatch[] {
  return state.groupMatches
    .filter((match) => match.status !== "finished")
    .sort((a, b) => {
      const groupDiff = Number(a.groupId.slice(1)) - Number(b.groupId.slice(1));
      return groupDiff || a.order - b.order;
    })
    .slice(0, limit);
}

export type BracketViewMatch = KnockoutMatch & {
  labelA: string;
  labelB: string;
  resolvedPairA?: Pair;
  resolvedPairB?: Pair;
};

export function getBracketView(state: TournamentState): BracketViewMatch[] {
  const defaultBracket = getInitialKnockoutMatches();

  return state.knockoutMatches.map((match) => {
    const defaultMatch = defaultBracket.find((item) => item.id === match.id);
    const normalizedMatch =
      defaultMatch && (match.seedA.type !== defaultMatch.seedA.type || match.seedB.type !== defaultMatch.seedB.type)
        ? {
            ...match,
            seedA: defaultMatch.seedA,
            seedB: defaultMatch.seedB,
          }
        : match;
    const resolvedA = resolveSeed(state, normalizedMatch.seedA);
    const resolvedB = resolveSeed(state, normalizedMatch.seedB);

    return {
      ...normalizedMatch,
      labelA: resolvedA.label,
      labelB: resolvedB.label,
      resolvedPairA: resolvedA.pair,
      resolvedPairB: resolvedB.pair,
    };
  });
}

function resolveSeed(state: TournamentState, seed: KnockoutSeed): { label: string; pair?: Pair } {
  if (seed.type === "group") {
    const group = getGroupById(state, seed.groupId);
    const ranked = calculateGroupRanking(state, seed.groupId)[seed.position - 1];

    return {
      label: `${seed.position}º ${group.shortName}`,
      pair: ranked?.pair,
    };
  }

  if (seed.type === "label") {
    return {
      label: seed.label,
    };
  }

  if (seed.type === "overall") {
    const ranked = getQualifiedOverallRanking(state)[seed.position - 1];

    return {
      label: `${seed.position}º geral`,
      pair: ranked?.pair,
    };
  }

  const origin = state.knockoutMatches.find((match) => match.id === seed.matchId);
  const winner = origin?.winnerId ? state.pairs.find((pair) => pair.id === origin.winnerId) : undefined;

  return {
    label: `Vencedor ${getKnockoutMeta(seed.matchId).code}`,
    pair: winner,
  };
}
