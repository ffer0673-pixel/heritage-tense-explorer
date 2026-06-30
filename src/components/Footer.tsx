import { Link } from "@tanstack/react-router";
import { Mail, Globe, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <img
  src="/logo.png"
  alt="Logo"
  className="h-8 w-8 rounded-lg object-cover"
/>
            <span className="font-semibold tracking-tight">Tenses Around Us</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Belajar 16 tenses bahasa Inggris lewat kekayaan budaya kota Tangerang.
          </p>
          <div className="mt-5 flex gap-3 text-muted-foreground">
            <a href="#" aria-label="Email" className="hover:text-foreground transition-colors"><Mail className="h-4 w-4" /></a>
            <a href="#" aria-label="Website" className="hover:text-foreground transition-colors"><Globe className="h-4 w-4" /></a>
            <a href="#" aria-label="Chat" className="hover:text-foreground transition-colors"><MessageCircle className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Navigation</h4>
          <ul className="mt-4 grid gap-2 text-sm">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Tangerang</Link></li>
            <li><Link to="/tenses" className="hover:text-primary">Tenses</Link></li>
            <li><Link to="/reference" className="hover:text-primary">Reference</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Learning</h4>
          <ul className="mt-4 grid gap-2 text-sm">
            
            <li><Link to="/quiz" className="hover:text-primary">Quiz</Link></li>
            <li><Link to="/cerita" className="hover:text-primary">Cerita</Link></li>
            <li><Link to="/progress" className="hover:text-primary">Progress</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About</h4>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <li>Made in Tangerang</li>
            <li>For learners everywhere</li>
            <li>Heritage × Modern</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-muted-foreground flex items-center justify-between flex-wrap gap-2">
          <span>© {new Date().getFullYear()} Tenses Around Us. All rights reserved.</span>
          <span>Crafted with care · React · TanStack · Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
