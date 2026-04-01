import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";

export default function LanguageToggle() {
  const { lang, toggle } = useLanguage();
  return (
    <button
      onClick={toggle}
      className="relative w-16 h-9 rounded-xl bg-secondary/50 border border-border flex items-center px-1 overflow-hidden hover:border-primary/30 transition-all"
      aria-label="Toggle language"
    >
      <motion.div
        animate={{ x: lang === "uk" ? 0 : 28 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center z-10"
      >
        <span className="text-xs font-bold text-primary leading-none">
          {lang === "uk" ? "UK" : "EN"}
        </span>
      </motion.div>
      <span className={`absolute text-xs font-mono transition-opacity ${lang === "uk" ? "right-1.5 opacity-40" : "left-1.5 opacity-40"} text-muted-foreground`}>
        {lang === "uk" ? "EN" : "UK"}
      </span>
    </button>
  );
}