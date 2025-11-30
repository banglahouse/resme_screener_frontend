import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function MatchCard({ title, items, emptyFallback = 'No data', icon, accent = 'border-slate-800' }) {
    const list = items?.length ? items : undefined;
    return (_jsxs("section", { className: `rounded-2xl border ${accent} bg-slate-900/70 p-5 shadow-xl space-y-3`, children: [_jsxs("header", { className: "flex items-center gap-3", children: [icon, _jsx("h3", { className: "text-base font-semibold text-slate-100", children: title })] }), list ? (_jsx("ul", { className: "list-disc space-y-1 pl-4 text-sm text-slate-300", children: list.map((item) => (_jsx("li", { children: item }, item))) })) : (_jsx("p", { className: "text-sm text-slate-500", children: emptyFallback }))] }));
}
