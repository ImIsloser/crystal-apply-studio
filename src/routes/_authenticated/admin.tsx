import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { FloatingParticles } from "@/components/floating-particles";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel — Crystal Store" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type App = {
  id: string;
  nome: string;
  discord: string;
  idade: string;
  vaga: "Staff" | "Ajudante";
  horas: string;
  experiencia_sim_nao: string;
  experiencia_detalhes: string | null;
  motivo: string;
  conhecimento: string;
  fuso: string | null;
  status: string | null;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"todas" | "Staff" | "Ajudante">("todas");
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [open, setOpen] = useState<boolean | null>(null);
  const [savingOpen, setSavingOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { navigate({ to: "/auth" }); return; }
      const { data: roles } = await supabase
        .from("user_roles" as never)
        .select("role")
        .eq("user_id", userData.user.id);
      const admin = Array.isArray(roles) && roles.some((r: { role: string }) => r.role === "admin");
      setIsAdmin(admin);
      if (!admin) { setLoading(false); return; }
      const { data, error } = await supabase
        .from("applications" as never)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) toast.error("Erro ao carregar inscrições");
      setApps((data as App[]) ?? []);
      const { data: settings } = await (supabase
        .from("app_settings" as never)
        .select("applications_open")
        .eq("id", true)
        .maybeSingle() as unknown as Promise<{ data: { applications_open: boolean } | null }>);
      setOpen(settings ? settings.applications_open : true);
      setLoading(false);
    })();
  }, [navigate]);

  async function toggleOpen() {
    const next = !open;
    setSavingOpen(true);
    const { error } = await (supabase
      .from("app_settings" as never) as unknown as { update: (v: unknown) => { eq: (c: string, val: unknown) => Promise<{ error: unknown }> } })
      .update({ applications_open: next, updated_at: new Date().toISOString() })
      .eq("id", true);
    setSavingOpen(false);
    if (error) { toast.error("Não foi possível alterar. Tente de novo."); return; }
    setOpen(next);
    toast.success(next ? "Inscrições abertas ✦" : "Inscrições encerradas ♡");
  }

  async function updateStatus(id: string, status: string) {
    const prev = apps;
    setApps((a) => a.map((x) => (x.id === id ? { ...x, status } : x)));
    const { error } = await (supabase
      .from("applications" as never) as unknown as { update: (v: unknown) => { eq: (c: string, val: unknown) => Promise<{ error: unknown }> } })
      .update({ status }).eq("id", id);
    if (error) { setApps(prev); toast.error("Não foi possível salvar o status."); }
  }

  async function deleteApp(id: string, nome: string) {
    if (!window.confirm(`Excluir a inscrição de "${nome}"? Esta ação não pode ser desfeita.`)) return;
    const prev = apps;
    setApps((a) => a.filter((x) => x.id !== id));
    const { error } = await (supabase
      .from("applications" as never) as unknown as { delete: () => { eq: (c: string, val: unknown) => Promise<{ error: unknown }> } })
      .delete().eq("id", id);
    if (error) { setApps(prev); toast.error("Não foi possível excluir."); return; }
    toast.success("Inscrição excluída ♡");
  }

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (filter !== "todas" && a.vaga !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return [a.nome, a.discord, a.motivo, a.conhecimento].some((f) => (f || "").toLowerCase().includes(q));
      }
      return true;
    });
  }, [apps, filter, search]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function exportCsv() {
    const headers = ["Data","Status","Nome","Discord","Idade","Vaga","Horas/dia","Experiência","Detalhes exp.","Motivo","Conhecimento Roblox","Fuso/País"];
    const rows = filtered.map((a) => [
      new Date(a.created_at).toLocaleString("pt-BR"),
      a.status ?? "pendente",
      a.nome, a.discord, a.idade, a.vaga, a.horas,
      a.experiencia_sim_nao, a.experiencia_detalhes ?? "",
      a.motivo, a.conhecimento, a.fuso ?? "",
    ]);
    const esc = (v: string) => `"${String(v).replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
    const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map(esc).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inscricoes-crystal-store-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass-card p-8">Carregando ✦</div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="relative min-h-screen px-6 py-12">
        <FloatingParticles count={10} />
        <div className="mx-auto max-w-md">
          <div className="glass-card p-10 text-center">
            <h1 className="font-display text-2xl font-bold">Sem permissão ✦</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sua conta está autenticada, mas não tem permissão de administrador.
            </p>
            <button onClick={signOut} className="btn-crystal mt-6">Sair</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-4 py-8 md:px-8">
      <FloatingParticles count={10} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto max-w-7xl"
      >
        <div className="glass-card mb-6 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h1 className="font-display text-3xl font-bold glow-text">✧ Painel Crystal</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} de {apps.length} inscrições</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm focus:border-primary focus:outline-none"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm"
            >
              <option value="todas">Todas as vagas</option>
              <option value="Staff">Staff</option>
              <option value="Ajudante">Ajudante</option>
            </select>
            <button onClick={exportCsv} className="btn-crystal !px-5 !py-2 text-sm">⬇ Excel (CSV)</button>
            <button onClick={signOut} className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm hover:bg-white/80">Sair</button>
          </div>
        </div>

        <div className="glass-card mb-6 flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${open ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
              {open ? "✦" : "♡"}
            </span>
            <div>
              <p className="font-display font-bold text-foreground">
                Inscrições {open == null ? "..." : open ? "ABERTAS" : "ENCERRADAS"}
              </p>
              <p className="text-xs text-muted-foreground">
                {open
                  ? "O site público está recebendo novas inscrições."
                  : "O site público mostra a todos que as inscrições foram encerradas."}
              </p>
            </div>
          </div>
          <button
            onClick={toggleOpen}
            disabled={savingOpen || open == null}
            className={open ? "btn-ghost !px-5 !py-2.5 disabled:opacity-60" : "btn-crystal !px-5 !py-2.5 text-sm disabled:opacity-60"}
          >
            {savingOpen ? "Salvando..." : open ? "Encerrar inscrições" : "Reabrir inscrições ✧"}
          </button>
        </div>

        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-white/40 text-xs uppercase tracking-wider text-foreground/70">
                <tr>
                  {["Data","Status","Nome","Discord","Idade","Vaga","Horas","Exp.","Detalhes","Motivo","Conhecimento","Fuso","Ações"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-t border-white/40 align-top hover:bg-white/30">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3">
                      <select
                        value={a.status ?? "pendente"}
                        onChange={(e) => updateStatus(a.id, e.target.value)}
                        className={`cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold focus:outline-none ${
                          a.status === "aprovado"
                            ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                            : a.status === "reprovado"
                              ? "border-rose-300 bg-rose-100 text-rose-700"
                              : "border-white/70 bg-white/70 text-muted-foreground"
                        }`}
                      >
                        <option value="pendente">⏳ Pendente</option>
                        <option value="aprovado">✓ Aprovado</option>
                        <option value="reprovado">✕ Reprovado</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 font-medium">{a.nome}</td>
                    <td className="px-4 py-3">{a.discord}</td>
                    <td className="px-4 py-3">{a.idade}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${a.vaga === "Staff" ? "bg-primary/20 text-primary" : "bg-accent/40 text-accent-foreground"}`}>{a.vaga}</span>
                    </td>
                    <td className="px-4 py-3">{a.horas}</td>
                    <td className="px-4 py-3">{a.experiencia_sim_nao}</td>
                    <td className="max-w-[200px] px-4 py-3 text-xs">{a.experiencia_detalhes}</td>
                    <td className="max-w-[260px] px-4 py-3 text-xs">{a.motivo}</td>
                    <td className="max-w-[260px] px-4 py-3 text-xs">{a.conhecimento}</td>
                    <td className="px-4 py-3 text-xs">{a.fuso}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteApp(a.id, a.nome)}
                        title="Excluir inscrição"
                        aria-label="Excluir inscrição"
                        className="rounded-full px-2 py-1 text-base text-rose-500 transition hover:bg-rose-100"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={13} className="px-4 py-16 text-center text-muted-foreground">Nenhuma inscrição encontrada ⋆˚｡</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
