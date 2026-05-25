"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { createInitialTournamentState, getInitialGroupMatches, getInitialKnockoutMatches } from "./data";
import { getBracketView, getPairName, validateScore } from "./calculations";
import type { CourtStatus, GroupId, TournamentLog, TournamentState } from "./types";

const STORAGE_KEY = "biobeach:tournament:v1";
const CHANNEL_NAME = "biobeach-live";
const INITIAL_STATE = createInitialTournamentState();

type Mutator = (previous: TournamentState) => TournamentState;

let memoryState = INITIAL_STATE;
let loadedFromStorage = false;
const listeners = new Set<() => void>();

function createLog(actor: TournamentLog["actor"], message: string): TournamentLog {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    at: new Date().toISOString(),
    actor,
    message,
  };
}

function mergeWithDefaults(value: TournamentState): TournamentState {
  const defaults = INITIAL_STATE;
  const validKnockoutPhases = new Set(["round16", "quarterfinal", "semifinal", "final"]);
  const hasUnsupportedBracket = value.knockoutMatches?.some((match) => !validKnockoutPhases.has(match.phase as string));
  const hasLegacyBracket = value.knockoutMatches?.some((match) => match.phase === "quarterfinal" && match.seedA.type !== "winner");
  const hasDifferentBracketSize = value.knockoutMatches?.length !== defaults.knockoutMatches.length;

  return {
    ...defaults,
    ...value,
    version: 1,
    groups: defaults.groups,
    pairs: value.pairs?.length ? value.pairs : defaults.pairs,
    groupMatches: value.groupMatches?.length ? value.groupMatches : defaults.groupMatches,
    knockoutMatches:
      value.knockoutMatches?.length && !hasUnsupportedBracket && !hasLegacyBracket && !hasDifferentBracketSize
        ? value.knockoutMatches
        : defaults.knockoutMatches,
    manualRankOrder: value.manualRankOrder ?? {},
    settings: {
      ...defaults.settings,
      ...value.settings,
      courtStatuses: {
        ...defaults.settings.courtStatuses,
        ...(value.settings?.courtStatuses ?? {}),
      },
      liveStreams: {
        ...defaults.settings.liveStreams,
        ...(value.settings?.liveStreams ?? {}),
      },
    },
    logs: value.logs?.length ? value.logs : defaults.logs,
  };
}

function readStoredState(): TournamentState {
  if (typeof window === "undefined") return INITIAL_STATE;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return INITIAL_STATE;

  try {
    return mergeWithDefaults(JSON.parse(raw) as TournamentState);
  } catch {
    return INITIAL_STATE;
  }
}

function getSnapshot(): TournamentState {
  if (typeof window !== "undefined" && !loadedFromStorage) {
    memoryState = readStoredState();
    loadedFromStorage = true;
  }

  return memoryState;
}

function getServerSnapshot(): TournamentState {
  return INITIAL_STATE;
}

function notify(nextState: TournamentState, broadcast = true) {
  memoryState = nextState;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    if (broadcast && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage(nextState);
      channel.close();
    }
  }

  listeners.forEach((listener) => listener());
}

function receiveExternalState(nextState: TournamentState) {
  memoryState = nextState;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      receiveExternalState(mergeWithDefaults(JSON.parse(event.newValue) as TournamentState));
    }
  };

  const channel = typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_NAME) : null;
  const onMessage = (event: MessageEvent<TournamentState>) => {
    receiveExternalState(mergeWithDefaults(event.data));
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
    channel?.addEventListener("message", onMessage);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
      channel?.removeEventListener("message", onMessage);
      channel?.close();
    }
  };
}

export function useTournamentStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const commit = useCallback((mutator: Mutator, log?: TournamentLog) => {
    const next = mutator(getSnapshot());
    const updated: TournamentState = {
      ...next,
      updatedAt: new Date().toISOString(),
      logs: log ? [log, ...next.logs].slice(0, 160) : next.logs,
    };

    notify(updated);
  }, []);

  const actions = useMemo(
    () => ({
      startMatch(matchId: string) {
        commit(
          (previous) => ({
            ...previous,
            groupMatches: previous.groupMatches.map((match) =>
              match.id === matchId
                ? {
                    ...match,
                    status: "live",
                    startedAt: match.startedAt ?? new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }
                : match,
            ),
          }),
          createLog("mesario", `Jogo ${matchId} iniciado.`),
        );
      },

      setGroupMatchStatus(matchId: string, status: "pending" | "live" | "finished", actor: "admin" | "mesario") {
        commit(
          (previous) => ({
            ...previous,
            groupMatches: previous.groupMatches.map((match) =>
              match.id === matchId
                ? {
                    ...match,
                    status,
                    startedAt: status === "live" ? (match.startedAt ?? new Date().toISOString()) : match.startedAt,
                    finishedAt: status === "finished" ? (match.finishedAt ?? new Date().toISOString()) : undefined,
                    updatedAt: new Date().toISOString(),
                  }
                : match,
            ),
          }),
          createLog(actor, `Status do jogo ${matchId} alterado para ${status}.`),
        );
      },

      saveGroupScore(matchId: string, scoreA: number | null, scoreB: number | null, actor: "admin" | "mesario", finish = true) {
        const validation = validateScore(scoreA, scoreB);
        if (validation) return validation;

        commit((previous) => {
          const match = previous.groupMatches.find((item) => item.id === matchId);
          const label = match
            ? `${getPairName(previous, match.pairAId)} ${scoreA} x ${scoreB} ${getPairName(previous, match.pairBId)}`
            : `Jogo ${matchId}`;

          return {
            ...previous,
            groupMatches: previous.groupMatches.map((item) =>
              item.id === matchId
                ? {
                    ...item,
                    scoreA,
                    scoreB,
                    status: finish ? "finished" : item.status === "pending" ? "live" : item.status,
                    finishedAt: finish ? new Date().toISOString() : item.finishedAt,
                    updatedAt: new Date().toISOString(),
                  }
                : item,
            ),
            logs: [createLog(actor, `Resultado salvo: ${label}.`), ...previous.logs].slice(0, 160),
          };
        });

        return null;
      },

      reopenMatch(matchId: string, actor: "admin" | "mesario") {
        commit(
          (previous) => ({
            ...previous,
            groupMatches: previous.groupMatches.map((match) =>
              match.id === matchId
                ? {
                    ...match,
                    status: "live",
                    finishedAt: undefined,
                    updatedAt: new Date().toISOString(),
                  }
                : match,
            ),
          }),
          createLog(actor, `Jogo ${matchId} reaberto para correção.`),
        );
      },

      startKnockoutMatch(matchId: string) {
        commit(
          (previous) => ({
            ...previous,
            knockoutMatches: previous.knockoutMatches.map((match) =>
              match.id === matchId
                ? {
                    ...match,
                    status: "live",
                    updatedAt: new Date().toISOString(),
                  }
                : match,
            ),
          }),
          createLog("admin", `Mata-mata ${matchId} iniciado.`),
        );
      },

      setKnockoutMatchStatus(matchId: string, status: "pending" | "live" | "finished") {
        commit(
          (previous) => ({
            ...previous,
            knockoutMatches: previous.knockoutMatches.map((match) =>
              match.id === matchId
                ? {
                    ...match,
                    status,
                    winnerId: status === "finished" ? match.winnerId : undefined,
                    updatedAt: new Date().toISOString(),
                  }
                : match,
            ),
          }),
          createLog("admin", `Status do mata-mata ${matchId} alterado para ${status}.`),
        );
      },

      saveKnockoutScore(matchId: string, scoreA: number | null, scoreB: number | null, finish = true) {
        const validation = validateScore(scoreA, scoreB);
        if (validation) return validation;

        const snapshot = getSnapshot();
        const viewMatch = getBracketView(snapshot).find((match) => match.id === matchId);
        const pairAId = viewMatch?.resolvedPairA?.id ?? viewMatch?.pairAId;
        const pairBId = viewMatch?.resolvedPairB?.id ?? viewMatch?.pairBId;

        if (!pairAId || !pairBId) return "Aguarde a definição das duplas deste confronto.";

        const winnerId = (scoreA ?? 0) > (scoreB ?? 0) ? pairAId : pairBId;
        const label = `${getPairName(snapshot, pairAId)} ${scoreA} x ${scoreB} ${getPairName(snapshot, pairBId)}`;

        commit((previous) => ({
          ...previous,
          knockoutMatches: previous.knockoutMatches.map((match) =>
            match.id === matchId
              ? {
                  ...match,
                  pairAId,
                  pairBId,
                  scoreA,
                  scoreB,
                  status: finish ? "finished" : match.status === "pending" ? "live" : match.status,
                  winnerId: finish || match.status === "finished" ? winnerId : undefined,
                  updatedAt: new Date().toISOString(),
                }
              : match,
          ),
          logs: [createLog("admin", `Resultado do mata-mata salvo: ${label}.`), ...previous.logs].slice(0, 160),
        }));

        return null;
      },

      reopenKnockoutMatch(matchId: string) {
        commit(
          (previous) => ({
            ...previous,
            knockoutMatches: previous.knockoutMatches.map((match) =>
              match.id === matchId
                ? {
                    ...match,
                    status: "live",
                    winnerId: undefined,
                    updatedAt: new Date().toISOString(),
                  }
                : match,
            ),
          }),
          createLog("admin", `Mata-mata ${matchId} reaberto para correção.`),
        );
      },

      updatePairName(pairId: string, name: string) {
        commit(
          (previous) => ({
            ...previous,
            pairs: previous.pairs.map((pair) => (pair.id === pairId ? { ...pair, name: name.trim() || pair.name } : pair)),
          }),
          createLog("admin", `Nome da dupla ${pairId} atualizado.`),
        );
      },

      moveManualRank(groupId: GroupId, pairId: string, direction: -1 | 1) {
        commit(
          (previous) => {
            const current =
              previous.manualRankOrder[groupId]?.length === 5
                ? [...(previous.manualRankOrder[groupId] ?? [])]
                : previous.pairs
                    .filter((pair) => pair.groupId === groupId)
                    .sort((a, b) => a.seed - b.seed)
                    .map((pair) => pair.id);
            const index = current.indexOf(pairId);
            const nextIndex = index + direction;

            if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return previous;

            [current[index], current[nextIndex]] = [current[nextIndex], current[index]];

            return {
              ...previous,
              manualRankOrder: {
                ...previous.manualRankOrder,
                [groupId]: current,
              },
            };
          },
          createLog("admin", `Critério manual ajustado no ${groupId}.`),
        );
      },

      clearManualRank(groupId: GroupId) {
        commit(
          (previous) => {
            const next = { ...previous.manualRankOrder };
            delete next[groupId];
            return {
              ...previous,
              manualRankOrder: next,
            };
          },
          createLog("admin", `Decisão manual limpa no ${groupId}.`),
        );
      },

      setLocked(locked: boolean) {
        commit(
          (previous) => ({
            ...previous,
            settings: {
              ...previous.settings,
              locked,
            },
          }),
          createLog("admin", locked ? "Lançamentos travados." : "Lançamentos destravados."),
        );
      },

      setCourtStatus(courtId: string, status: CourtStatus) {
        commit(
          (previous) => ({
            ...previous,
            settings: {
              ...previous.settings,
              courtStatuses: {
                ...previous.settings.courtStatuses,
                [courtId]: status,
              },
            },
          }),
          createLog("admin", `Status da quadra ${courtId} atualizado para ${status}.`),
        );
      },

      updateLiveStream(courtId: string, url: string) {
        commit(
          (previous) => ({
            ...previous,
            settings: {
              ...previous.settings,
              liveStreams: {
                ...previous.settings.liveStreams,
                [courtId]: url.trim(),
              },
            },
          }),
          createLog("admin", `Link de transmissão da quadra ${courtId} atualizado.`),
        );
      },

      resetResults() {
        commit(
          (previous) => ({
            ...previous,
            groupMatches: getInitialGroupMatches(),
            knockoutMatches: getInitialKnockoutMatches(),
            manualRankOrder: {},
          }),
          createLog("admin", "Resultados resetados."),
        );
      },

      importBackup(nextState: TournamentState) {
        commit(
          () => mergeWithDefaults(nextState),
          createLog("admin", "Backup importado."),
        );
      },
    }),
    [commit],
  );

  return { state, actions };
}
