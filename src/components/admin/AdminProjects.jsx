import { useState, useEffect } from "react";
import { supabase } from "@/api/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const EMPTY = {
  title: "", desc_uk: "", desc_en: "",
  tags: "", categories: "", live_url: "", github_url: "",
  color: "from-primary/20 to-accent/20", order: 0,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("projects").select("*").order("order");
    setProjects(data || []);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => { setForm(EMPTY); setEditing("new"); };
  const startEdit = (p) => {
    setForm({ ...p, tags: (p.tags || []).join(", "), categories: (p.categories || []).join(", ") });
    setEditing(p.id);
  };
  const cancel = () => { setEditing(null); setForm(EMPTY); };

  const save = async () => {
    setSaving(true);
    const data = {
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      categories: form.categories.split(",").map(t => t.trim()).filter(Boolean),
      order: Number(form.order) || 0,
    };
    if (editing === "new") {
      await supabase.from("projects").insert(data);
    } else {
      await supabase.from("projects").update(data).eq("id", editing);
    }
    await load();
    cancel();
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Видалити проєкт?")) return;
    await supabase.from("projects").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Проєкти ({projects.length})</h2>
        <Button onClick={startNew} size="sm" className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-1" /> Додати
        </Button>
      </div>

      {editing && (
        <div className="p-5 rounded-xl border border-primary/30 bg-card space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">
            {editing === "new" ? "Новий проєкт" : "Редагування"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Назва</label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Project Name" className="bg-secondary/50" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Порядок</label>
              <Input type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} className="bg-secondary/50" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Опис (UA)</label>
            <Textarea value={form.desc_uk} onChange={e => setForm({ ...form, desc_uk: e.target.value })} rows={2} className="bg-secondary/50 resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Опис (EN)</label>
            <Textarea value={form.desc_en} onChange={e => setForm({ ...form, desc_en: e.target.value })} rows={2} className="bg-secondary/50 resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Теги (через кому)</label>
              <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="PHP, Node.js" className="bg-secondary/50" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Категорії (через кому)</label>
              <Input value={form.categories} onChange={e => setForm({ ...form, categories: e.target.value })} placeholder="Full-Stack, Automation" className="bg-secondary/50" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Live URL</label>
              <Input value={form.live_url} onChange={e => setForm({ ...form, live_url: e.target.value })} className="bg-secondary/50" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">GitHub URL</label>
              <Input value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} className="bg-secondary/50" />
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
        {projects.map(p => (
          <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
            <div>
              <p className="font-medium text-sm">{p.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{(p.tags || []).join(", ")}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => startEdit(p)} className="w-8 h-8 text-muted-foreground hover:text-foreground">
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(p.id)} className="w-8 h-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {projects.length === 0 && !editing && (
          <p className="text-center text-muted-foreground text-sm py-8">Немає проєктів. Додай перший!</p>
        )}
      </div>
    </div>
  );
}