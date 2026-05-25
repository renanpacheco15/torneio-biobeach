"use client";

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";

const SESSION_KEY = "biobeach:admin-session";
const ADMIN_PASSWORD = "renan123";

export type AdminRole = "admin" | `mesario-${number}`;

const roleOptions: Array<{ role: AdminRole; label: string }> = [
  { role: "admin", label: "Administrador geral" },
  ...Array.from({ length: 9 }, (_, index) => ({
    role: `mesario-${index + 1}` as AdminRole,
    label: `Mesário ${index + 1}`,
  })),
];

type AdminSession = {
  role: AdminRole;
  at: string;
};

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? "null") as AdminSession | null;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  if (typeof window !== "undefined") window.localStorage.removeItem(SESSION_KEY);
}

export function useAdminSession() {
  return getAdminSession();
}

export function AdminGate({
  children,
  allowedRoles,
  title = "Acesso operacional BIOBEACH",
}: {
  children: ReactNode;
  allowedRoles?: AdminRole[];
  title?: string;
}) {
  const [session, setSession] = useState<AdminSession | null>(() => getAdminSession());

  const allowed = session && (!allowedRoles?.length || allowedRoles.includes(session.role) || session.role === "admin");

  if (allowed) return <>{children}</>;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020403] px-4 py-8 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(132,204,22,0.14),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(245,197,66,0.12),transparent_28%)]" />
      <AdminLoginPanel
        title={title}
        allowedRoles={allowedRoles}
        onSuccess={(nextSession) => setSession(nextSession)}
        denied={Boolean(session)}
      />
    </main>
  );
}

function AdminLoginPanel({
  title,
  allowedRoles,
  onSuccess,
  denied,
}: {
  title: string;
  allowedRoles?: AdminRole[];
  onSuccess: (session: AdminSession) => void;
  denied: boolean;
}) {
  const availableRoles = allowedRoles?.length ? roleOptions.filter((option) => allowedRoles.includes(option.role) || option.role === "admin") : roleOptions;
  const [role, setRole] = useState<AdminRole>(availableRoles[0]?.role ?? "admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(denied ? "Seu perfil atual não tem permissão para esta área." : null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== ADMIN_PASSWORD) {
      setError("Senha operacional incorreta.");
      return;
    }

    const session = { role, at: new Date().toISOString() };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setError(null);
    onSuccess(session);
  };

  return (
    <form onSubmit={submit} className="relative z-10 w-full max-w-md rounded-xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_0_60px_rgba(132,204,22,0.12)] backdrop-blur">
      <div className="inline-flex items-center gap-2 rounded-md border border-lime-300/25 bg-lime-300/10 px-3 py-2 text-xs font-black uppercase text-lime-200">
        <LockKeyhole className="h-4 w-4" aria-hidden="true" />
        Área protegida
      </div>
      <h1 className="mt-4 text-3xl font-black uppercase leading-tight">{title}</h1>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-300">Entre com o perfil operacional e a senha local do evento.</p>

      <label className="mt-5 block">
        <span className="text-xs font-black uppercase text-slate-400">Perfil</span>
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as AdminRole)}
          className="mt-1 h-12 w-full rounded-md border border-white/10 bg-slate-950 px-3 font-black text-white outline-none focus:border-lime-300"
        >
          {availableRoles.map((option) => (
            <option key={option.role} value={option.role}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-black uppercase text-slate-400">Senha</span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          className="mt-1 h-12 w-full rounded-md border border-white/10 bg-slate-950 px-3 font-bold text-white outline-none focus:border-lime-300"
          placeholder="Senha operacional"
        />
      </label>

      {error && <div className="mt-3 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-200">{error}</div>}

      <button type="submit" className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-lime-300 text-sm font-black uppercase text-slate-950">
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        Entrar
      </button>

      <div className="mt-3 text-xs font-bold text-slate-500">Acesso restrito à operação do torneio.</div>
    </form>
  );
}
