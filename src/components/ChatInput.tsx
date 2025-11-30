import { FormEvent, useState } from 'react';

export type ChatInputProps = {
  onSend(question: string): Promise<void> | void;
  disabled?: boolean;
};

const suggestions = [
  'Does the candidate have a state university degree?',
  'Describe their backend leadership experience.',
  'How strong is their PostgreSQL experience?',
  'Are they eligible to work in the US?',
];

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    try {
      await onSend(value.trim());
      setValue('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {suggestions.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={disabled || loading}
            onClick={() => setValue(prompt)}
            className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-indigo-400"
          >
            {prompt}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask the AI about this candidate..."
          disabled={disabled || loading}
          className="flex-1 rounded-2xl bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
        />
        <button
          type="submit"
          disabled={disabled || loading}
          className="rounded-2xl bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Send'}
        </button>
      </form>
    </div>
  );
}
