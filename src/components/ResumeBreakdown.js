import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const sections = [
    { key: 'skills', label: 'Key Skills', isList: true },
    { key: 'experience', label: 'Experience Highlights', isList: true },
];
function fallbackFromInsights(insights, key) {
    if (!insights)
        return undefined;
    const lower = key.toLowerCase();
    return insights.find((item) => item.toLowerCase().startsWith(lower)) ?? insights.find((item) => item.toLowerCase().includes(lower));
}
export function ResumeBreakdown({ match }) {
    return (_jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/70 p-5", children: [_jsx("h3", { className: "text-base font-semibold text-slate-100", children: "Resume Breakdown" }), _jsx("div", { className: "mt-4 grid gap-3 md:grid-cols-2", children: sections.map(({ key, label, isList }) => {
                    const structured = match?.breakdown?.[key];
                    const experienceHighlight = key === 'experience' ? match?.experienceHighlight : undefined;
                    const fallback = fallbackFromInsights(match?.insights, key);
                    const content = structured ?? experienceHighlight ?? fallback;
                    const items = Array.isArray(content) ? content : undefined;
                    return (_jsxs("div", { className: "rounded-xl bg-slate-900/60 p-4", children: [_jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: label }), isList && items ? (_jsx("ul", { className: "mt-2 list-disc space-y-1 pl-4 text-sm text-slate-200", children: items.map((item) => (_jsx("li", { children: item }, item))) })) : (_jsx("p", { className: "mt-1 text-sm text-slate-200", children: content || 'Data coming soon from backend.' }))] }, key));
                }) })] }));
}
