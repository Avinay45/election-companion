import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, User as UserIcon, LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { tr } from '@/lib/i18n';
import { useState } from 'react';

export function Header() {
  const { user, signOut } = useAuth();
  const { lang } = useLang();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/chat', label: tr('nav_chat', lang) },
    { to: '/journey', label: tr('nav_journey', lang) },
    { to: '/timeline', label: tr('nav_timeline', lang) },
    { to: '/booth', label: tr('nav_booth', lang) },
    { to: '/quiz', label: tr('nav_quiz', lang) },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/20 bg-primary text-primary-foreground backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-accent ${isActive ? 'text-accent' : 'text-primary-foreground/75'}`
              }>{l.label}</NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                  <UserIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => nav('/profile')}>
                  <UserIcon className="h-4 w-4 mr-2" /> {tr('nav_profile', lang)}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => { await signOut(); nav('/'); }}>
                  <LogOut className="h-4 w-4 mr-2" /> {tr('sign_out', lang)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex bg-accent hover:bg-[hsl(var(--accent-hover))] text-accent-foreground shadow-soft transition-shadow hover:shadow-glow">
              <Link to="/auth"><Sparkles className="h-4 w-4 mr-1.5" />{tr('get_started', lang)}</Link>
            </Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground hover:text-accent hover:bg-primary-foreground/10"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-1 mt-8">
                {links.map(l => (
                  <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
                    className={({ isActive }) => `px-4 py-3 rounded-lg text-base ${isActive ? 'bg-muted text-accent font-semibold' : 'text-foreground'}`}>
                    {l.label}
                  </NavLink>
                ))}
                {!user && (
                  <Link to="/auth" onClick={() => setOpen(false)} className="mt-4 mx-4">
                    <Button className="w-full bg-accent hover:bg-[hsl(var(--accent-hover))] text-accent-foreground">{tr('get_started', lang)}</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
