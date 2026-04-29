import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Sparkles, Loader2, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLang } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Msg { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'How do I register to vote in Telangana?',
  'What documents do I need to vote?',
  'When is the next election in my state?',
  'What is NOTA?',
];

export default function Chat() {
  const { lang } = useLang();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput('');
    const next = [...messages, { role: 'user' as const, content }];
    setMessages(next);
    setLoading(true);
    let assistant = '';
    setMessages([...next, { role: 'assistant', content: '' }]);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: next, language: lang }),
      });
      if (r.status === 429) { toast.error('Too many requests. Please wait a moment.'); setLoading(false); return; }
      if (r.status === 402) { toast.error('AI credits exhausted. Please add credits.'); setLoading(false); return; }
      if (!r.ok || !r.body) throw new Error('Stream failed');

      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf('\n')) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') continue;
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              assistant += c;
              setMessages(m => m.map((msg, i) => i === m.length - 1 ? { ...msg, content: assistant } : msg));
            }
          } catch { buf = line + '\n' + buf; break; }
        }
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      }
    } catch (e) {
      toast.error('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function startVoice() {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error('Voice input not supported in this browser'); return; }
    const r = new SR();
    r.lang = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-IN';
    r.onresult = (ev: any) => setInput(ev.results[0][0].transcript);
    r.onerror = () => toast.error('Could not capture audio');
    r.start();
  }

  return (
    <div className="container max-w-3xl py-8 flex flex-col h-[calc(100vh-4rem)]">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <Badge variant="outline" className="mb-2"><Sparkles className="h-3 w-3 mr-1" /> AI Assistant</Badge>
        <h1 className="font-display text-3xl font-semibold">Ask anything about Indian elections</h1>
      </motion.div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-xl border border-border/60 bg-gradient-card p-4 space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="h-14 w-14 rounded-2xl bg-gradient-brand flex items-center justify-center mb-4 shadow-glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground mb-6">Try one of these to get started:</p>
            <div className="grid sm:grid-cols-2 gap-2 max-w-xl w-full">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} className="text-left text-sm p-3 rounded-lg border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <Card className={`max-w-[85%] p-4 ${m.role === 'user' ? 'bg-gradient-brand text-primary-foreground border-0' : 'bg-background'}`}>
              {m.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-headings:font-display">
                  {m.content ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown> : <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm">{m.content}</p>
              )}
            </Card>
          </div>
        ))}
      </div>

      <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2 items-end">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Type your question…"
          className="min-h-[52px] resize-none"
          maxLength={2000}
          disabled={loading}
        />
        <Button type="button" variant="outline" size="icon" onClick={startVoice} disabled={loading} className="h-[52px] w-[52px] shrink-0"><Mic className="h-4 w-4" /></Button>
        <Button type="submit" size="icon" disabled={loading || !input.trim()} className="h-[52px] w-[52px] shrink-0 bg-gradient-brand text-primary-foreground">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground text-center mt-2">Always verify important details with official ECI sources at eci.gov.in</p>
    </div>
  );
}
