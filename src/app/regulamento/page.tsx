"use client";

import { FileText } from "lucide-react";
import { OfficialHeader, PremiumFooter } from "@/components/OfficialChrome";
import { useTournamentStore } from "@/lib/tournament/store";

export default function RegulationPage() {
  const { state } = useTournamentStore();
  const sections = state.regulation.body
    .split(/\n(?=\d+\.\s)/g)
    .map((section) => section.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen overflow-hidden bg-[#020403] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(132,204,22,0.12),transparent_34%),radial-gradient(circle_at_90%_16%,rgba(245,197,66,0.10),transparent_28%)]" />
      <OfficialHeader />

      <div className="relative z-10 mx-auto flex max-w-[1120px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-lime-300/20 bg-white/[0.055] p-5 shadow-[0_0_54px_rgba(132,204,22,0.10)] backdrop-blur sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-md border border-lime-300/25 bg-lime-300/10 px-3 py-2 text-xs font-black uppercase text-lime-200">
            <FileText className="h-4 w-4" aria-hidden="true" />
            Documento oficial
          </div>
          <h1 className="mt-5 text-4xl font-black uppercase leading-tight text-white sm:text-5xl">{state.regulation.title}</h1>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-slate-300 sm:text-base">{state.regulation.subtitle}</p>
        </section>

        <section className="grid gap-3">
          {sections.map((section, index) => {
            const [heading, ...content] = section.split("\n");

            return (
              <article key={`${heading}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.045] p-4 shadow-[0_0_26px_rgba(255,255,255,0.04)] backdrop-blur sm:p-5">
                <h2 className="text-lg font-black uppercase text-lime-200 sm:text-xl">{heading}</h2>
                <div className="mt-3 whitespace-pre-line text-sm font-bold leading-7 text-slate-200 sm:text-base">{content.join("\n")}</div>
              </article>
            );
          })}
        </section>
      </div>

      <PremiumFooter />
    </main>
  );
}
