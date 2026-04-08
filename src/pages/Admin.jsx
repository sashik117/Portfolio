import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, LogOut, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/api/SupabaseClient.js";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminExperience from "@/components/admin/AdminExperience";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminTestimonials from "@/components/admin/AdminTestimonials";

// Простий пароль-захист (без Supabase Auth)
const ADMIN_PASSWORD = "stewe.admin111"; // ← зміни на свій

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_ok") === "1");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_ok", "1");
      setAuthed(true);
    } else {
      setErr(true);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("admin_ok");
    setAuthed(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-4 p-8 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-semibold">dev<span className="text-primary">.admin</span></span>
          </div>
          <Input
            type="password"
            placeholder="Пароль"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr(false); }}
            onKeyDown={e => e.key === "Enter" && login()}
            className={err ? "border-destructive" : ""}
          />
          {err && <p className="text-xs text-destructive">Невірний пароль</p>}
          <Button onClick={login} className="w-full bg-primary hover:bg-primary/90">Увійти</Button>
          <a href="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">← На сайт</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-semibold">dev<span className="text-primary">.admin</span></span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Панель управління</h1>
          <p className="text-sm text-muted-foreground mt-1">Керуй контентом сайту без редагування коду</p>
        </div>
        <Tabs defaultValue="projects">
          <TabsList className="mb-6 bg-secondary/50 border border-border">
            <TabsTrigger value="projects">Проєкти</TabsTrigger>
            <TabsTrigger value="experience">Досвід</TabsTrigger>
            <TabsTrigger value="settings">Тексти і статистика</TabsTrigger>
            <TabsTrigger value="testimonials">Відгуки</TabsTrigger>
          </TabsList>
          <TabsContent value="projects"><AdminProjects /></TabsContent>
          <TabsContent value="experience"><AdminExperience /></TabsContent>
          <TabsContent value="settings"><AdminSettings /></TabsContent>
          <TabsContent value="testimonials"><AdminTestimonials /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}