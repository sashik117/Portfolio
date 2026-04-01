import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/LanguageContext";

const CATEGORIES_UK = ["Всі", "Full-Stack", "Automation", "Backend"];
const CATEGORIES_EN = ["All", "Full-Stack", "Automation", "Backend"];

const projects = [
  {
    title: "Smart Dealer Ecosystem",
    descUk: "Повна автоматизація бізнес-процесів дилерського центру. Зв'язав сайт на WordPress із 1С та CRM-системами Webra та Uspacy. Використав n8n для складних сценаріїв передачі даних між сервісами в реальному часі.",
    descEn: "Full automation of dealership business processes. Connected a WordPress site with 1C and CRM systems Webra and Uspacy. Used n8n for complex real-time data transfer scenarios between services.",
    tags: ["PHP", "Node.js", "n8n", "REST API", "Webhooks"],
    color: "from-primary/20 to-accent/20",
    categories: ["Full-Stack", "Automation"],
    liveUrl: "https://github.com/stewe-snowwhite", githubUrl: "https://github.com/stewe-snowwhite",
  },
  {
    title: "Automated Sales Funnel",
    descUk: "Система автоматичного збору лідів з сайту та їх розподілу в CRM через n8n з інтеграцією месенджерів. Повністю виключила ручне опрацювання вхідних заявок.",
    descEn: "Automatic lead collection system from the website and distribution to CRM via n8n with messenger integration. Completely eliminated manual processing of incoming requests.",
    tags: ["Node.js", "n8n", "Telegram API"],
    color: "from-accent/20 to-chart-3/20",
    categories: ["Backend", "Automation"],
    liveUrl: "https://github.com/stewe-snowwhite", githubUrl: "https://github.com/stewe-snowwhite",
  },
];

function ProjectCard({ project, viewLabel }) {
  const { lang } = useLanguage();
  const desc = lang === "uk" ? project.descUk : project.descEn;
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }} transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-colors duration-300">
      <div className={`h-1 bg-gradient-to-r ${project.color}`} />

      <div className={`relative h-48 bg-gradient-to-br ${project.color} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <motion.div whileHover={{ scale: 1.05, rotate: -2 }}
          className="relative w-3/4 h-32 bg-background/80 backdrop-blur-sm rounded-lg border border-border shadow-2xl p-4">
          <div className="flex gap-1.5 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-chart-4/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-chart-5/60" />
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-primary/20 rounded-full w-3/4" />
            <div className="h-2 bg-muted rounded-full w-1/2" />
            <div className="h-2 bg-muted rounded-full w-2/3" />
          </div>
        </motion.div>
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 px-6">
          <p className="text-sm font-medium text-foreground text-center">{project.title}</p>
          <div className="flex gap-3">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
              <ExternalLink className="w-3.5 h-3.5" />{viewLabel}
            </a>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors">
              <Github className="w-3.5 h-3.5" />GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{project.title}</h3>
          <div className="flex gap-2">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{desc}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-mono bg-secondary/60 border border-border text-muted-foreground">{tag}</Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const { t, lang } = useLanguage();
  const p = t.projects;
  const CATEGORIES = lang === "uk" ? CATEGORIES_UK : CATEGORIES_EN;
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  const filtered = activeCategory === CATEGORIES[0]
    ? projects
    : projects.filter((proj) => proj.categories.includes(activeCategory));

  return (
    <section id="projects" className="py-32 px-6 relative">
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65, ease: "easeOut" }}
          className="mb-12">
          <span className="font-mono text-sm text-primary mb-3 block">{p.label}</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {p.title}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{p.highlight}</span>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`relative px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/50 text-muted-foreground border-border hover:text-foreground hover:border-primary/20"
              }`}>
              {cat}
              <span className={`ml-2 text-xs font-mono ${activeCategory === cat ? "opacity-80" : "opacity-50"}`}>
                {cat === CATEGORIES[0] ? projects.length : projects.filter((proj) => proj.categories.includes(cat)).length}
              </span>
            </button>
          ))}
        </motion.div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project.title} project={project} viewLabel={p.view} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground py-16">
            {p.noProjects}
          </motion.p>
        )}
      </div>
    </section>
  );
}