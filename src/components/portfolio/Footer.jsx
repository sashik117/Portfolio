import { Terminal, Heart } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const f = t.footer;
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs text-muted-foreground">
            dev<span className="text-primary">.portfolio</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {f.text} <Heart className="w-3 h-3 text-primary fill-primary" /> {f.coffee}
        </p>
        <p className="text-xs text-muted-foreground font-mono">
          © 2026 {f.rights}
        </p>
      </div>
    </footer>
  );
}