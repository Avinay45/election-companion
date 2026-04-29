import { Link } from 'react-router-dom';
import { useLang } from '@/contexts/LanguageContext';
import { tr } from '@/lib/i18n';

export function Logo({ className = '' }: { className?: string }) {
  const { lang } = useLang();
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative h-9 w-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-soft">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground chakra-spin" style={{ animationDuration: '40s' }}>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="0.8" transform={`rotate(${i * 15} 12 12)`} />
          ))}
        </svg>
      </div>
      <span className="font-display text-lg font-semibold tracking-tight">{tr('app_name', lang)}</span>
    </Link>
  );
}
