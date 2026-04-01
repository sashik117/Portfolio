import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export default function StatsBar() {
  const { t } = useLanguage();
  return (
    <section className="py-16 px-6 border-y border-border bg-secondary/20">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {t.stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.1 }}
            className="text-center">
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}