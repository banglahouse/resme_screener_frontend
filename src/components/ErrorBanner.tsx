import type { ApiError } from '../types/application';

export function ErrorBanner({ error }: { error?: ApiError }) {
  if (!error) return null;
  return (
    <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
      <p className="font-semibold">{error.statusCode ? `Error ${error.statusCode}` : 'Error'}</p>
      <p>{error.message}</p>
    </div>
  );
}
