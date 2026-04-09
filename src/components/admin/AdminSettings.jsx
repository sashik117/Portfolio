import { useState, useEffect } from "react";
import { supabase } from "@/api/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

const DEFAULT_SETTINGS = [
  { key: "stat_projects",       group: "stats",   type: "input",    value_uk: "25+",   value_en: "25+",   label: "Проєктів — значення" },
  { key: "stat_projects_label", group: "stats",   type: "input",    value_uk: "Запущених комерційних проєктів", value_en: "Commercial Projects Launched", label: "Проєктів — підпис" },
  { key: "stat_years",          group: "stats",   type: "input",    value_uk: "4+",    value_en: "4+",    label: "Роки — значення" },
  { key: "stat_years_label",    group: "stats",   type: "input",    value_uk: "Роки досвіду в розробці", value_en: "Years of Development Experience", label: "Роки — підпис" },
  { key: "stat_code",           group: "stats",   type: "input",    value_uk: "90%",   value_en: "90%",   label: "Якість коду — значення" },
  { key: "stat_code_label",     group: "stats",   type: "input",    value_uk: "Коду проходить внутрішній аудит", value_en: "Code Passes Internal Security Audit", label: "Якість коду — підпис" },
  { key: "stat_auto",           group: "stats",   type: "input",    value_uk: "10+",   value_en: "10+",   label: "Автоматизацій — значення" },
  { key: "stat_auto_label",     group: "stats",   type: "input",    value_uk: "Складних сценаріїв автоматизації", value_en: "Complex Automation Scenarios", label: "Автоматизацій — підпис" },
  { key: "hero_available",      group: "hero",    type: "input",    value_uk: "Зосереджений на проєкті, але відкритий до ідей", value_en: "Focused on a project, but open to ideas", label: "Статус (зелена кнопка)" },
  { key: "hero_greeting",       group: "hero",    type: "input",    value_uk: "Привіт, я", value_en: "Hi, I'm", label: "Вітання перед ім'ям" },
  { key: "hero_roles",          group: "hero",    type: "input",    value_uk: "Full-Stack Developer, Automation Expert, WordPress Architect, Node.js Developer", value_en: "Full-Stack Developer, Automation Expert, WordPress Architect, Node.js Developer", label: "Ролі (через кому)" },
  { key: "hero_desc",           group: "hero",    type: "textarea", value_uk: "Створюю цифрові рішення, що працюють самі.", value_en: "I build digital solutions that run themselves.", label: "Опис (підзаголовок)" },
  { key: "hero_btn1",           group: "hero",    type: "input",    value_uk: "Мої роботи", value_en: "View My Work", label: "Кнопка 1" },
  { key: "hero_btn2",           group: "hero",    type: "input",    value_uk: "Зв'язатися", value_en: "Get In Touch", label: "Кнопка 2" },
  { key: "about_label",         group: "about",   type: "input",    value_uk: "01 — Про мене", value_en: "01 — About", label: "Мітка секції" },
  { key: "about_title",         group: "about",   type: "input",    value_uk: "Техніка, яка працює", value_en: "Tech that works", label: "Заголовок" },
  { key: "about_highlight",     group: "about",   type: "input",    value_uk: "на бізнес", value_en: "for business", label: "Заголовок — виділена частина" },
  { key: "about_p1",            group: "about",   type: "textarea", value_uk: "Все почалося з цікавості...", value_en: "It all started with curiosity...", label: "Параграф 1" },
  { key: "about_p2",            group: "about",   type: "textarea", value_uk: "Я не люблю складних рішень...", value_en: "I don't like complex solutions...", label: "Параграф 2" },
  { key: "about_skills_title",  group: "about",   type: "input",    value_uk: "Технічні навички", value_en: "Technical Skills", label: "Заголовок навичок" },
  { key: "about_h1_label",      group: "about",   type: "input",    value_uk: "Продуктивність", value_en: "Performance", label: "Картка 1 — заголовок" },
  { key: "about_h1_desc",       group: "about",   type: "textarea", value_uk: "Пишу легкий код без зайвих плагінів", value_en: "Lightweight code without unnecessary plugins", label: "Картка 1 — опис" },
  { key: "about_h2_label",      group: "about",   type: "input",    value_uk: "Автоматизація", value_en: "Automation", label: "Картка 2 — заголовок" },
  { key: "about_h2_desc",       group: "about",   type: "textarea", value_uk: "З'єдную сервіси через n8n так, щоб дані «бігали» самі", value_en: "Connecting services via n8n so data flows on its own", label: "Картка 2 — опис" },
  { key: "about_h3_label",      group: "about",   type: "input",    value_uk: "Чистота коду", value_en: "Clean Code", label: "Картка 3 — заголовок" },
  { key: "about_h3_desc",       group: "about",   type: "textarea", value_uk: "Будь-який розробник відкриє мій проєкт і одразу все зрозуміє", value_en: "Any developer can open my project and understand it immediately", label: "Картка 3 — опис" },
  { key: "about_h4_label",      group: "about",   type: "input",    value_uk: "Прозорість", value_en: "Transparency", label: "Картка 4 — заголовок" },
  { key: "about_h4_desc",       group: "about",   type: "textarea", value_uk: "Завжди поясню технічні нюанси простою мовою", value_en: "Always explain technical details in plain language", label: "Картка 4 — опис" },
  { key: "contact_label",       group: "contact", type: "input",    value_uk: "04 — Контакти", value_en: "04 — Contact", label: "Мітка секції" },
  { key: "contact_title",       group: "contact", type: "input",    value_uk: "Працюймо", value_en: "Let's work", label: "Заголовок" },
  { key: "contact_highlight",   group: "contact", type: "input",    value_uk: "разом", value_en: "together", label: "Заголовок — виділена частина" },
  { key: "contact_desc",        group: "contact", type: "textarea", value_uk: "Завжди відкритий до обговорення нових проєктів.", value_en: "Always open to discussing new projects.", label: "Опис" },
  { key: "contact_email",       group: "contact", type: "input",    value_uk: "stewe.snowwhite@ukr.net", value_en: "stewe.snowwhite@ukr.net", label: "Email" },
  { key: "contact_location",    group: "contact", type: "input",    value_uk: "Ужгород, UA", value_en: "Uzhhorod, UA", label: "Місто" },
  { key: "contact_timezone",    group: "contact", type: "input",    value_uk: "EET (UTC+2)", value_en: "EET (UTC+2)", label: "Часовий пояс" },
  { key: "contact_find_online", group: "contact", type: "input",    value_uk: "Знайди мене онлайн", value_en: "Find me online", label: "Підпис соцмереж" },
];

const GROUPS = [
  { key: "stats",   emoji: "📊", label: "Статистика" },
  { key: "hero",    emoji: "🦸", label: "Hero секція" },
  { key: "about",   emoji: "👤", label: "Про мене" },
  { key: "contact", emoji: "📬", label: "Контакти" },
];

function SettingField({ defItem, value, onChange, onSave, saving }) {
  const Field = defItem.type === "textarea" ? Textarea : Input;
  return (
    <div className="p-4 rounded-xl bg-card border border-border space-y-2">
      <p className="text-xs font-semibold text-foreground/70">{defItem.label}</p>
      <div className="grid sm:grid-cols-2 gap-2">
        <div>
          <span className="text-xs text-muted-foreground mb-1 block">🇺🇦 UA</span>
          <Field value={value?.value_uk || ""} onChange={e => onChange("value_uk", e.target.value)}
            className="bg-secondary/50 text-sm" rows={defItem.type === "textarea" ? 3 : undefined} />
        </div>
        <div>
          <span className="text-xs text-muted-foreground mb-1 block">🇬🇧 EN</span>
          <Field value={value?.value_en || ""} onChange={e => onChange("value_en", e.target.value)}
            className="bg-secondary/50 text-sm" rows={defItem.type === "textarea" ? 3 : undefined} />
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={onSave} disabled={saving} className="text-xs h-7">
        {saving
          ? <div className="w-3 h-3 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
          : <><Check className="w-3 h-3 mr-1" />Зберегти</>}
      </Button>
    </div>
  );
}

function GroupSection({ group, settings, onUpdate, onSave, saving }) {
  const [open, setOpen] = useState(true);
  const items = DEFAULT_SETTINGS.filter(d => d.group === group.key);
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-secondary/30 hover:bg-secondary/50 transition-colors text-left">
        <span className="text-sm font-semibold">{group.emoji} {group.label}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="p-4 space-y-3">
          {items.map(def => {
            const s = settings[def.key];
            if (!s) return null;
            return (
              <SettingField key={def.key} defItem={def} value={s}
                onChange={(field, val) => onUpdate(def.key, field, val)}
                onSave={() => onSave(def.key)}
                saving={saving[def.key]} />
            );
          })}
        </div>
      )}
    </div>
  );
}

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
      await supabase.from("site_settings").insert(
        toCreate.map(({ key, group, value_uk, value_en }) => ({ key, "group": group, value_uk, value_en }))
      );
    }
    load();
  };

  const handleUpdate = (key, field, value) => {
    setSettings(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const handleSave = async (key) => {
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Тексти і статистика</h2>
        <Button onClick={initDefaults} size="sm" variant="outline">
          <RefreshCw className="w-4 h-4 mr-1" />
          {hasAny ? "Оновити значення" : "Ініціалізувати"}
        </Button>
      </div>
      {!hasAny ? (
        <p className="text-center text-muted-foreground text-sm py-8">Натисни «Ініціалізувати» щоб завантажити всі тексти.</p>
      ) : (
        GROUPS.map(group => (
          <GroupSection key={group.key} group={group} settings={settings}
            onUpdate={handleUpdate} onSave={handleSave} saving={saving} />
        ))
      )}
    </div>
  );
}