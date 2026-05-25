import type { GroupId } from "@/lib/tournament/types";

export type Sponsor = {
  name: string;
  src: string;
  role: "organizer" | "court";
};

export type CourtSponsor = Sponsor & {
  groupId: GroupId;
  imagePosition?: string;
};

export const ORGANIZER: Sponsor = {
  name: "BIOBEACH",
  src: "/brand/biobeach-logo-white.png",
  role: "organizer",
};

export const COURT_SPONSORS: Record<GroupId, CourtSponsor> = {
  G1: {
    groupId: "G1",
    name: "Colégio Omega",
    src: "/sponsors/colegio-omega-clean.png",
    role: "court",
  },
  G2: {
    groupId: "G2",
    name: "Amaro Laboratório",
    src: "/sponsors/amaro-clean.png",
    role: "court",
  },
  G3: {
    groupId: "G3",
    name: "Tintas Santa Terezinha",
    src: "/sponsors/tintas-santa-terezinha-clean.png",
    role: "court",
  },
  G4: {
    groupId: "G4",
    name: "Sicoob Credisudeste",
    src: "/sponsors/sicoob-creditosudeste-clean.png",
    role: "court",
  },
  G5: {
    groupId: "G5",
    name: "Faminas",
    src: "/sponsors/faminas-clean.png",
    role: "court",
  },
  G6: {
    groupId: "G6",
    name: "Jerônimo Joias",
    src: "/sponsors/jeronimo-joias-clean.png",
    role: "court",
  },
  G7: {
    groupId: "G7",
    name: "Óticas Jerônimo",
    src: "/sponsors/oticas-jeronimo-clean.png",
    role: "court",
  },
  G8: {
    groupId: "G8",
    name: "Dr. Hélcio Rabelo Jr.",
    src: "/sponsors/dr-helcio-rabelo-clean.png",
    role: "court",
  },
};

export const COURT_SPONSOR_LIST = Object.values(COURT_SPONSORS).sort((a, b) => a.groupId.localeCompare(b.groupId));

export function getCourtSponsor(groupId: GroupId): CourtSponsor {
  return COURT_SPONSORS[groupId];
}
