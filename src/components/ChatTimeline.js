import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ChatTimeline({ messages, loading }) {
    if (loading) {
        return (_jsx("div", { className: "space-y-3", children: Array.from({ length: 3 }).map((_, index) => (_jsx("div", { className: "h-14 animate-pulse rounded-2xl bg-slate-800/60" }, index))) }));
    }
    if (!messages.length) {
        return _jsx("p", { className: "text-sm text-slate-400", children: "No messages yet. Ask the AI for deeper insights." });
    }
    return (_jsx("div", { className: "flex flex-col gap-4", children: messages.map((message) => (_jsx("div", { className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg ${message.role === 'user' ? 'bg-slate-800 text-slate-100' : 'bg-indigo-600 text-white'}`, children: [_jsxs("p", { className: "text-xs uppercase tracking-wide text-white/60", children: [message.role === 'user' ? 'You' : 'AI Assistant', " \u00B7 ", new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] }), _jsx("p", { className: "leading-relaxed", children: message.content })] }) }, message.id))) }));
}
