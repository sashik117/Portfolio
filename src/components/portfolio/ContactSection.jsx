import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/lib/LanguageContext";
import { useSiteSettings } from "@/lib/SiteSettingsContext";

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
  const { lang } = useLanguage();
  const { getText } = useSiteSettings();

  const c = {
    label:       getText("contact_label", lang),
    title:       getText("contact_title", lang),
    highlight:   getText("contact_highlight", lang),
    desc:        getText("contact_desc", lang),
    email:       getText("contact_email", lang),
    location:    getText("contact_location", lang),
    timezone:    getText("contact_timezone", lang),
    findOnline:  getText("contact_find_online", lang),
  };

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("subject", form.subject);
      data.append("message", form.message);
      data.append("_subject", `📩 [Portfolio] ${form.subject} від ${form.name}`);

      const response = await fetch("https://formspree.io/f/mzdkrqez", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setSent(true);
        toast.success(lang === "uk" ? "Повідомлення надіслано! 💜" : "Message sent! 💜");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Server error");
      }
    } catch (err) {
      console.error("Form error:", err);
      toast.error(lang === "uk" ? "Помилка. Спробуй ще раз." : "Error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    { icon: Mail,    label: "Email",    value: c.email    || "stewe.snowwhite@ukr.net" },
    { icon: MapPin,  label: lang === "uk" ? "Місто" : "Location", value: c.location || "Ужгород, UA" },
    { icon: Clock,   label: lang === "uk" ? "Часовий пояс" : "Timezone", value: c.timezone || "EET (UTC+2)" },
  ];

  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl z-0 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div {...fadeUp()} className="mb-16">
          <span className="font-mono text-sm text-primary mb-3 block">{c.label}</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {c.title}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{c.highlight}</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
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
              <p className="text-xs text-muted-foreground mb-3">{c.findOnline}</p>
              <div className="flex gap-3">
                <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-mono bg-secondary/50 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all">
                  GitHub ↗
                </a>
                <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-mono bg-secondary/50 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all">
                  Telegram ↗
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.25)} className="lg:col-span-3">
            {sent ? (
              <div className="p-8 rounded-2xl bg-card border border-border flex flex-col items-center justify-center gap-4 min-h-[360px] text-center">
                <CheckCircle className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">
                  {lang === "uk" ? "Дякуємо за повідомлення! 💜" : "Thanks for your message! 💜"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {lang === "uk" ? "Я відповім найближчим часом" : "I'll get back to you soon"}
                </p>
                <button onClick={() => setSent(false)} className="mt-2 text-sm text-primary hover:underline">
                  {lang === "uk" ? "Надіслати ще" : "Send another"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate
                className="p-8 rounded-2xl bg-card border border-border space-y-6 relative z-20">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">{lang === "uk" ? "Ім'я" : "Name"}</label>
                    <Input name="name" required value={form.name} onChange={handleChange}
                      placeholder={lang === "uk" ? "Іван Петренко" : "John Doe"}
                      autoComplete="name" className="bg-secondary/50" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Email</label>
                    <Input name="email" type="email" required value={form.email} onChange={handleChange}
                     placeholder={lang === "uk" ? "ivan@example.com" : "john@example.com"}
                     autoComplete="email" className="bg-secondary/50" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">{lang === "uk" ? "Тема" : "Subject"}</label>
                  <Input name="subject" required value={form.subject} onChange={handleChange}
                    placeholder={lang === "uk" ? "Обговорення проекту" : "Project Discussion"}
                    className="bg-secondary/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">{lang === "uk" ? "Повідомлення" : "Message"}</label>
                  <Textarea name="message" required value={form.message} onChange={handleChange}
                    placeholder={lang === "uk" ? "Розкажи про свій проєкт..." : "Tell me about your project..."}
                    rows={5} className="bg-secondary/50 resize-none" />
                </div>
                <Button type="submit" disabled={sending} className="w-full h-12 active:scale-95 transition-transform">
                  {sending
                    ? <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" />
                    : <><Send className="w-4 h-4 mr-2" />{lang === "uk" ? "Надіслати повідомлення" : "Send Message"}</>}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}