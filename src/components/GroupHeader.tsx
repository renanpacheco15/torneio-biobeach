import type { ReactNode } from "react";
import { CourtSponsorBackdrop } from "@/components/Sponsors";
import type { Group } from "@/lib/tournament/types";

type GroupHeaderProps = {
  group: Group;
  right?: ReactNode;
};

export function GroupHeader({ group, right }: GroupHeaderProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${group.theme.gradient} text-white shadow-broadcast`}>
      <CourtSponsorBackdrop group={group} />
      <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-black uppercase opacity-80">{group.court}</div>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-normal sm:text-4xl">{group.name}</h1>
          <p className="text-sm font-bold opacity-85">{group.sponsor}</p>
        </div>
        {right}
      </div>
    </div>
  );
}
