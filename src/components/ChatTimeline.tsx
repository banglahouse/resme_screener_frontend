import type { ChatMessage } from '../types/application';

export type ChatTimelineProps = {
  messages: ChatMessage[];
  loading?: boolean;
};

export function ChatTimeline({ messages, loading }: ChatTimelineProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-14 animate-pulse rounded-2xl bg-slate-800/60" />
        ))}
      </div>
    );
  }

  if (!messages.length) {
    return <p className="text-sm text-slate-400">No messages yet. Ask the AI for deeper insights.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg ${
              message.role === 'user' ? 'bg-slate-800 text-slate-100' : 'bg-indigo-600 text-white'
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-white/60">
              {message.role === 'user' ? 'You' : 'AI Assistant'} · {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="leading-relaxed">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
