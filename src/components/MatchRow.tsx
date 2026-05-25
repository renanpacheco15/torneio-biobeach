"use client";

import { Check, Play, RotateCcw, Save } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import type { GroupMatch, MatchStatus, TournamentState } from "@/lib/tournament/types";
import { getPairName } from "@/lib/tournament/calculations";
import { cn } from "@/lib/utils";

type MatchRowProps = {
  state: TournamentState;
  match: GroupMatch;
  locked?: boolean;
  actor: "admin" | "mesario";
  onStart: (matchId: string) => void;
  onSave: (matchId: string, scoreA: number | null, scoreB: number | null, actor: "admin" | "mesario", finish?: boolean) => string | null;
  onReopen: (matchId: string, actor: "admin" | "mesario") => void;
  onSetStatus?: (matchId: string, status: MatchStatus, actor: "admin" | "mesario") => void;
  dense?: boolean;
};

function parseScore(value: string): number | null {
  if (value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function MatchRow({ state, match, locked = false, actor, onStart, onSave, onReopen, onSetStatus, dense = false }: MatchRowProps) {
  const [scoreA, setScoreA] = useState(match.scoreA?.toString() ?? "");
  const [scoreB, setScoreB] = useState(match.scoreB?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  const disabled = locked && actor === "mesario";
  const pairA = getPairName(state, match.pairAId);
  const pairB = getPairName(state, match.pairBId);

  const save = (finish = actor !== "admin") => {
    const result = onSave(match.id, parseScore(scoreA), parseScore(scoreB), actor, finish);
    setError(result);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.055] p-4 shadow-[0_0_26px_rgba(132,204,22,0.06)] backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-slate-950 px-2.5 py-1 text-xs font-black uppercase text-white">Jogo {match.order}</span>
        <StatusBadge status={match.status} />
      </div>
      {actor === "admin" && onSetStatus && (
        <StatusControl
          status={match.status}
          disabled={disabled}
          onChange={(status) => onSetStatus(match.id, status, actor)}
        />
      )}

      <div className="mt-4 lg:hidden">
        <MobileTeamScore label="Dupla 1" name={pairA} value={scoreA} disabled={disabled} onChange={setScoreA} />
        <div className="my-3 text-center text-2xl font-black uppercase text-lime-300">VS</div>
        <MobileTeamScore label="Dupla 2" name={pairB} value={scoreB} disabled={disabled} onChange={setScoreB} />

        <div className="mt-4 grid grid-cols-2 gap-2">
          {actor !== "admin" && match.status === "pending" && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onStart(match.id)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-lime-300 px-4 text-sm font-black uppercase text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              Iniciar
            </button>
          )}

          {actor !== "admin" && match.status === "finished" && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onReopen(match.id, actor)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm font-black uppercase text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Corrigir
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={() => save(actor !== "admin")}
            className={cn(
              "inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-black uppercase text-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400",
              actor !== "admin" && match.status === "live" && "col-span-2",
            )}
          >
            {match.status === "finished" ? <Save className="h-4 w-4" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
            {actor === "admin" ? "Salvar placar" : "Salvar"}
          </button>
          {actor === "admin" && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => save(true)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-lime-300 px-4 text-sm font-black uppercase text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Finalizar
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 hidden gap-3 lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className={cn("grid items-center gap-2 font-black text-white", dense ? "text-sm" : "text-lg", "grid-cols-[1fr_auto_1fr]")}>
            <span className="break-words rounded-lg border border-white/10 bg-slate-950/85 px-3 py-3 leading-tight shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">{pairA}</span>
            <span className="rounded-full border border-lime-300/30 bg-lime-300/10 px-2 py-1 text-center text-xs uppercase text-lime-300">VS</span>
            <span className="break-words rounded-lg border border-white/10 bg-slate-950/85 px-3 py-3 text-right leading-tight shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">{pairB}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <ScoreInput ariaLabel={`Placar de ${pairA}`} value={scoreA} disabled={disabled} onChange={setScoreA} />
            <span className="text-2xl font-black text-lime-300">x</span>
            <ScoreInput ariaLabel={`Placar de ${pairB}`} value={scoreB} disabled={disabled} onChange={setScoreB} />
          </div>

          <div className="flex gap-2">
            {actor !== "admin" && match.status === "pending" && (
              <ActionButton disabled={disabled} onClick={() => onStart(match.id)} icon={<Play className="h-4 w-4" aria-hidden="true" />} label="Iniciar" tone="dark" />
            )}

            {actor !== "admin" && match.status === "finished" && (
              <ActionButton disabled={disabled} onClick={() => onReopen(match.id, actor)} icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />} label="Corrigir" tone="light" />
            )}

            <ActionButton
              disabled={disabled}
              onClick={() => save(actor !== "admin")}
              icon={match.status === "finished" ? <Save className="h-4 w-4" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
              label={actor === "admin" ? "Salvar placar" : "Salvar"}
              tone="green"
            />
            {actor === "admin" && (
              <ActionButton
                disabled={disabled}
                onClick={() => save(true)}
                icon={<Check className="h-4 w-4" aria-hidden="true" />}
                label="Finalizar"
                tone="dark"
              />
            )}
          </div>
        </div>
      </div>

      {error && <div className="mt-3 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-100">{error}</div>}
      {disabled && <div className="mt-3 rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm font-bold text-amber-100">Lançamentos travados pelo administrador.</div>}
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
    <label className="block rounded-lg border border-white/15 bg-slate-950/90 p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
      <span className="text-[10px] font-black uppercase text-slate-400">{label}</span>
      <span className="mt-1 block break-words text-lg font-black uppercase leading-tight text-white">{name}</span>
      <input
        aria-label={`Placar de ${name}`}
        disabled={disabled}
        inputMode="numeric"
        min={0}
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^\d]/g, ""))}
        className="mt-3 h-16 w-full rounded-md border-2 border-white/10 bg-slate-950 text-center text-3xl font-black text-white outline-none focus:border-lime-300"
      />
    </label>
  );
}

function StatusControl({
  status,
  disabled,
  onChange,
}: {
  status: MatchStatus;
  disabled: boolean;
  onChange: (status: MatchStatus) => void;
}) {
  const options: Array<{ value: MatchStatus; label: string }> = [
    { value: "pending", label: "Pendente" },
    { value: "live", label: "Em andamento" },
    { value: "finished", label: "Finalizado" },
  ];

  return (
    <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-lg border border-white/10 bg-black/30 p-1.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(option.value)}
          className={cn(
            "min-h-10 rounded-md px-2 text-[10px] font-black uppercase transition disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs",
            status === option.value
              ? option.value === "live"
                ? "bg-red-600 text-white shadow-[0_0_18px_rgba(220,38,38,0.24)]"
                : option.value === "finished"
                  ? "bg-emerald-500 text-white shadow-[0_0_18px_rgba(16,185,129,0.18)]"
                  : "bg-lime-300 text-slate-950"
              : "border border-white/10 bg-white/[0.045] text-slate-200 hover:border-lime-300/40",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
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
      className="h-14 w-20 rounded-md border-2 border-white/10 bg-slate-950 text-center text-2xl font-black text-white outline-none focus:border-lime-300"
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
        "inline-flex h-12 items-center justify-center gap-2 rounded-md px-4 text-sm font-black uppercase disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400",
        tone === "dark" && "bg-lime-300 text-slate-950",
        tone === "light" && "border border-white/10 bg-white/[0.04] text-slate-100 disabled:opacity-50",
        tone === "green" && "bg-emerald-600 text-white",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
