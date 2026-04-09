import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useSiteSettings } from "@/lib/SiteSettingsContext";
import { supabase } from "@/api/SupabaseClient.js";

const FALLBACK_EXPERIENCE = [
  {
    id: "fe1",
    role: "Web Developer & Automation Specialist",
    company: "Freelance",
    period: "2022 — Сьогодні",
    description_uk: "Побудував систему інтеграції, яка повністю виключила ручне введення даних про клієнтів. Оптимізував ядро великого порталу, підвищивши швидкість його роботи вдвічі.",
    description_en: "Built an integration system that completely eliminated manual client data entry. Optimized the core of a large portal, doubling its performance speed.",
    tags: ["WordPress", "Node.js", "n8n", "API Integrations"],
  },
];

function TimelineItem({ exp, index }) {
  return (
    <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.12 }}
      className="relative pl-8 pb-12 last:pb-0">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.12 + 0.2, type: "spring" }}
        className="absolute left-0 top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-4 border-background" />
      <div className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{exp.role}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{exp.company}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/60 border border-border">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">{exp.period}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{exp.description}</p>
        <div className="flex flex-wrap gap-2">
          {(exp.tags || []).map((tag) => (
            <span key={tag} className="px-2.5 py-1 text-xs font-mono bg-primary/10 text-primary rounded-md">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const { lang } = useLanguage();
  const { getText } = useSiteSettings();
  const [items, setItems] = useState(FALLBACK_EXPERIENCE);

  const e = {
    label:     getText("experience_label", lang) || (lang === "uk" ? "02 — Досвід" : "02 — Experience"),
    title:     getText("experience_title", lang) || (lang === "uk" ? "Мій" : "My"),
    highlight: getText("experience_highlight", lang) || (lang === "uk" ? "шлях" : "journey"),
  };

  useEffect(() => {
    supabase.from("experience").select("*").order("order").then(({ data }) => {
      if (data && data.length > 0) setItems(data);
    });
  }, []);

  const adapted = items.map((exp) => ({
    ...exp,
    description: lang === "uk"
      ? (exp.description_uk || exp.description || "")
      : (exp.description_en || exp.description || ""),
  }));

  return (
    <section id="experience" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65, ease: "easeOut" }}
          className="mb-16">
          <span className="font-mono text-sm text-primary mb-3 block">{e.label}</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {e.title}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{e.highlight}</span>
          </h2>
        </motion.div>
        <div>
          {adapted.map((exp, i) => <TimelineItem key={exp.id || exp.company} exp={exp} index={i} />)}
        </div>
      </div>
    </section>
  );
}