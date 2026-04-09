import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, LogOut, Lock, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminExperience from "@/components/admin/AdminExperience";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminTestimonials from "@/components/admin/AdminTestimonials";

const ADMIN_PASSWORD = "stewe111";

function AdminContent() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("admin_ok");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-semibold">
              dev<span className="text-primary">.admin</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Тема */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/60 border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Вихід */}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Панель управління</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Керуй контентом сайту без редагування коду
          </p>
        </div>

        <Tabs defaultValue="projects">
          <TabsList className="mb-6 bg-secondary/50 border border-border">
            <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Проєкти
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Досвід
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Тексти і статистика
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Відгуки
            </TabsTrigger>
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

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-4 p-8 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-semibold">
              dev<span className="text-primary">.admin</span>
            </span>
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

          <Button onClick={login} className="w-full bg-primary hover:bg-primary/90">
            Увійти
          </Button>

          <a href="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">
            ← На сайт
          </a>
        </div>
      </div>
    );
  }

  return <AdminContent />;
}