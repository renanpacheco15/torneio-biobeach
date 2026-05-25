"use client";

import { Check, Play, RotateCcw, Save } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import type { GroupMatch, TournamentState } from "@/lib/tournament/types";
import { getPairName } from "@/lib/tournament/calculations";
import { cn } from "@/lib/utils";

type MatchRowProps = {
  state: TournamentState;
  match: GroupMatch;
  locked?: boolean;
  actor: "admin" | "mesario";
  onStart: (matchId: string) => void;
  onSave: (matchId: string, scoreA: number | null, scoreB: number | null, actor: "admin" | "mesario") => string | null;
  onReopen: (matchId: string, actor: "admin" | "mesario") => void;
  dense?: boolean;
};

function parseScore(value: string): number | null {
  if (value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function MatchRow({ state, match, locked = false, actor, onStart, onSave, onReopen, dense = false }: MatchRowProps) {
  const [scoreA, setScoreA] = useState(match.scoreA?.toString() ?? "");
  const [scoreB, setScoreB] = useState(match.scoreB?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  const disabled = locked && actor === "mesario";
  const pairA = getPairName(state, match.pairAId);
  const pairB = getPairName(state, match.pairBId);

  const save = () => {
    const result = onSave(match.id, parseScore(scoreA), parseScore(scoreB), actor);
    setError(result);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-slate-950 px-2.5 py-1 text-xs font-black uppercase text-white">Jogo {match.order}</span>
        <StatusBadge status={match.status} />
      </div>

      <div className="mt-4 lg:hidden">
        <MobileTeamScore label="Dupla 1" name={pairA} value={scoreA} disabled={disabled} onChange={setScoreA} />
        <div className="my-3 text-center text-2xl font-black uppercase text-slate-400">X</div>
        <MobileTeamScore label="Dupla 2" name={pairB} value={scoreB} disabled={disabled} onChange={setScoreB} />

        <div className="mt-4 grid grid-cols-2 gap-2">
          {match.status === "pending" && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onStart(match.id)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-black uppercase text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              Iniciar
            </button>
          )}

          {match.status === "finished" && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onReopen(match.id, actor)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-black uppercase text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Corrigir
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={save}
            className={cn(
              "inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-black uppercase text-white disabled:cursor-not-allowed disabled:bg-slate-300",
              match.status === "live" && "col-span-2",
            )}
          >
            {match.status === "finished" ? <Save className="h-4 w-4" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
            Salvar
          </button>
        </div>
      </div>

      <div className="mt-3 hidden gap-3 lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className={cn("grid items-center gap-2 font-black text-slate-950", dense ? "text-sm" : "text-lg", "grid-cols-[1fr_auto_1fr]")}>
            <span className="break-words">{pairA}</span>
            <span className="text-center text-slate-400">x</span>
            <span className="break-words text-right">{pairB}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <ScoreInput ariaLabel={`Placar de ${pairA}`} value={scoreA} disabled={disabled} onChange={setScoreA} />
            <span className="text-2xl font-black text-slate-400">x</span>
            <ScoreInput ariaLabel={`Placar de ${pairB}`} value={scoreB} disabled={disabled} onChange={setScoreB} />
          </div>

          <div className="flex gap-2">
            {match.status === "pending" && (
              <ActionButton disabled={disabled} onClick={() => onStart(match.id)} icon={<Play className="h-4 w-4" aria-hidden="true" />} label="Iniciar" tone="dark" />
            )}

            {match.status === "finished" && (
              <ActionButton disabled={disabled} onClick={() => onReopen(match.id, actor)} icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />} label="Corrigir" tone="light" />
            )}

            <ActionButton
              disabled={disabled}
              onClick={save}
              icon={match.status === "finished" ? <Save className="h-4 w-4" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
              label="Salvar"
              tone="green"
            />
          </div>
        </div>
      </div>

      {error && <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</div>}
      {disabled && <div className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">Lançamentos travados pelo administrador.</div>}
    </div>
  );
}

function MobileTeamScore({
  label,
  name,
  value,
  disabled,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-lg border border-slate-200 bg-slate-50 p-3">
      <span className="text-[10px] font-black uppercase text-slate-500">{label}</span>
      <span className="mt-1 block break-words text-base font-black leading-snug text-slate-950">{name}</span>
      <input
        aria-label={`Placar de ${name}`}
        disabled={disabled}
        inputMode="numeric"
        min={0}
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^\d]/g, ""))}
        className="mt-3 h-16 w-full rounded-md border-2 border-slate-200 bg-white text-center text-3xl font-black text-slate-950 outline-none focus:border-slate-950"
      />
    </label>
  );
}

function ScoreInput({ ariaLabel, value, disabled, onChange }: { ariaLabel: string; value: string; disabled: boolean; onChange: (value: string) => void }) {
  return (
    <input
      aria-label={ariaLabel}
      disabled={disabled}
      inputMode="numeric"
      min={0}
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/[^\d]/g, ""))}
      className="h-14 w-20 rounded-md border-2 border-slate-200 bg-white text-center text-2xl font-black text-slate-950 outline-none focus:border-slate-950"
    />
  );
}

function ActionButton({ disabled, onClick, icon, label, tone }: { disabled: boolean; onClick: () => void; icon: ReactNode; label: string; tone: "dark" | "light" | "green" }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-md px-4 text-sm font-black uppercase disabled:cursor-not-allowed disabled:bg-slate-300",
        tone === "dark" && "bg-slate-950 text-white",
        tone === "light" && "border border-slate-300 bg-white text-slate-800 disabled:opacity-50",
        tone === "green" && "bg-emerald-600 text-white",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
