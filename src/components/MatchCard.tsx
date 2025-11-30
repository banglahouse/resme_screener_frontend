import { ReactNode } from 'react';

interface MatchCardProps {
  title: string;
  items?: string[];
  emptyFallback?: string;
  icon?: ReactNode;
  accent?: string;
}

export function MatchCard({ title, items, emptyFallback = 'No data', icon, accent = 'border-slate-800' }: MatchCardProps) {
  const list = items?.length ? items : undefined;
  return (
    <section className={`rounded-2xl border ${accent} bg-slate-900/70 p-5 shadow-xl space-y-3`}>
      <header className="flex items-center gap-3">
        {icon}
        <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      </header>
      {list ? (
        <ul className="list-disc space-y-1 pl-4 text-sm text-slate-300">
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">{emptyFallback}</p>
      )}
    </section>
  );
}
