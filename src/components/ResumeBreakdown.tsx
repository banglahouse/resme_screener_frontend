import type { MatchInsights } from '../types/application';

type SectionKey = 'skills' | 'experience' | 'education' | 'summary';

const sections: { key: SectionKey; label: string; isList?: boolean }[] = [
  { key: 'skills', label: 'Key Skills', isList: true },
  { key: 'experience', label: 'Experience Highlights', isList: true },
];

function fallbackFromInsights(insights: string[] | undefined, key: string) {
  if (!insights) return undefined;
  const lower = key.toLowerCase();
  return insights.find((item) => item.toLowerCase().startsWith(lower)) ?? insights.find((item) => item.toLowerCase().includes(lower));
}

export function ResumeBreakdown({ match }: { match?: MatchInsights }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <h3 className="text-base font-semibold text-slate-100">Resume Breakdown</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {sections.map(({ key, label, isList }) => {
          const structured = match?.breakdown?.[key];
          const experienceHighlight = key === 'experience' ? match?.experienceHighlight : undefined;
          const fallback = fallbackFromInsights(match?.insights, key);
          const content = structured ?? experienceHighlight ?? fallback;
          const items = Array.isArray(content) ? content : undefined;
          return (
            <div key={key} className="rounded-xl bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
              {isList && items ? (
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-200">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-slate-200">{content || 'Data coming soon from backend.'}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
