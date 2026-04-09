import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Github, Send, Mail } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useSiteSettings } from "@/lib/SiteSettingsContext";

const SOCIAL_LINKS = {
  github: "https://github.com/stewe-snowwhite",
  telegram: "https://t.me/stewe_snowwhite",
  email: "mailto:stewe.snowwhite@ukr.net",
};

export default function HeroSection() {
  const { lang } = useLanguage();
  const { getText } = useSiteSettings();

  const h = {
    available: getText("hero_available", lang),
    greeting: getText("hero_greeting", lang),
    roles: getText("hero_roles", lang)?.split(", ").filter(Boolean) || [],
    desc: getText("hero_desc", lang),
    btn1: getText("hero_btn1", lang),
    btn2: getText("hero_btn2", lang),
  };

  const [display, setDisplay] = useState("");
  const state = useRef({ roleIndex: 0, charIndex: 0, deleting: false, pausing: false });

  useEffect(() => {
    state.current = { roleIndex: 0, charIndex: 0, deleting: false, pausing: false };
    setDisplay("");
  }, [lang]);

  useEffect(() => {
    if (!h.roles.length) return;
    let timer;

    const tick = () => {
      const s = state.current;
      const roles = h.roles;
      const word = roles[s.roleIndex];

      if (s.pausing) {
        s.pausing = false;
        s.deleting = true;
        timer = setTimeout(tick, 1800);
        return;
      }

      if (!s.deleting) {
        s.charIndex += 1;
        setDisplay(word.slice(0, s.charIndex));
        if (s.charIndex === word.length) {
          s.pausing = true;
          timer = setTimeout(tick, 1800);
        } else {
          timer = setTimeout(tick, 85);
        }
      } else {
        s.charIndex -= 1;
        setDisplay(word.slice(0, s.charIndex));
        if (s.charIndex === 0) {
          s.deleting = false;
          s.roleIndex = (s.roleIndex + 1) % roles.length;
          timer = setTimeout(tick, 300);
        } else {
          timer = setTimeout(tick, 40);
        }
      }
    };

    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [h.roles.join(",")]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">{h.available}</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6"
        >
          <span className="text-foreground">{h.greeting} </span>
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Stewe</span>
        </motion.h1>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="h-10 mb-8 flex items-center justify-center">
          <span className="font-mono text-lg sm:text-xl text-muted-foreground">
            {">"} {display}<span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse" />
          </span>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
          {h.desc}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-4">
          <button onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-all glow-primary">
            {h.btn1}
          </button>
          <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3.5 bg-secondary border border-border text-foreground rounded-xl font-medium text-sm hover:bg-secondary/80 transition-all">
            {h.btn2}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-4 mt-12">
          {[
            { icon: Github, label: "GitHub", href: SOCIAL_LINKS.github },
            { icon: Send, label: "Telegram", href: SOCIAL_LINKS.telegram },
            { icon: Mail, label: "Email", href: SOCIAL_LINKS.email },
          ].map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
              className="w-10 h-10 rounded-xl bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-muted-foreground/50">
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}