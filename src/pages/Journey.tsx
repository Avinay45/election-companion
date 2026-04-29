import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ChevronDown, ExternalLink, Vote, IdCard, MapPin, Award, Calendar, ListChecks } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const STEPS = [
  {
    id: 'eligibility', title: 'Eligibility check', icon: ListChecks,
    desc: 'You must be an Indian citizen, ordinarily resident in the constituency, and at least 18 years old on the qualifying date (1 January of the year).',
    actions: [{ label: 'Read eligibility rules', href: 'https://eci.gov.in/voter/who-can-vote/' }],
    checklist: ['Indian citizen', 'Age 18 or above on qualifying date', 'Ordinarily resident at the address you register from', 'Not disqualified by law'],
  },
  {
    id: 'register', title: 'Register to vote', icon: Vote,
    desc: 'Apply via Form 6 on the National Voters Service Portal. Keep an Aadhaar (or alternative ID), passport-size photo and address proof ready.',
    actions: [{ label: 'Open NVSP — Form 6', href: 'https://voters.eci.gov.in/' }],
    checklist: ['Identity proof (Aadhaar / passport / PAN)', 'Address proof (utility bill / rent agreement)', 'Recent passport-size photo (≤200 KB)', 'Valid mobile number for OTP'],
  },
  {
    id: 'verify', title: 'Verify Voter ID (EPIC)', icon: IdCard,
    desc: 'Once approved, you receive an EPIC number. Search electoral rolls to confirm your name, photo and constituency.',
    actions: [{ label: 'Search electoral roll', href: 'https://electoralsearch.eci.gov.in/' }],
    checklist: ['EPIC number received', 'Name spelled correctly', 'Address matches', 'Photo is correct'],
  },
  {
    id: 'booth', title: 'Find your polling booth', icon: MapPin,
    desc: 'Locate your booth by EPIC number, mobile, or pincode. Save the address and check distance before voting day.',
    actions: [{ label: 'Open booth finder', href: '/booth' }],
    checklist: ['Polling booth address noted', 'Travel route checked', 'Booth number recorded'],
  },
  {
    id: 'voting_day', title: 'Voting day guide', icon: Calendar,
    desc: 'Carry your EPIC or any approved photo ID. Polling hours are typically 7 AM – 6 PM. No phones are allowed inside the booth.',
    actions: [{ label: 'Approved ID list', href: 'https://eci.gov.in/voter/voter-id-card/' }],
    checklist: ['EPIC or alternative photo ID', 'Booth slip (optional)', 'Reach early to avoid queues', 'Phones must be left outside'],
  },
  {
    id: 'results', title: 'Track results', icon: Award,
    desc: 'Live results are published constituency-wise on results.eci.gov.in on counting day.',
    actions: [{ label: 'Open results portal', href: 'https://results.eci.gov.in/' }],
    checklist: ['Bookmark official results', 'Avoid unverified social media claims'],
  },
];

export default function Journey() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<string | null>(STEPS[0].id);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('journey_progress').eq('id', user.id).maybeSingle()
      .then(({ data }) => setProgress((data?.journey_progress as any) || {}));
  }, [user]);

  const completed = useMemo(() => STEPS.filter(s => progress[s.id]).length, [progress]);
  const pct = Math.round((completed / STEPS.length) * 100);

  async function toggle(id: string) {
    const next = { ...progress, [id]: !progress[id] };
    setProgress(next);
    if (user) await supabase.from('profiles').update({ journey_progress: next }).eq('id', user.id);
  }

  return (
    <div className="container max-w-4xl py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="outline" className="mb-3">Voter journey</Badge>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-3">Six steps to your first vote</h1>
        <p className="text-muted-foreground text-lg mb-6 max-w-2xl">A simple, resumable guide from checking eligibility to tracking results. {!user && <Link to="/auth" className="text-primary underline-offset-4 hover:underline">Sign in</Link>} {!user && 'to save your progress.'}</p>
        <div className="flex items-center gap-3 mb-10">
          <Progress value={pct} className="h-2" />
          <span className="text-sm font-medium tabular-nums">{completed}/{STEPS.length}</span>
        </div>
      </motion.div>

      <div className="space-y-3">
        {STEPS.map((step, idx) => {
          const done = !!progress[step.id];
          const isOpen = open === step.id;
          const Icon = step.icon;
          return (
            <motion.div key={step.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
              <Card className="overflow-hidden bg-gradient-card">
                <button onClick={() => setOpen(isOpen ? null : step.id)} className="w-full p-5 flex items-center gap-4 text-left">
                  <button onClick={(e) => { e.stopPropagation(); toggle(step.id); }} className="shrink-0">
                    {done ? <CheckCircle2 className="h-7 w-7 text-secondary" /> : <Circle className="h-7 w-7 text-muted-foreground" />}
                  </button>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Step {idx + 1}</p>
                    <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <div className="px-5 pb-6 pt-1 pl-[5.25rem]">
                        <p className="text-muted-foreground mb-4 leading-relaxed">{step.desc}</p>
                        <ul className="space-y-1.5 mb-5">
                          {step.checklist.map(c => (
                            <li key={c} className="text-sm flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{c}</li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-2">
                          {step.actions.map(a => (
                            <Button key={a.href} asChild size="sm" variant="outline">
                              {a.href.startsWith('/') ? <Link to={a.href}>{a.label}</Link> :
                                <a href={a.href} target="_blank" rel="noopener noreferrer">{a.label} <ExternalLink className="h-3.5 w-3.5 ml-1.5" /></a>}
                            </Button>
                          ))}
                          <Button size="sm" variant={done ? 'secondary' : 'default'} onClick={() => toggle(step.id)} className={!done ? 'bg-gradient-brand text-primary-foreground' : ''}>
                            {done ? 'Mark as not done' : 'Mark complete'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
