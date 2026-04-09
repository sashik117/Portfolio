import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/api/SupabaseClient";

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const [projects, setProjects] = useState(null);
  const [experience, setExperience] = useState(null);
  const [siteSettings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("order");
    if (data?.length) setProjects(data);
  };

  const loadExperience = async () => {
    const { data } = await supabase.from("experience").select("*").order("order");
    if (data?.length) setExperience(data);
  };

  const loadSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    const map = {};
    (data || []).forEach((s) => { map[s.key] = s; });
    setSiteSettings(map); // ✅ без if — завжди оновлюємо
  };

  useEffect(() => {
    Promise.all([loadProjects(), loadExperience(), loadSettings()])
      .finally(() => setLoading(false));

    const projectsSub = supabase
      .channel("projects-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, loadProjects)
      .subscribe();

    const experienceSub = supabase
      .channel("experience-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "experience" }, loadExperience)
      .subscribe();

    const settingsSub = supabase
      .channel("settings-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, loadSettings)
      .subscribe();

    return () => {
      supabase.removeChannel(projectsSub);
      supabase.removeChannel(experienceSub);
      supabase.removeChannel(settingsSub);
    };
  }, []);

  const getText = (key, lang) => {
    const item = siteSettings?.[key];
    if (!item) return "";
    return lang === "uk" ? (item.value_uk || "") : (item.value_en || "");
  };

  return (
    <SiteSettingsContext.Provider value={{ projects, experience, siteSettings, getText, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}