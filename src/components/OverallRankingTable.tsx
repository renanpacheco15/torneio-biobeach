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
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-[0_0_34px_rgba(132,204,22,0.08)]">
      <div className="grid gap-2 p-2 sm:hidden">
        {ranking.map((row) => (
          <div
            key={row.pair.id}
            className={cn(
              "rounded-lg border border-white/10 bg-black/35 p-3",
              row.overallPosition === 1 && "border-amber-300/40 bg-amber-300/10",
              row.classifying && row.overallPosition !== 1 && "border-emerald-300/25 bg-emerald-400/10",
            )}
          >
            <div className="grid grid-cols-[auto_1fr] gap-3">
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-md font-black",
                  row.overallPosition === 1 ? "bg-amber-400 text-slate-950" : row.overallPosition <= 3 ? "bg-white text-slate-950" : "bg-white/10 text-white",
                )}
              >
                {row.overallPosition}
              </div>
              <div className="min-w-0">
                <div className="break-words text-sm font-black uppercase leading-snug text-white">{row.pair.name}</div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className={`inline-flex rounded-md bg-gradient-to-r ${row.group.theme.gradient} px-2 py-0.5 text-[10px] font-black uppercase text-white`}>
                    Grupo {row.group.number}
                  </span>
                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-black uppercase text-slate-300">
                    {row.groupPosition}º no grupo
                  </span>
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
            <div className="mt-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-center">
              <span className="text-[10px] font-black uppercase text-slate-500">Aprov.</span>
              <span className="ml-2 text-sm font-black text-lime-300">{Math.round(row.winRate * 100)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead className="bg-black text-white">
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
                    "border-b border-white/10 text-sm font-semibold text-slate-100",
                    row.overallPosition === 1 && "bg-amber-300/10",
                    row.classifying && row.overallPosition !== 1 && "bg-emerald-400/10",
                  )}
                >
                  <td className="px-3 py-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md font-black",
                        row.overallPosition === 1 ? "bg-amber-400 text-slate-950" : podium ? "bg-white text-slate-950" : "bg-white/10 text-slate-100",
                      )}
                    >
                      {row.overallPosition}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-white">{row.pair.name}</span>
                      {row.overallPosition === 1 && (
                        <span className="inline-flex w-fit items-center gap-1 rounded-md bg-amber-300 px-2 py-0.5 text-[11px] font-black uppercase text-slate-950">
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
                          Classifica no grupo
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
