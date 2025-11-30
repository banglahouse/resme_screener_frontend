import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const suggestions = [
    'Does the candidate have a state university degree?',
    'Describe their backend leadership experience.',
    'How strong is their PostgreSQL experience?',
    'Are they eligible to work in the US?',
];
export function ChatInput({ onSend, disabled }) {
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!value.trim())
            return;
        setLoading(true);
        try {
            await onSend(value.trim());
            setValue('');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "flex flex-wrap gap-2", children: suggestions.map((prompt) => (_jsx("button", { type: "button", disabled: disabled || loading, onClick: () => setValue(prompt), className: "rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-indigo-400", children: prompt }, prompt))) }), _jsxs("form", { onSubmit: handleSubmit, className: "flex gap-2", children: [_jsx("input", { value: value, onChange: (event) => setValue(event.target.value), placeholder: "Ask the AI about this candidate...", disabled: disabled || loading, className: "flex-1 rounded-2xl bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500" }), _jsx("button", { type: "submit", disabled: disabled || loading, className: "rounded-2xl bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-60", children: loading ? 'Sending…' : 'Send' })] })] }));
}
