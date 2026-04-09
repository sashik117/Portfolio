import { useState, useEffect } from "react";
import { supabase } from "@/api/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    setTestimonials(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (t) => {
    await supabase.from("testimonials").update({ approved: !t.approved }).eq("id", t.id);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Видалити відгук?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground text-sm">Завантаження...</div>;

  const pending  = testimonials.filter(t => !t.approved);
  const approved = testimonials.filter(t =>  t.approved);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Відгуки ({testimonials.length})</h2>

      {pending.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground border-b border-border pb-2">⏳ Очікують ({pending.length})</h3>
          {pending.map(t => <TestimonialCard key={t.id} t={t} onToggle={toggle} onDelete={remove} />)}
        </div>
      )}

      {approved.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground border-b border-border pb-2">✅ Опубліковані ({approved.length})</h3>
          {approved.map(t => <TestimonialCard key={t.id} t={t} onToggle={toggle} onDelete={remove} />)}
        </div>
      )}

      {testimonials.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Відгуків ще немає.</p>}
    </div>
  );
}

function TestimonialCard({ t, onToggle, onDelete }) {
  return (
    <div className={`p-4 rounded-xl border bg-card transition-all hover:shadow-lg ${t.approved ? "border-primary/20" : "border-border"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-sm">
              {t.author_name[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-medium text-sm">{t.author_name}</p>
              <p className="text-xs text-muted-foreground">{t.author_role}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">"{t.message}"</p>
          <div className="flex gap-1 mt-2">
            {"★★★★★".split("").map((star, i) => (
              <span key={i} className="text-yellow-400 text-sm">★</span>
            ))}
          </div>
        </div>

        <div className="flex gap-1.5 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => onToggle(t)}
            className={`w-8 h-8 ${t.approved ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
            {t.approved ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(t.id)} className="w-8 h-8 text-muted-foreground hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}