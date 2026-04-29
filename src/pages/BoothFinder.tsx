import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface State { code: string; name: string }
interface Booth { id: string; name: string; address: string | null; landmark: string | null; pincode: string | null; constituency: string | null; booth_number: string | null; district: string }

export default function BoothFinder() {
  const [states, setStates] = useState<State[]>([]);
  const [stateCode, setStateCode] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [results, setResults] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => { supabase.from('states').select('code,name').order('name').then(({ data }) => setStates(data ?? [])); }, []);

  async function search() {
    setLoading(true); setSearched(true);
    let q = supabase.from('polling_booths').select('*').limit(50);
    if (stateCode) q = q.eq('state_code', stateCode);
    if (district.trim()) q = q.ilike('district', `%${district.trim()}%`);
    if (pincode.trim()) q = q.eq('pincode', pincode.trim());
    const { data } = await q;
    setResults((data as any) ?? []);
    setLoading(false);
  }

  return (
    <div className="container max-w-4xl py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="outline" className="mb-3">Booth finder</Badge>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-3">Find your polling booth</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
          Search by state, district or pincode. For the most accurate booth (by EPIC number), also check the official ECI portal.
        </p>
        <Card className="p-6 mb-8 bg-gradient-card">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label>State / UT</Label>
              <Select value={stateCode} onValueChange={setStateCode}>
                <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>{states.map(s => <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>District</Label>
              <Input placeholder="Hyderabad" value={district} onChange={e => setDistrict(e.target.value)} maxLength={100} />
            </div>
            <div className="grid gap-2">
              <Label>Pincode</Label>
              <Input placeholder="500001" value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} />
            </div>
          </div>
          <Button onClick={search} disabled={loading} className="mt-5 bg-gradient-brand text-primary-foreground">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />} Search booths
          </Button>
          <p className="text-xs text-muted-foreground mt-3">For EPIC-based lookup visit <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">electoralsearch.eci.gov.in</a></p>
        </Card>

        {searched && (
          loading ? null : results.length === 0 ? (
            <Card className="p-10 text-center text-muted-foreground">No booths found in our directory for these filters. Try broader criteria or use the official ECI portal.</Card>
          ) : (
            <div className="grid gap-4">
              {results.map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className="p-5 bg-gradient-card flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-display text-lg font-semibold">{b.name}</h3>
                        {b.booth_number && <Badge variant="outline">{b.booth_number}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{b.address}{b.landmark ? ` · ${b.landmark}` : ''}</p>
                      <p className="text-xs text-muted-foreground mt-1.5">{b.district} {b.pincode && `· ${b.pincode}`} {b.constituency && `· ${b.constituency}`}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )
        )}
      </motion.div>
    </div>
  );
}
