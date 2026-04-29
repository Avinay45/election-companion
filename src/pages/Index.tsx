import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, MapPin, Calendar, ShieldCheck, Sparkles, Languages, Vote, BookOpen, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeroBackdrop } from '@/components/HeroBackdrop';
import { useLang } from '@/contexts/LanguageContext';
import { tr } from '@/lib/i18n';

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' } };

export default function Index() {
  const { lang } = useLang();

  const features = [
    { icon: MessageSquare, title: 'AI Election Assistant', desc: 'Conversational answers about registration, voter ID, polling and more — grounded in official sources.' },
    { icon: Vote, title: '6-Step Voter Journey', desc: 'Interactive stepper from eligibility check to result tracking, with progress saved per user.' },
    { icon: Calendar, title: 'Live Election Timeline', desc: 'Upcoming and ongoing elections across India, with phases and key dates.' },
    { icon: MapPin, title: 'Polling Booth Finder', desc: 'Search by state, district or pincode to locate your nearest booth instantly.' },
    { icon: Languages, title: 'Multilingual', desc: 'Available in English, हिंदी and తెలుగు — auto-detected and switchable any time.' },
    { icon: Bell, title: 'Smart Reminders', desc: 'Email reminders for registration deadlines and voting day in your state.' },
  ];

  const steps = [
    { n: '01', title: 'Tell us about you', desc: 'Set your state, district and age — we personalise everything.' },
    { n: '02', title: 'Ask anything', desc: 'Chat with the AI in your language about voting procedures.' },
    { n: '03', title: 'Follow the journey', desc: 'Step-by-step guidance from registration to voting day.' },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <HeroBackdrop />
        <div className="container py-20 md:py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <Badge variant="outline" className="mb-6 px-3 py-1.5 border-primary/30 bg-primary/5 text-primary backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2 pulse-ring" /> Powered by AI · Independent · Non-partisan
            </Badge>
            <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
              <span className="block">{tr('app_name', lang)}</span>
              <span className="block gradient-text mt-2">{tr('tagline', lang)}</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">{tr('hero_sub', lang)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 transition-opacity">
                <Link to="/chat"><MessageSquare className="mr-2 h-4 w-4" /> {tr('cta_chat', lang)}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="backdrop-blur">
                <Link to="/journey"><Vote className="mr-2 h-4 w-4" /> {tr('cta_journey', lang)}</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/timeline">{tr('cta_timeline', lang)} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-secondary" /> Neutral & non-partisan</div>
              <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-secondary" /> ECI-grounded answers</div>
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-secondary" /> Free to use</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-20">
        <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">{tr('features_title', lang)}</h2>
          <p className="mt-4 text-muted-foreground text-lg">From eligibility to results — built around the voter, not the politician.</p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Card className="h-full p-6 bg-gradient-card border-border/60 hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container py-20">
        <motion.div {...fadeUp} className="max-w-2xl mb-14">
          <Badge variant="outline" className="mb-4">How it works</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">Three steps to confident voting</h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div key={s.n} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Card className="p-8 h-full bg-gradient-card relative overflow-hidden">
                <span className="absolute -top-2 -right-2 font-display text-7xl text-primary/10 font-bold">{s.n}</span>
                <h3 className="font-display text-2xl font-semibold mb-3 relative">{s.title}</h3>
                <p className="text-muted-foreground relative">{s.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="container py-20">
        <motion.div {...fadeUp}>
          <Card className="p-10 md:p-16 bg-gradient-brand text-primary-foreground shadow-elevated relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">Your vote is your voice. Make it count.</h2>
              <p className="mt-4 text-lg opacity-90">Join thousands of Indian citizens preparing for the next election with personalised AI guidance.</p>
              <Button asChild size="lg" variant="secondary" className="mt-8 bg-background text-foreground hover:bg-background/90">
                <Link to="/auth"><Sparkles className="mr-2 h-4 w-4" /> {tr('get_started', lang)}</Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </section>
    </>
  );
}
