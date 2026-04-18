// components/ui/Card.tsx
'use client';
import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

interface CardProps extends HTMLMotionProps<'div'> {
  glow?: boolean;
  hover?: boolean;
}

export function Card({ children, className, glow, hover = true, ...props }: CardProps) {
  return (
    <motion.div
      className={clsx(
        'glass rounded-2xl relative overflow-hidden',
        hover && 'transition-all duration-300 hover:border-neon/20 hover:shadow-card-hover',
        glow && 'shadow-neon',
        className
      )}
      {...props}
    >
      {/* Subtle inner gradient */}
      <div className="absolute inset-0 bg-gradient-surface pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ─── Badge ───────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neon' | 'pink' | 'cyan' | 'gold' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'neutral', size = 'sm' }: BadgeProps) {
  const variants = {
    neon:    'bg-neon/10 text-neon border-neon/20',
    pink:    'bg-pink/10 text-pink border-pink/20',
    cyan:    'bg-cyan/10 text-cyan border-cyan/20',
    gold:    'bg-gold/10 text-gold border-gold/20',
    neutral: 'bg-white/5 text-muted border-white/10',
  };
  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span className={clsx(
      'inline-flex items-center font-mono rounded-full border tracking-wide',
      variants[variant],
      sizes[size]
    )}>
      {children}
    </span>
  );
}

// ─── Stat Card ───────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

export function StatCard({ label, value, sub, icon, trend, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="p-5 cursor-default group">
        <div className="flex items-start justify-between mb-3">
          <p className="font-mono text-[10px] text-muted tracking-widest uppercase">{label}</p>
          {icon && (
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted group-hover:border-neon/20 transition-colors">
              {icon}
            </div>
          )}
        </div>
        <p className="font-display text-3xl tracking-wide mb-1">{value}</p>
        {sub && (
          <p className={clsx(
            'text-xs font-mono',
            trend === 'up'   ? 'text-neon' :
            trend === 'down' ? 'text-pink' : 'text-muted'
          )}>
            {sub}
          </p>
        )}
      </Card>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('skeleton rounded-xl', className)} />;
}

// ─── Change indicator ────────────────────────────────
export function ChangeText({ value, className }: { value: number; className?: string }) {
  const up = value >= 0;
  return (
    <span className={clsx(
      'font-mono text-xs font-bold',
      up ? 'text-neon' : 'text-pink',
      className
    )}>
      {up ? '▲' : '▼'} {Math.abs(value).toFixed(2)}%
    </span>
  );
}

// ─── Section header ──────────────────────────────────
export function SectionHeader({ title, sub, action }: {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="font-display text-2xl tracking-wider">{title}</h2>
        {sub && <p className="text-muted text-sm mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Button ──────────────────────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neon' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, variant = 'neon', size = 'md', className, ...props }: BtnProps) {
  const variants = {
    neon:    'bg-gradient-to-r from-neon to-cyan text-black font-bold hover:shadow-neon',
    ghost:   'bg-white/5 text-text hover:bg-white/10 border border-white/10',
    outline: 'border border-neon/30 text-neon hover:bg-neon/10',
  };
  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-xl',
    md: 'text-sm px-4 py-2 rounded-xl',
    lg: 'text-base px-6 py-3 rounded-2xl',
  };

  return (
    <button
      className={clsx(
        'inline-flex items-center gap-2 font-mono tracking-wide transition-all duration-200 active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
