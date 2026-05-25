export type GroupId =
  | "G1"
  | "G2"
  | "G3"
  | "G4"
  | "G5"
  | "G6"
  | "G7"
  | "G8"
  | "G9";

export type MatchStatus = "pending" | "live" | "finished";
export type KnockoutPhase = "round16" | "quarterfinal" | "semifinal" | "final";
export type CourtStatus = "active" | "disabled" | "unavailable";

export type GroupTheme = {
  primary: string;
  secondary: string;
  accent: string;
  soft: string;
  text: string;
  border: string;
  gradient: string;
};

export type Group = {
  id: GroupId;
  number: number;
  slug: string;
  court: string;
  name: string;
  sponsor: string;
  shortName: string;
  theme: GroupTheme;
};

export type Pair = {
  id: string;
  groupId: GroupId;
  seed: number;
  name: string;
};

export type GroupMatch = {
  id: string;
  groupId: GroupId;
  order: number;
  pairAId: string;
  pairBId: string;
  scoreA: number | null;
  scoreB: number | null;
  status: MatchStatus;
  startedAt?: string;
  finishedAt?: string;
  updatedAt?: string;
};

export type KnockoutSeed =
  | {
      type: "group";
      groupId: GroupId;
      position: 1 | 2;
    }
  | {
      type: "overall";
      position: number;
    }
  | {
      type: "winner";
      matchId: string;
    }
  | {
      type: "label";
      label: string;
    };

export type KnockoutMatch = {
  id: string;
  phase: KnockoutPhase;
  order: number;
  seedA: KnockoutSeed;
  seedB: KnockoutSeed;
  pairAId?: string;
  pairBId?: string;
  scoreA: number | null;
  scoreB: number | null;
  status: MatchStatus;
  winnerId?: string;
  updatedAt?: string;
};

export type TournamentSettings = {
  locked: boolean;
  courtStatuses: Record<string, CourtStatus>;
  liveStreams: Record<string, string>;
};

export type OverallManualDecision = "classified" | "eliminated";

export type RegulationContent = {
  title: string;
  subtitle: string;
  body: string;
  updatedAt?: string;
};

export type TournamentLog = {
  id: string;
  at: string;
  actor: "admin" | "mesario" | "system";
  message: string;
};

export type TournamentState = {
  version: 1;
  updatedAt: string;
  groups: Group[];
  pairs: Pair[];
  groupMatches: GroupMatch[];
  knockoutMatches: KnockoutMatch[];
  manualRankOrder: Partial<Record<GroupId, string[]>>;
  manualOverallSecondOrder: string[];
  manualOverallDecisions: Record<string, OverallManualDecision>;
  regulation: RegulationContent;
  settings: TournamentSettings;
  logs: TournamentLog[];
};

export type RankedPair = {
  pair: Pair;
  position: number;
  played: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  balance: number;
  winRate: number;
  classifying: boolean;
};

export type OverallRankedPair = RankedPair & {
  group: Group;
  groupPosition: number;
  overallPosition: number;
  overallStatus: "group-winner" | "best-runner-up" | "manual-pending" | "eliminated";
  overallStatusLabel: string;
  manualDecision?: OverallManualDecision;
};
