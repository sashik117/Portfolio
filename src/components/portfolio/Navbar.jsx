import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/lib/LanguageContext";

export default function Navbar() {
  const { t } = useLanguage();
  const n = t.nav;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const navLinks = [
    { label: n.home, href: "#hero" },
    { label: n.about, href: "#about" },
    { label: n.projects, href: "#projects" },
    { label: n.experience, href: "#experience" },
    { label: n.testimonials, href: "#testimonials" },
    { label: n.contact, href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);

    // Оновлена логіка: використовуємо поріг видимості для кращого детекту великих секцій
    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -70% 0px", // Змістили фокус ближче до верху екрана
      threshold: [0.1, 0.5], // Реагує на 10% та 50% видимості секції
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Якщо секція перетинає верхню частину екрана
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    navLinks.forEach((link) => {
      const sectionId = link.href.replace("#", "");
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const handleClick = (href) => {
    setMobileOpen(false);
    const sectionId = href.replace("#", "");
    
    // Тимчасово відключаємо обзервер, щоб він не "перебивав" підсвітку під час польоту скролу
    setActiveSection(sectionId); 
    
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // Відступ, щоб навбар не закривав заголовок
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => handleClick("#hero")} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <span className="font-mono font-semibold text-sm text-foreground">
            dev<span className="text-primary">.portfolio</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            
            return (
              <button
                key={link.href}
                onClick={() => handleClick(link.href)}
                className={`relative px-4 py-2 text-sm transition-all duration-300 rounded-lg ${
                  isActive 
                    ? "text-primary bg-primary/10 font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden">
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;

                return (
                  <button key={link.href} onClick={() => handleClick(link.href)}
                    className={`block w-full text-left px-4 py-3 text-sm rounded-lg transition-colors ${
                      isActive 
                        ? "text-primary bg-primary/10 font-medium" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}>
                    {link.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}