import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/lib/LanguageContext";

const SOCIAL_LINKS = {
  github: "https://github.com/stewe-snowwhite",
  telegram: "https://t.me/stewe_snowwhite",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.65, ease: "easeOut", delay },
});

export default function ContactSection() {
  const { t } = useLanguage();
  const c = t.contact;
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      // Використовуємо JSON замість FormData — надійніше на мобільних
      const res = await fetch("https://formspree.io/f/mzdkrqez", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          _subject: `📩 [Portfolio] ${form.subject} — від ${form.name}`,
          _replyto: form.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Formspree повертає errors масив — показуємо його
        const errorMsg = data?.errors?.map((e) => e.message).join(", ") || "Formspree error";
        throw new Error(errorMsg);
      }

      setSent(true);
      toast.success(c.successTitle);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Contact form error:", err);
      toast.error(`Помилка: ${err.message || "Спробуй ще раз"}`);
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "stewe.snowwhite@ukr.net" },
    { icon: MapPin, label: c.locationLabel, value: "Ужгород, UA" },
    { icon: Clock, label: c.timezoneLabel, value: "EET (UTC+2)" },
  ];

  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-16">
          <span className="font-mono text-sm text-primary mb-3 block">{c.label}</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {c.title}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{c.highlight}</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left */}
          <motion.div {...fadeUp(0.15)} className="lg:col-span-2 space-y-8">
            <p className="text-muted-foreground leading-relaxed">{c.desc}</p>

            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium mb-4">{c.findOnline}</p>
              <div className="flex gap-3">
                {[
                  { label: "GitHub", href: SOCIAL_LINKS.github },
                  { label: "Telegram", href: SOCIAL_LINKS.telegram },
                ].map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-mono bg-secondary/50 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all">
                    {label} ↗
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div {...fadeUp(0.25)} className="lg:col-span-3">
            {sent ? (
              <div className="p-8 rounded-2xl bg-card border border-border flex flex-col items-center justify-center gap-4 min-h-[360px] text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="text-xl font-semibold">{c.successTitle}</h3>
                <p className="text-muted-foreground text-sm">{c.successDesc}</p>
                <button onClick={() => setSent(false)} className="mt-2 text-sm text-primary hover:underline">
                  {c.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-card border border-border space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">{c.name}</label>
                    <Input name="name" required value={form.name} onChange={handleChange} placeholder={c.namePh} className="bg-secondary/50 border-border" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">{c.email}</label>
                    <Input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="john@example.com" className="bg-secondary/50 border-border" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{c.subject}</label>
                  <Input name="subject" required value={form.subject} onChange={handleChange} placeholder={c.subjectPh} className="bg-secondary/50 border-border" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{c.message}</label>
                  <Textarea name="message" required value={form.message} onChange={handleChange} placeholder={c.messagePh} rows={5} className="bg-secondary/50 border-border resize-none" />
                </div>
                <Button type="submit" disabled={sending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-medium glow-primary">
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4 mr-2" />{c.send}</>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}