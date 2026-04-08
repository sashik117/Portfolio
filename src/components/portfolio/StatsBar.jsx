import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { supabase } from "@/api/SupabaseClient.js";

const STAT_KEYS = [
  { value: "stat_projects", label: "stat_projects_label" },
  { value: "stat_years",    label: "stat_years_label" },
  { value: "stat_code",     label: "stat_code_label" },
  { value: "stat_auto",     label: "stat_auto_label" },
];

export default function StatsBar() {
  const { t, lang } = useLanguage();
  const [dbSettings, setDbSettings] = useState(null);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("group", "stats").then(({ data }) => {
      if (data && data.length > 0) {
        const map = {};
        data.forEach(s => { map[s.key] = s; });
        setDbSettings(map);
      }
    });
  }, []);

  const stats = dbSettings
    ? STAT_KEYS.map(({ value, label }) => ({
        value: dbSettings[value]?.[lang === "uk" ? "value_uk" : "value_en"] || "",
        label: dbSettings[label]?.[lang === "uk" ? "value_uk" : "value_en"] || "",
      }))
    : t.stats;

  return (
    <section className="py-16 px-6 border-y border-border bg-secondary/20">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }}
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