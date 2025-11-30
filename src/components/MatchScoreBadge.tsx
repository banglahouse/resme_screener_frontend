export function MatchScoreBadge({ score }: { score?: number }) {
  if (typeof score !== 'number') {
    return <p className="text-sm text-slate-500">Upload resumes to see the match score.</p>;
  }
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-lime-400/40 bg-slate-900/70 p-6 text-center">
      <span className="text-xs uppercase text-slate-400">Match Score</span>
      <p className="text-5xl font-black text-lime-400">{score}%</p>
      <p className="text-sm text-slate-300">Overall suitability</p>
    </div>
  );
}
