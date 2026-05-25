"use client";

import Link from "next/link";
import { ChevronLeft, ClipboardList, LogOut, ShieldCheck } from "lucide-react";
import { AdminGate, clearAdminSession, useAdminSession } from "@/components/AdminGate";
import { Brand } from "@/components/Brand";
import { GROUPS } from "@/lib/tournament/data";

export default function AdminAccessPage() {
  return (
    <AdminGate title="Admin BioBeach">
      <AdminAccessContent />
    </AdminGate>
  );
}

function AdminAccessContent() {
  const session = useAdminSession();
  const isAdmin = session?.role === "admin";
  const allowedMesario = session?.role.startsWith("mesario-") ? Number(session.role.replace("mesario-", "")) : null;
  const visibleGroups = GROUPS.filter((group) => isAdmin || allowedMesario === group.number);

  return (
    <main className="min-h-screen bg-[#020403] px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(132,204,22,0.12),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(245,197,66,0.10),transparent_28%)]" />
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-5">
        <header className="flex flex-col gap-4 rounded-lg border border-white/10 bg-black/55 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <Brand dark compact />
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 text-xs font-black uppercase text-slate-200">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Início
            </Link>
            <button
              type="button"
              onClick={() => {
                clearAdminSession();
                window.location.reload();
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 text-xs font-black uppercase text-slate-200"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair
            </button>
          </div>
        </header>

        <section className="rounded-xl border border-lime-300/20 bg-white/[0.05] p-5 shadow-[0_0_54px_rgba(132,204,22,0.10)] sm:p-7">
          <div className="inline-flex items-center gap-2 rounded-md border border-lime-300/25 bg-lime-300/10 px-3 py-2 text-xs font-black uppercase text-lime-200">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Acesso operacional
          </div>
          <h1 className="mt-5 text-4xl font-black uppercase leading-none text-white sm:text-5xl">Admin BioBeach</h1>
          <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-slate-300">
            Área discreta para administrador central e mesários lançarem resultados em tempo real.
          </p>
        </section>

        <section className="grid gap-3">
          {isAdmin && (
            <Link
              href="/admin/master"
              className="group flex min-h-24 items-center justify-between gap-4 rounded-xl border border-amber-300/25 bg-amber-300/10 p-4 shadow-[0_0_34px_rgba(245,197,66,0.10)] transition hover:-translate-y-0.5 hover:bg-amber-300 hover:text-slate-950"
            >
              <div>
                <div className="text-xs font-black uppercase opacity-70">Painel central</div>
                <div className="mt-1 text-2xl font-black uppercase">Administrador</div>
              </div>
              <ShieldCheck className="h-8 w-8" aria-hidden="true" />
            </Link>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {visibleGroups.map((group) => (
              <Link
                key={group.id}
                href={`/mesario/${group.number}`}
                className={`relative min-h-36 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${group.theme.gradient} p-4 shadow-[0_0_26px_rgba(255,255,255,0.05)] transition hover:-translate-y-0.5`}
              >
                <div className="absolute inset-0 bg-slate-950/45" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="rounded-md bg-black/35 px-2.5 py-1 text-xs font-black uppercase text-white">Mesário {group.number}</div>
                    <ClipboardList className="h-5 w-5 text-white/85" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-4xl font-black leading-none">{String(group.number).padStart(2, "0")}</div>
                    <div className="mt-2 text-lg font-black uppercase leading-tight">{group.shortName}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
