import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const EMPTY = {
  role: "", company: "", period: "",
  description_uk: "", description_en: "", tags: "", order: 0,
};

export default function AdminExperience() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("experience").select("*").order("order");
    setItems(data || []);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => { setForm(EMPTY); setEditing("new"); };
  const startEdit = (e) => {
    setForm({ ...e, tags: (e.tags || []).join(", ") });
    setEditing(e.id);
  };
  const cancel = () => { setEditing(null); setForm(EMPTY); };

  const save = async () => {
    setSaving(true);
    const data = {
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      order: Number(form.order) || 0,
    };
    if (editing === "new") {
      await supabase.from("experience").insert(data);
    } else {
      await supabase.from("experience").update(data).eq("id", editing);
    }
    await load();
    cancel();
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Видалити запис?")) return;
    await supabase.from("experience").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Досвід роботи ({items.length})</h2>
        <Button onClick={startNew} size="sm" className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-1" /> Додати
        </Button>
      </div>

      {editing && (
        <div className="p-5 rounded-xl border border-primary/30 bg-card space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">
            {editing === "new" ? "Новий запис" : "Редагування"}
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Посада</label>
              <Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Web Developer" className="bg-secondary/50" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Компанія</label>
              <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Freelance" className="bg-secondary/50" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Період</label>
              <Input value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} placeholder="2022 — Сьогодні" className="bg-secondary/50" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Опис (UA)</label>
            <Textarea value={form.description_uk} onChange={e => setForm({ ...form, description_uk: e.target.value })} rows={2} className="bg-secondary/50 resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Опис (EN)</label>
            <Textarea value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} rows={2} className="bg-secondary/50 resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Теги (через кому)</label>
              <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="WordPress, Node.js" className="bg-secondary/50" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Порядок</label>
              <Input type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} className="bg-secondary/50" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button onClick={save} disabled={saving} size="sm" className="bg-primary hover:bg-primary/90">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-4 h-4 mr-1" />Зберегти</>}
            </Button>
            <Button onClick={cancel} variant="outline" size="sm"><X className="w-4 h-4 mr-1" />Скасувати</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map(exp => (
          <div key={exp.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
            <div>
              <p className="font-medium text-sm">{exp.role} — {exp.company}</p>
              <p className="text-xs text-muted-foreground">{exp.period}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => startEdit(exp)} className="w-8 h-8 text-muted-foreground hover:text-foreground">
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(exp.id)} className="w-8 h-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && !editing && (
          <p className="text-center text-muted-foreground text-sm py-8">Немає записів. Додай перший!</p>
        )}
      </div>
    </div>
  );
}