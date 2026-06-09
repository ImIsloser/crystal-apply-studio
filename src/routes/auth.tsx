import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { FloatingParticles } from "@/components/floating-particles";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin — Crystal Store" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Credenciais inválidas");
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
      <FloatingParticles count={14} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card glass-card-shimmer relative z-10 w-full max-w-md p-10"
      >
        <div className="mb-6 text-center">
          <div className="mb-2 text-2xl">𝜗ৎ</div>
          <h1 className="font-display text-3xl font-bold glow-text">Painel Crystal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acesso apenas para a administração ♡</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">E-mail</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full rounded-2xl border border-white/60 bg-white/60 px-4 py-2.5 text-sm backdrop-blur-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Senha</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full rounded-2xl border border-white/60 bg-white/60 px-4 py-2.5 text-sm backdrop-blur-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <button type="submit" disabled={loading} className="btn-crystal w-full disabled:opacity-60">
            {loading ? "Entrando..." : "Entrar ✦"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          O acesso é gerenciado pela equipe da Crystal Store.
        </p>
      </motion.div>
    </div>
  );
}
