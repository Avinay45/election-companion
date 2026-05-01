import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, Loader2, Filter, Radio } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface Election {
  id: string; name: string; type: string; state_code: string | null;
  status: string; start_date: string | null; end_date: string | null; result_date: string | null;
  phases: any[]; description: string; source_url: string | null;
}
interface State { code: string; name: string }

const statusColor: Record<string, string> = {
  upcoming: 'bg-accent/15 text-accent border-accent/30',
  announced: 'bg-warning/15 text-warning border-warning/30',
  ongoing: 'bg-primary/15 text-primary border-primary/30',
  completed: 'bg-muted text-muted-foreground border-border',
};

export default function Timeline() {
  const [elections, setElections] = useState<Election[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    const [{ data: e }, { data: s }] = await Promise.all([
      supabase.from('elections').select('*').order('start_date', { ascending: true, nullsFirst: false }),
      supabase.from('states').select('code,name').order('name'),
    ]);
    setElections((e as any) ?? []);
    setStates(s ?? []);
    setLoading(false);
  })(); }, []);

  const filtered = elections.filter(e =>
    (stateFilter === 'all' || e.state_code === stateFilter || (stateFilter === 'national' && !e.state_code)) &&
    (statusFilter === 'all' || e.status === statusFilter)
  );

  return (
    <div className="container max-w-5xl py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="outline" className="mb-3">Live timeline</Badge>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-3">Indian election calendar</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl">Upcoming and ongoing elections across India, with phases, key dates and result days.</p>
        <div className="flex flex-wrap gap-3 mb-10">
          <div className="flex items-center gap-2"><Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All states</SelectItem>
                <SelectItem value="national">National (Lok Sabha)</SelectItem>
                {states.map(s => <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">No elections match these filters.</Card>
      ) : (
        <div className="relative">
          <div className="absolute left-4 sm:left-6 top-2 bottom-2 w-px bg-border" aria-hidden />
          <div className="space-y-6">
            {filtered.map((e, i) => {
              const stateName = states.find(s => s.code === e.state_code)?.name ?? 'National';
              const activePhaseIdx = e.status === 'ongoing' ? findActivePhase(e.phases) : -1;
              return (
                <motion.div key={e.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="relative pl-12 sm:pl-16">
                  <span className={`absolute left-2 sm:left-4 top-4 h-5 w-5 rounded-full border-2 border-background ${e.status === 'ongoing' ? 'bg-primary pulse-ring' : e.status === 'upcoming' ? 'bg-accent' : 'bg-muted-foreground'}`} />
                  <Card className="p-6 bg-gradient-card hover:shadow-elevated transition-shadow">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display text-xl font-semibold">{e.name}</h3>
                          {e.status === 'ongoing' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                              <Radio className="h-3 w-3" /> Live Phase
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                          <MapPin className="h-3.5 w-3.5" /> {stateName} · {e.type.replace('_',' ')}
                        </p>
                      </div>
                      <Badge variant="outline" className={statusColor[e.status]}>{e.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 mb-4">{e.description}</p>
                    <div className="grid sm:grid-cols-3 gap-3 text-sm">
                      <DateBlock icon={<Calendar className="h-3.5 w-3.5" />} label="Start" date={e.start_date} />
                      <DateBlock icon={<Calendar className="h-3.5 w-3.5" />} label="End" date={e.end_date} />
                      <DateBlock icon={<Calendar className="h-3.5 w-3.5" />} label="Results" date={e.result_date} />
                    </div>
                    {e.phases?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border/60">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Phases</p>
                        <div className="flex flex-wrap gap-2">
                          {e.phases.map((p: any, idx: number) => {
                            const isActive = idx === activePhaseIdx;
                            return (
                              <span
                                key={idx}
                                className={`text-xs px-2.5 py-1 rounded-md border ${isActive ? 'bg-primary/15 text-primary border-primary/30 font-semibold' : 'bg-muted border-transparent'}`}
                              >
                                {isActive && <span className="mr-1">● Live</span>}
                                Phase {p.phase ?? idx + 1}: {fmt(p.date)} {p.constituencies && `· ${p.constituencies} seats`}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {e.source_url && (
                      <a href={e.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary mt-4 hover:underline">
                        Source <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DateBlock({ icon, label, date }: { icon: React.ReactNode; label: string; date: string | null }) {
  return (
    <div className="rounded-lg border border-border/60 p-3">
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">{icon} {label}</p>
      <p className="font-medium mt-0.5">{date ? fmt(date) : '—'}</p>
    </div>
  );
}
function fmt(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function findActivePhase(phases: any[] | undefined): number {
  if (!Array.isArray(phases) || phases.length === 0) return -1;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dated = phases.map((p, i) => ({ i, t: p?.date ? new Date(p.date).getTime() : NaN }));
  // latest phase whose date <= today
  const past = dated.filter(d => !isNaN(d.t) && d.t <= today.getTime()).sort((a, b) => b.t - a.t);
  if (past.length) return past[0].i;
  // else nearest upcoming
  const upcoming = dated.filter(d => !isNaN(d.t) && d.t > today.getTime()).sort((a, b) => a.t - b.t);
  return upcoming.length ? upcoming[0].i : 0;
}
