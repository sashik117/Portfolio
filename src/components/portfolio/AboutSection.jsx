import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Palette, Zap, Globe } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const ICONS = [Code2, Palette, Zap, Globe];

const skills = [
  { name: "WordPress (PHP, Custom Plugins, Timber)", level: 95 },
  { name: "Automation (n8n, Webhooks, API)", level: 90 },
  { name: "Node.js / TypeScript", level: 85 },
  { name: "Database (MySQL, MongoDB, Redis)", level: 80 },
  { name: "Frontend (React / Modern JS)", level: 75 },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.65, ease: "easeOut", delay },
});

function SkillBar({ name, level, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium">{name}</span>
        <span className="font-mono text-muted-foreground">{level}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.1, delay, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent" />
      </div>
    </div>
  );
}

export default function AboutSection() {
  const { t } = useLanguage();
  const a = t.about;
  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-16">
          <span className="font-mono text-sm text-primary mb-3 block">{a.label}</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {a.title}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{a.highlight}</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}>
            <p className="text-muted-foreground leading-relaxed mb-6">{a.p1}</p>
            <p className="text-muted-foreground leading-relaxed mb-10">{a.p2}</p>
            <div className="grid grid-cols-2 gap-4">
              {a.highlights.map(({ label, desc }, i) => {
                const Icon = ICONS[i];
                return (
                  <motion.div key={label} {...fadeUp(0.2 + i * 0.1)}
                    className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/20 transition-colors group">
                    <Icon className="w-5 h-5 text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-semibold mb-1">{label}</h4>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
            className="space-y-6">
            <h3 className="text-lg font-semibold mb-6">{a.skillsTitle}</h3>
            {skills.map((skill, i) => <SkillBar key={skill.name} {...skill} delay={0.3 + i * 0.1} />)}
            <div className="pt-6 flex flex-wrap gap-2">
              {["Git", "Docker", "Uspacy", "1C Integration", "Webra", "REST API", "JSON", "PHP"].map((tag) => (
                <motion.span key={tag} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.3 }}
                  className="px-3 py-1.5 text-xs font-mono bg-secondary/60 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/20 transition-colors cursor-default">
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}