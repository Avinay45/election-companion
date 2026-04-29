import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Save, ShieldCheck } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const profileSchema = z.object({
  full_name: z.string().trim().max(100).optional().nullable(),
  state: z.string().trim().max(4).optional().nullable(),
  district: z.string().trim().max(100).optional().nullable(),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional().or(z.literal('')),
  age: z.coerce.number().int().min(10).max(120).optional().nullable(),
  voter_status: z.enum(['not_registered','applied','registered','unsure']).optional(),
  language: z.enum(['en','hi','te']).optional(),
});

interface State { code: string; name: string }

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [states, setStates] = useState<State[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) nav('/auth');
  }, [user, authLoading, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: s }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('states').select('code,name').order('name'),
      ]);
      setProfile(p ?? { id: user.id, email: user.email });
      setStates(s ?? []);
      setLoading(false);
    })();
  }, [user]);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const parsed = profileSchema.safeParse({
      full_name: fd.get('full_name'),
      state: fd.get('state'),
      district: fd.get('district'),
      pincode: fd.get('pincode'),
      age: fd.get('age') || null,
      voter_status: fd.get('voter_status') as any,
      language: fd.get('language') as any,
    });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSaving(true);
    const payload = {
      id: user.id,
      email: user.email,
      ...parsed.data,
      pincode: parsed.data.pincode || null,
      email_notifications: profile?.email_notifications ?? true,
    };
    const { error } = await supabase.from('profiles').upsert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Profile saved');
    setProfile({ ...profile, ...payload });
  }

  if (authLoading || loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container max-w-2xl py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-semibold tracking-tight mb-2">Your profile</h1>
        <p className="text-muted-foreground mb-8">Personalise timelines, reminders and answers based on where you vote.</p>
        <Card className="p-8 bg-gradient-card">
          <form onSubmit={save} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ''} maxLength={100} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="state">State / UT</Label>
                <Select name="state" defaultValue={profile?.state ?? undefined}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>{states.map(s => <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" name="district" defaultValue={profile?.district ?? ''} maxLength={100} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" name="pincode" defaultValue={profile?.pincode ?? ''} pattern="\d{6}" maxLength={6} placeholder="500001" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" type="number" min={10} max={120} defaultValue={profile?.age ?? ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="voter_status">Voter status</Label>
                <Select name="voter_status" defaultValue={profile?.voter_status ?? 'unsure'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unsure">I'm not sure</SelectItem>
                    <SelectItem value="not_registered">Not registered</SelectItem>
                    <SelectItem value="applied">Applied, awaiting</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language">Preferred language</Label>
                <Select name="language" defaultValue={profile?.language ?? 'en'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="te">తెలుగు</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Email reminders</p>
                <p className="text-sm text-muted-foreground">Registration deadlines and voting day alerts.</p>
              </div>
              <Switch
                checked={profile?.email_notifications ?? true}
                onCheckedChange={(v) => setProfile({ ...profile, email_notifications: v })}
              />
            </div>

            <Button type="submit" disabled={saving} className="bg-gradient-brand text-primary-foreground">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Save profile
            </Button>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Your data is private and used only to personalise the app.</p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
