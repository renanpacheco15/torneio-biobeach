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
    })),
  );

  ranking.sort((a, b) => {
    const numericCriteria =
      b.wins - a.wins ||
      b.balance - a.balance ||
      b.pointsFor - a.pointsFor ||
      a.pointsAgainst - b.pointsAgainst ||
      b.played - a.played;

    if (numericCriteria !== 0) return numericCriteria;

    return a.group.number - b.group.number || a.pair.seed - b.pair.seed;
  });

  return ranking.map((row, index) => ({
    ...row,
    overallPosition: index + 1,
  }));
}

export function getQualifiedPairs(state: TournamentState): RankedPair[] {
  return state.groups.flatMap((group) => calculateGroupRanking(state, group.id).slice(0, 2));
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

  const origin = state.knockoutMatches.find((match) => match.id === seed.matchId);
  const winner = origin?.winnerId ? state.pairs.find((pair) => pair.id === origin.winnerId) : undefined;

  return {
    label: `Vencedor ${getKnockoutMeta(seed.matchId).code}`,
    pair: winner,
  };
}
