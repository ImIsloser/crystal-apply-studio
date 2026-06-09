import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { FloatingParticles } from "@/components/floating-particles";
import { Reveal } from "@/components/reveal";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "✦ Crystal Store ✦ — Inscrições para a Equipe 𝜗ৎ" },
      { name: "description", content: "Inscrições abertas: 2 vagas de Staff e 1 de Ajudante na Crystal Store." },
    ],
  }),
  component: Home,
});

const schema = z.object({
  nome: z.string().trim().min(1, "Nome obrigatório").max(80),
  discord: z.string().trim().min(2, "Discord obrigatório").max(60),
  idade: z.string().trim().min(1, "Idade obrigatória").max(3),
  vaga: z.enum(["Staff", "Ajudante"]),
  horas: z.string().trim().min(1, "Informe quantas horas").max(40),
  experiencia_sim_nao: z.enum(["Sim", "Não"]),
  experiencia_detalhes: z.string().max(800).optional().or(z.literal("")),
  motivo: z.string().trim().min(10, "Conte um pouco mais ♡").max(1500),
  conhecimento: z.string().trim().min(2, "Obrigatório").max(1500),
  fuso: z.string().max(80).optional().or(z.literal("")),
});

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <FloatingParticles />
      <main className="relative z-10">
        <Hero />
        <Vagas />
        <FormSection />
        <Footer />
      </main>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl"
      >
        <div className="mb-4 flex items-center justify-center gap-3 text-2xl">
          <span className="sparkle inline-block" style={{ color: "oklch(0.7 0.18 340)" }}>✦</span>
          <span className="sparkle inline-block" style={{ animationDelay: "0.4s", color: "oklch(0.7 0.16 310)" }}>𝜗ৎ</span>
          <span className="sparkle inline-block" style={{ animationDelay: "0.8s", color: "oklch(0.7 0.18 340)" }}>✦</span>
        </div>
        <h1 className="glow-text font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          Crystal Store
        </h1>
        <p className="mt-5 font-display text-xl text-foreground/80 md:text-2xl">
          Inscrições para a Equipe <span style={{ color: "oklch(0.6 0.18 340)" }}>𝜗ৎ</span>
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
          Estamos abrindo <strong>2 vagas de Staff</strong> e <strong>1 vaga de Ajudante</strong> para
          ajudar a cuidar do nosso servidor de compra e venda de itens de Roblox.
          Se você é organizada, gentil e quer fazer parte da família Crystal, sua hora chegou ♡
        </p>
        <motion.div className="mt-10" whileHover={{ scale: 1.05 }}>
          <a href="#formulario" className="btn-crystal inline-flex items-center gap-2 text-base">
            ✧ Quero me inscrever ✧
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 text-2xl text-foreground/40"
      >
        ⋆˚꩜｡
      </motion.div>
    </section>
  );
}

function Vagas() {
  const items = [
    {
      titulo: "Staff",
      vagas: 2,
      desc: "Responsável por atendimento, organização e moderação do servidor. Você será o rosto da Crystal Store para nossa comunidade.",
      emoji: "✦",
    },
    {
      titulo: "Ajudante",
      vagas: 1,
      desc: "Auxilia a equipe nas tarefas do dia a dia, ajudando com pequenas missões, suporte e manutenção do servidor.",
      emoji: "♡",
    },
  ];
  return (
    <section id="vagas" className="relative px-6 py-24">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl font-bold glow-text md:text-5xl">⋆˚꩜｡ Vagas Abertas ⋆˚꩜｡</h2>
        <p className="mt-3 text-muted-foreground">Escolha a vaga ideal pra você ♡</p>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
        {items.map((v, i) => (
          <Reveal key={v.titulo} delay={i * 0.15}>
            <motion.div
              whileHover={{ y: -6 }}
              className="glass-card glass-card-shimmer float-soft h-full p-8"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <div className="mb-3 text-3xl" style={{ color: "oklch(0.7 0.18 340)" }}>{v.emoji}</div>
              <h3 className="font-display text-2xl font-bold">{v.titulo}</h3>
              <span className="mt-1 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                {v.vagas} {v.vagas === 1 ? "vaga" : "vagas"}
              </span>
              <p className="mt-4 text-sm leading-relaxed text-foreground/80">{v.desc}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground/85">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-2xl border border-white/60 bg-white/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 backdrop-blur-md transition focus:border-primary focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/30";

function FormSection() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [expSimNao, setExpSimNao] = useState<"Sim" | "Não">("Não");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Verifique os campos");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("applications").insert({
      nome: parsed.data.nome,
      discord: parsed.data.discord,
      idade: parsed.data.idade,
      vaga: parsed.data.vaga,
      horas: parsed.data.horas,
      experiencia_sim_nao: parsed.data.experiencia_sim_nao,
      experiencia_detalhes: parsed.data.experiencia_detalhes || null,
      motivo: parsed.data.motivo,
      conhecimento: parsed.data.conhecimento,
      fuso: parsed.data.fuso || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Não foi possível enviar. Tente novamente ♡");
      return;
    }
    setSuccess(true);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <section id="formulario" className="relative px-6 py-24">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl font-bold glow-text md:text-5xl">𝜗ৎ Formulário de Inscrição 𝜗ৎ</h2>
        <p className="mt-3 text-muted-foreground">Preencha com carinho ⋆˚꩜｡</p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-12 max-w-3xl">
          <AnimatePresence mode="wait">
            {success ? (
              <SuccessMessage onAgain={() => setSuccess(false)} />
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={onSubmit}
                className="glass-card grid gap-5 p-8 md:p-10"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Nome / Apelido ♡">
                    <input name="nome" required maxLength={80} className={inputCls} placeholder="Como devemos te chamar?" />
                  </Field>
                  <Field label="Usuário do Discord ✦">
                    <input name="discord" required maxLength={60} className={inputCls} placeholder="@usuario ou nome#0000" />
                  </Field>
                  <Field label="Idade">
                    <input name="idade" required maxLength={3} inputMode="numeric" className={inputCls} placeholder="ex: 16" />
                  </Field>
                  <Field label="Quantas horas por dia online?">
                    <input name="horas" required maxLength={40} className={inputCls} placeholder="ex: 3 a 5 horas" />
                  </Field>
                  <Field label="Para qual vaga? 𝜗ৎ">
                    <select name="vaga" required className={inputCls} defaultValue="Staff">
                      <option value="Staff">Staff (2 vagas)</option>
                      <option value="Ajudante">Ajudante (1 vaga)</option>
                    </select>
                  </Field>
                  <Field label="Fuso horário / país (opcional)">
                    <input name="fuso" maxLength={80} className={inputCls} placeholder="ex: Brasil - GMT-3" />
                  </Field>
                </div>

                <Field label="Já teve experiência como staff/moderador?">
                  <div className="flex gap-3">
                    {(["Sim", "Não"] as const).map((opt) => (
                      <label key={opt} className={`flex-1 cursor-pointer rounded-2xl border px-4 py-2.5 text-center text-sm transition ${expSimNao === opt ? "border-primary bg-primary/15 font-semibold text-primary" : "border-white/60 bg-white/40"}`}>
                        <input
                          type="radio"
                          name="experiencia_sim_nao"
                          value={opt}
                          checked={expSimNao === opt}
                          onChange={() => setExpSimNao(opt)}
                          className="sr-only"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label="Conte sobre suas experiências (opcional se respondeu Não)">
                  <textarea name="experiencia_detalhes" rows={3} maxLength={800} className={inputCls} placeholder="Onde, quanto tempo, o que fazia..." />
                </Field>

                <Field label="Por que quer fazer parte da equipe da Crystal Store? ♡">
                  <textarea name="motivo" required rows={4} maxLength={1500} className={inputCls} placeholder="Conta tudo pra gente ✦" />
                </Field>

                <Field label="O que você sabe sobre venda de itens de Roblox? (Adopt Me, MM2, The Facility, Robux)">
                  <textarea name="conhecimento" required rows={4} maxLength={1500} className={inputCls} placeholder="Pode ser pouquinho, queremos te conhecer ♡" />
                </Field>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-crystal mt-2 w-full text-base disabled:opacity-60"
                >
                  {submitting ? "Enviando..." : "Enviar inscrição ♡"}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}

function SuccessMessage({ onAgain }: { onAgain: () => void }) {
  const pieces = Array.from({ length: 28 }).map((_, i) => ({
    s: ["♡", "✦", "⋆", "✧"][i % 4],
    cx: (Math.random() - 0.5) * 400,
    cy: -150 - Math.random() * 200,
    delay: Math.random() * 0.4,
    size: 14 + Math.random() * 22,
    color: i % 2 === 0 ? "oklch(0.7 0.18 340)" : "oklch(0.7 0.16 300)",
  }));
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="glass-card glass-card-shimmer relative p-12 text-center"
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {pieces.map((p, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              fontSize: p.size,
              color: p.color,
              ["--cx" as never]: `${p.cx}px`,
              ["--cy" as never]: `${p.cy}px`,
              animation: `confetti 1.6s ease-out ${p.delay}s forwards`,
            }}
          >
            {p.s}
          </span>
        ))}
      </div>
      <div className="relative">
        <div className="mb-4 text-5xl">𝜗ৎ</div>
        <h3 className="font-display text-3xl font-bold glow-text">Inscrição enviada com sucesso!</h3>
        <p className="mt-3 text-foreground/80">
          Obrigada por se inscrever ♡ Em breve a administração da Crystal Store entrará em contato com você.
        </p>
        <button onClick={onAgain} className="btn-crystal mt-8">Enviar outra ✧</button>
      </div>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="relative px-6 pb-10 pt-4 text-center text-sm text-foreground/70">
      <p>Feito com ♡ para a Crystal Store ⋆˚꩜｡</p>
      <Link to="/admin" className="mt-2 inline-block text-xs text-muted-foreground/70 hover:text-primary">
        área da administração
      </Link>
    </footer>
  );
}
