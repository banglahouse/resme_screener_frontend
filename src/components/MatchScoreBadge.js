import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function MatchScoreBadge({ score }) {
    if (typeof score !== 'number') {
        return _jsx("p", { className: "text-sm text-slate-500", children: "Upload resumes to see the match score." });
    }
    return (_jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border border-lime-400/40 bg-slate-900/70 p-6 text-center", children: [_jsx("span", { className: "text-xs uppercase text-slate-400", children: "Match Score" }), _jsxs("p", { className: "text-5xl font-black text-lime-400", children: [score, "%"] }), _jsx("p", { className: "text-sm text-slate-300", children: "Overall suitability" })] }));
}
