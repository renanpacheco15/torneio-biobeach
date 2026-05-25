"use client";

import { Medal, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RankedPair } from "@/lib/tournament/types";

type RankingTableProps = {
  ranking: RankedPair[];
  highlightPairId?: string;
  compact?: boolean;
};

export function RankingTable({ ranking, highlightPairId, compact = false }: RankingTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-[0_0_34px_rgba(132,204,22,0.08)]">
      <div className="grid gap-2 p-2 sm:hidden">
        {ranking.map((row) => {
          const isHighlight = row.pair.id === highlightPairId;
          return (
            <div
              key={row.pair.id}
              className={cn(
                "rounded-lg border border-white/10 bg-black/35 p-3",
                row.classifying && "border-emerald-300/30 bg-emerald-400/10",
                isHighlight && "border-amber-300 bg-amber-300/10",
              )}
            >
              <div className="grid grid-cols-[auto_1fr] gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-md font-black", row.classifying ? "bg-emerald-500 text-white" : "bg-white/10 text-white")}>
                  {row.position}º
                </div>
                <div className="min-w-0">
                  <div className="break-words text-sm font-black uppercase leading-snug text-white">{row.pair.name}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-black uppercase", row.classifying ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-300")}>
                      {row.classifying ? "Classificando" : "Na disputa"}
                    </span>
                    {isHighlight && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-300 px-2 py-0.5 text-[10px] font-black uppercase text-slate-950">
                        <Star className="h-3 w-3" aria-hidden="true" />
                        Sua busca
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <MobileStat label="J" value={row.played.toString()} />
                <MobileStat label="V" value={row.wins.toString()} good />
                <MobileStat label="D" value={row.losses.toString()} bad />
                <MobileStat label="PF" value={row.pointsFor.toString()} />
                <MobileStat label="PC" value={row.pointsAgainst.toString()} />
                <MobileStat label="Saldo" value={`${row.balance > 0 ? "+" : ""}${row.balance}`} good={row.balance >= 0} bad={row.balance < 0} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[660px] border-collapse text-left">
          <thead className="bg-black text-white">
            <tr className="text-xs uppercase">
              <th className="w-14 px-3 py-3">Pos</th>
              <th className="px-3 py-3">Dupla</th>
              <th className="px-2 py-3 text-center">J</th>
              <th className="px-2 py-3 text-center">V</th>
              <th className="px-2 py-3 text-center">D</th>
              <th className="px-2 py-3 text-center">PF</th>
              <th className="px-2 py-3 text-center">PC</th>
              <th className="px-2 py-3 text-center">Saldo</th>
              {!compact && <th className="px-3 py-3">Status</th>}
            </tr>
          </thead>
          <tbody>
            {ranking.map((row) => {
              const isHighlight = row.pair.id === highlightPairId;
              return (
                <tr
                  key={row.pair.id}
                  className={cn(
                    "border-b border-white/10 text-sm font-semibold text-slate-100",
                    row.classifying && "bg-emerald-400/10",
                    isHighlight && "bg-amber-300/10 outline outline-2 outline-amber-300",
                  )}
                >
                  <td className="px-3 py-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-md font-black",
                        row.classifying ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-100",
                      )}
                    >
                      {row.position}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-white">{row.pair.name}</span>
                      {isHighlight && (
                        <span className="inline-flex w-fit items-center gap-1 rounded-md bg-amber-300 px-2 py-0.5 text-[11px] font-black uppercase text-slate-950">
                          <Star className="h-3 w-3" aria-hidden="true" />
                          Sua busca
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center">{row.played}</td>
                  <td className="px-2 py-3 text-center text-emerald-300">{row.wins}</td>
                  <td className="px-2 py-3 text-center text-red-300">{row.losses}</td>
                  <td className="px-2 py-3 text-center">{row.pointsFor}</td>
                  <td className="px-2 py-3 text-center">{row.pointsAgainst}</td>
                  <td className={cn("px-2 py-3 text-center font-black", row.balance >= 0 ? "text-emerald-300" : "text-red-300")}>
                    {row.balance > 0 ? "+" : ""}
                    {row.balance}
                  </td>
                  {!compact && (
                    <td className="px-3 py-3">
                      {row.classifying ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-2.5 py-1 text-xs font-black uppercase text-white">
                          <Medal className="h-3.5 w-3.5" aria-hidden="true" />
                          Classificando
                        </span>
                      ) : (
                        <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-black uppercase text-slate-300">
                          Na disputa
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MobileStat({ label, value, good = false, bad = false }: { label: string; value: string; good?: boolean; bad?: boolean }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-2">
      <div className={cn("text-base font-black", good ? "text-emerald-300" : bad ? "text-red-300" : "text-white")}>{value}</div>
      <div className="text-[10px] font-black uppercase text-slate-500">{label}</div>
    </div>
  );
}
