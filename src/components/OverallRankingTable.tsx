"use client";

import { Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OverallRankedPair } from "@/lib/tournament/types";

type OverallRankingTableProps = {
  ranking: OverallRankedPair[];
  compact?: boolean;
};

export function OverallRankingTable({ ranking, compact = false }: OverallRankingTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead className="bg-slate-950 text-white">
            <tr className="text-xs uppercase">
              <th className="w-16 px-3 py-3">Geral</th>
              <th className="px-3 py-3">Dupla</th>
              <th className="px-3 py-3">Grupo</th>
              <th className="px-2 py-3 text-center">Pos. grupo</th>
              <th className="px-2 py-3 text-center">J</th>
              <th className="px-2 py-3 text-center">V</th>
              <th className="px-2 py-3 text-center">D</th>
              <th className="px-2 py-3 text-center">PF</th>
              <th className="px-2 py-3 text-center">PC</th>
              <th className="px-2 py-3 text-center">Saldo</th>
              {!compact && <th className="px-3 py-3">Campanha</th>}
            </tr>
          </thead>
          <tbody>
            {ranking.map((row) => {
              const podium = row.overallPosition <= 3;

              return (
                <tr
                  key={row.pair.id}
                  className={cn(
                    "border-b border-slate-100 text-sm font-semibold",
                    row.overallPosition === 1 && "bg-amber-50",
                    row.classifying && row.overallPosition !== 1 && "bg-emerald-50",
                  )}
                >
                  <td className="px-3 py-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md font-black",
                        row.overallPosition === 1 ? "bg-amber-500 text-white" : podium ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-800",
                      )}
                    >
                      {row.overallPosition}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-slate-950">{row.pair.name}</span>
                      {row.overallPosition === 1 && (
                        <span className="inline-flex w-fit items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-black uppercase text-amber-800">
                          <Trophy className="h-3 w-3" aria-hidden="true" />
                          Melhor campanha
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-md bg-gradient-to-r ${row.group.theme.gradient} px-2.5 py-1 text-xs font-black uppercase text-white`}>
                      Grupo {row.group.number}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-center">{row.groupPosition}º</td>
                  <td className="px-2 py-3 text-center">{row.played}</td>
                  <td className="px-2 py-3 text-center text-emerald-700">{row.wins}</td>
                  <td className="px-2 py-3 text-center text-red-700">{row.losses}</td>
                  <td className="px-2 py-3 text-center">{row.pointsFor}</td>
                  <td className="px-2 py-3 text-center">{row.pointsAgainst}</td>
                  <td className={cn("px-2 py-3 text-center font-black", row.balance >= 0 ? "text-emerald-700" : "text-red-700")}>
                    {row.balance > 0 ? "+" : ""}
                    {row.balance}
                  </td>
                  {!compact && (
                    <td className="px-3 py-3">
                      {row.classifying ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-black uppercase text-white">
                          <Medal className="h-3.5 w-3.5" aria-hidden="true" />
                          Classifica no grupo
                        </span>
                      ) : (
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-black uppercase text-slate-600">
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
