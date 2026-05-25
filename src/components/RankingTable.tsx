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
      <div className="overflow-x-auto">
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
