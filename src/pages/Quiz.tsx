import { motion } from 'framer-motion';
import { Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const QS = [
  { q: 'What is the minimum age to vote in India?', opts: ['16','18','21','25'], a: 1 },
  { q: 'Which body conducts elections in India?', opts: ['Supreme Court','Parliament','Election Commission of India','Ministry of Home Affairs'], a: 2 },
  { q: 'What does EPIC stand for?', opts: ['Electors Photo Identity Card','Election Polling ID Card','Electoral Personal ID Code','Elector Photo Issuance Card'], a: 0 },
  { q: 'Which form is used for new voter registration?', opts: ['Form 4','Form 6','Form 8','Form 11'], a: 1 },
  { q: 'NOTA on EVMs means…', opts: ['New Option to Apply','None of the Above','National Online Tally','Next On The Ballot'], a: 1 },
];

import { useState } from 'react';

export default function Quiz() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === QS[idx].a) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 < QS.length) { setIdx(idx + 1); setPicked(null); }
      else setDone(true);
    }, 900);
  }

  function reset() { setIdx(0); setScore(0); setDone(false); setPicked(null); }

  return (
    <div className="container max-w-2xl py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="outline" className="mb-3"><Award className="h-3 w-3 mr-1" /> Civic quiz</Badge>
        <h1 className="font-display text-4xl font-semibold tracking-tight mb-2">Test your election IQ</h1>
        <p className="text-muted-foreground mb-8">Five quick questions about Indian elections. Non-partisan, just facts.</p>

        {!done ? (
          <Card className="p-8 bg-gradient-card">
            <p className="text-sm text-muted-foreground mb-2">Question {idx + 1} of {QS.length}</p>
            <h2 className="font-display text-2xl font-semibold mb-6">{QS[idx].q}</h2>
            <div className="space-y-2">
              {QS[idx].opts.map((opt, i) => {
                const isAns = picked !== null && i === QS[idx].a;
                const isWrong = picked === i && i !== QS[idx].a;
                return (
                  <button key={i} onClick={() => pick(i)} disabled={picked !== null}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      isAns ? 'border-secondary bg-secondary/10' :
                      isWrong ? 'border-destructive bg-destructive/10' :
                      'border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </Card>
        ) : (
          <Card className="p-10 bg-gradient-card text-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-brand mx-auto mb-4 flex items-center justify-center shadow-glow">
              <Award className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl font-semibold mb-2">{score}/{QS.length} correct</h2>
            <p className="text-muted-foreground mb-6">{score === QS.length ? 'Perfect! You know your civics.' : score >= 3 ? 'Solid effort — keep learning.' : 'Great start — explore the journey to learn more.'}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={reset} variant="outline">Try again</Button>
              <Button asChild className="bg-gradient-brand text-primary-foreground"><Link to="/journey">Continue journey <ArrowRight className="h-4 w-4 ml-1.5" /></Link></Button>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
