import { motion } from 'framer-motion';

export function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute -top-40 -right-40 h-[40rem] w-[40rem] rounded-full bg-accent/25 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.18, scale: 1 }}
        transition={{ duration: 1.6, delay: 0.2, ease: 'easeOut' }}
        className="absolute -bottom-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-secondary/25 blur-3xl"
      />
      <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] text-accent chakra-spin" width="800" height="800" viewBox="0 0 200 200">
        <g fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="100" cy="100" r="90"/>
          <circle cx="100" cy="100" r="70"/>
          {Array.from({ length: 24 }).map((_, i) => (
            <line key={i} x1="100" y1="10" x2="100" y2="190" transform={`rotate(${i * 15} 100 100)`}/>
          ))}
        </g>
      </svg>
    </div>
  );
}
