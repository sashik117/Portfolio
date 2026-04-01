import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/lib/LanguageContext";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wzgvtcrzhikqontraaoy.supabase.co",
  "sb_publishable_O7efFGxHFmTWQypKCaiIpg_bjwbiX2Q"
);

const SAMPLE_TESTIMONIALS = [
  {
    id: "s1",
    author_name: "Олексій Гринчук",
    author_role: "Директор, Автосалон «Преміум Авто»",
    author_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    message: "Stewe побудував для нас систему, яка повністю прибрала ручне введення даних між сайтом, 1С та CRM. Раніше менеджери витрачали на це години — тепер усе відбувається автоматично. Результат перевершив очікування.",
  },
  {
    id: "s2",
    author_name: "Наталія Бойко",
    author_role: "Маркетинг-менеджер, SalesFlow Agency",
    author_photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
    message: "Завдяки воронці, яку зробив Stewe, ліди з сайту автоматично потрапляють у CRM і одразу приходить сповіщення в Telegram менеджеру. Жодна заявка більше не губиться. Дуже вдячні за роботу!",
  },
  {
    id: "s3",
    author_name: "Дмитро Лисенко",
    author_role: "Senior PHP Developer",
    message: "Працював зі Stewe як з молодшим розробником на початку його шляху. Він дуже швидко схоплює нові концепції, не боїться складних завдань і завжди доводить справу до кінця. Зараз я бачу, як він виріс у справжнього спеціаліста — приємно усвідомлювати, що був частиною цього.",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.65, ease: "easeOut", delay },
});

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hovered || value) ? "text-chart-4 fill-chart-4" : "text-border"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const tr = t.testimonials;
  const [testimonials, setTestimonials] = useState(SAMPLE_TESTIMONIALS);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ author_name: "", author_role: "", message: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .eq("approved", true)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setTestimonials([...SAMPLE_TESTIMONIALS, ...data]);
        }
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const go = (dir) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + testimonials.length) % testimonials.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("testimonials").insert([
      { ...form, approved: false },
    ]);
    if (error) {
      toast.error("Помилка. Спробуй ще раз.");
    } else {
      toast.success(tr.formSuccess);
      setShowForm(false);
      setForm({ author_name: "", author_role: "", message: "", rating: 5 });
    }
    setSubmitting(false);
  };

  const item = testimonials[current];
  const itemRating = item.rating || 5;

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  };

  return (
    <section id="testimonials" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto">
        <motion.div {...fadeUp()} className="mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="font-mono text-sm text-primary mb-3 block">{tr.label}</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {tr.title}{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{tr.highlight}</span>
            </h2>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {tr.leaveBtn}
          </button>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-12"
            >
              <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-card border border-border space-y-4">
                <h3 className="font-semibold text-lg">{tr.formTitle}</h3>
                <p className="text-sm text-muted-foreground">💜 Дякую що знайшли час поділитися враженнями!</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">{tr.formName}</label>
                    <Input required value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} placeholder={tr.namePh} className="bg-secondary/50 border-border" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">{tr.formRole}</label>
                    <Input required value={form.author_role} onChange={(e) => setForm({ ...form, author_role: e.target.value })} placeholder={tr.rolePh} className="bg-secondary/50 border-border" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{tr.formMessage}</label>
                  <Textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={tr.messagePh} rows={3} className="bg-secondary/50 border-border resize-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Оцінка</label>
                  <StarPicker value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
                </div>
                <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {submitting ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : tr.formSubmit}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div {...fadeUp(0.2)}>
          <div className="relative rounded-2xl bg-card border border-border p-8 sm:p-12 overflow-hidden min-h-[280px] flex flex-col justify-between">
            <Quote className="w-10 h-10 text-primary/20 mb-4" />
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-8 italic">
                  "{item.message}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.author_name)}&background=7c6aed&color=fff&size=56`}
                    alt={item.author_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <p className="font-semibold">{item.author_name}</p>
                    <p className="text-sm text-muted-foreground">{item.author_role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < itemRating ? "text-chart-4 fill-chart-4" : "text-border"}`} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`transition-all duration-300 rounded-full ${i === current ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-border hover:bg-muted-foreground"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => go(-1)} className="w-10 h-10 rounded-xl bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => go(1)} className="w-10 h-10 rounded-xl bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}