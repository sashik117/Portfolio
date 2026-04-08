import { useState, useEffect } from "react";
import { supabase } from "@/api/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, RefreshCw } from "lucide-react";

const DEFAULT_SETTINGS = [
  { key: "stat_projects",       group: "stats",   value_uk: "25+", value_en: "25+",                                     label: "Проєктів (значення)" },
  { key: "stat_projects_label", group: "stats",   value_uk: "Запущених комерційних проєктів", value_en: "Commercial Projects Launched", label: "Проєктів (підпис)" },
  { key: "stat_years",          group: "stats",   value_uk: "4+",  value_en: "4+",                                      label: "Роки (значення)" },
  { key: "stat_years_label",    group: "stats",   value_uk: "Роки досвіду в розробці", value_en: "Years of Development Experience", label: "Роки (підпис)" },
  { key: "stat_code",           group: "stats",   value_uk: "90%", value_en: "90%",                                     label: "Якість коду (значення)" },
  { key: "stat_code_label",     group: "stats",   value_uk: "Коду проходить внутрішній аудит", value_en: "Code Passes Internal Security Audit", label: "Якість коду (підпис)" },
  { key: "stat_auto",           group: "stats",   value_uk: "10+", value_en: "10+",                                     label: "Автоматизацій (значення)" },
  { key: "stat_auto_label",     group: "stats",   value_uk: "Складних сценаріїв автоматизації", value_en: "Complex Automation Scenarios", label: "Автоматизацій (підпис)" },
  { key: "hero_desc",           group: "hero",    value_uk: "Створюю цифрові рішення, що працюють самі.", value_en: "I build digital solutions that run themselves.", label: "Hero — підзаголовок" },
  { key: "about_p1",            group: "about",   value_uk: "Все почалося з цікавості...", value_en: "It all started with curiosity...", label: "About — параграф 1" },
  { key: "about_p2",            group: "about",   value_uk: "Я не люблю складних рішень...", value_en: "I don't like complex solutions...", label: "About — параграф 2" },
  { key: "contact_email",       group: "contact", value_uk: "stewe.snowwhite@ukr.net", value_en: "stewe.snowwhite@ukr.net", label: "Контакт email" },
  { key: "contact_location",    group: "contact", value_uk: "Ужгород, UA", value_en: "Uzhhorod, UA",                   label: "Місто" },
];

const GROUPS = [
  { key: "stats",   label: "📊 Статистика" },
  { key: "hero",    label: "🦸 Hero секція" },
  { key: "about",   label: "👤 Про мене" },
  { key: "contact", label: "📬 Контакти" },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState({});
  const [initialized, setInitialized] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    const map = {};
    (data || []).forEach(s => { map[s.key] = s; });
    setSettings(map);
    setInitialized(true);
  };

  useEffect(() => { load(); }, []);

  const initDefaults = async () => {
    const { data: existing } = await supabase.from("site_settings").select("key");
    const existingKeys = (existing || []).map(s => s.key);
    const toCreate = DEFAULT_SETTINGS.filter(s => !existingKeys.includes(s.key));
    if (toCreate.length > 0) {
      await supabase.from("site_settings").insert(toCreate);
    }
    load();
  };

  const update = (key, field, value) => {
    setSettings(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const save = async (key) => {
    setSaving(prev => ({ ...prev, [key]: true }));
    const s = settings[key];
    if (s?.id) {
      await supabase.from("site_settings").update({ value_uk: s.value_uk, value_en: s.value_en }).eq("id", s.id);
    }
    setSaving(prev => ({ ...prev, [key]: false }));
  };

  if (!initialized) return <div className="text-center py-12 text-muted-foreground text-sm">Завантаження...</div>;

  const hasAny = Object.keys(settings).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Тексти і статистика</h2>
        {!hasAny && (
          <Button onClick={initDefaults} size="sm" variant="outline">
            <RefreshCw className="w-4 h-4 mr-1" /> Ініціалізувати значення
          </Button>
        )}
      </div>

      {!hasAny ? (
        <p className="text-center text-muted-foreground text-sm py-8">
          Натисни кнопку вище, щоб завантажити налаштування за замовчуванням.
        </p>
      ) : (
        GROUPS.map(group => (
          <div key={group.key} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground border-b border-border pb-2">{group.label}</h3>
            {DEFAULT_SETTINGS.filter(d => d.group === group.key).map(def => {
              const s = settings[def.key];
              if (!s) return null;
              return (
                <div key={def.key} className="p-4 rounded-xl bg-card border border-border space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">{def.label}</label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-muted-foreground mb-1 block">🇺🇦 UA</span>
                      <Input value={s.value_uk || ""} onChange={e => update(def.key, "value_uk", e.target.value)} className="bg-secondary/50 text-sm" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground mb-1 block">🇬🇧 EN</span>
                      <Input value={s.value_en || ""} onChange={e => update(def.key, "value_en", e.target.value)} className="bg-secondary/50 text-sm" />
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => save(def.key)} disabled={saving[def.key]} className="text-xs h-7">
                    {saving[def.key]
                      ? <div className="w-3 h-3 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                      : <><Check className="w-3 h-3 mr-1" />Зберегти</>}
                  </Button>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}