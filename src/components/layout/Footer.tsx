import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { useLang } from '@/contexts/LanguageContext';
import { tr } from '@/lib/i18n';

export function Footer() {
  const { lang } = useLang();
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="container py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-sm">{tr('trusted', lang)}</p>
          <div className="h-1 w-32 rounded-full bg-gradient-tricolor opacity-70" aria-hidden />
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/chat" className="hover:text-foreground">AI Assistant</Link></li>
            <li><Link to="/journey" className="hover:text-foreground">Voter Journey</Link></li>
            <li><Link to="/timeline" className="hover:text-foreground">Timeline</Link></li>
            <li><Link to="/booth" className="hover:text-foreground">Find Booth</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Official sources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">eci.gov.in</a></li>
            <li><a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">voters.eci.gov.in</a></li>
            <li><a href="https://results.eci.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">results.eci.gov.in</a></li>
          </ul>
        </div>
      </div>
      <div className="container border-t border-border/60 py-6 text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} ElectionGuide AI. Independent, non-partisan civic technology. Always verify with official ECI sources.
      </div>
    </footer>
  );
}
