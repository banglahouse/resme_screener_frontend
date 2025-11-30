import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ErrorBanner({ error }) {
    if (!error)
        return null;
    return (_jsxs("div", { className: "rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200", children: [_jsx("p", { className: "font-semibold", children: error.statusCode ? `Error ${error.statusCode}` : 'Error' }), _jsx("p", { children: error.message })] }));
}
