import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, useState } from 'react';
const ACCEPTED_TYPES = ['application/pdf', 'text/plain'];
export function FileUploader({ label, description, accept, file, onFileSelect, error }) {
    const inputRef = useRef(null);
    const [isDragging, setDragging] = useState(false);
    const validateFile = useCallback((selected) => {
        if (!selected)
            return;
        if (!ACCEPTED_TYPES.includes(selected.type)) {
            throw new Error('Only PDF or TXT files are allowed');
        }
        onFileSelect(selected);
    }, [onFileSelect]);
    const handleFiles = useCallback((files) => {
        if (!files || !files.length)
            return;
        try {
            validateFile(files[0]);
        }
        catch (err) {
            alert(err.message);
        }
        finally {
            setDragging(false);
        }
    }, [validateFile]);
    const handleDrop = (event) => {
        event.preventDefault();
        handleFiles(event.dataTransfer.files);
    };
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-medium text-slate-200", children: label }), description && _jsx("p", { className: "text-xs text-slate-400", children: description }), _jsxs("label", { onDragOver: (event) => {
                    event.preventDefault();
                    setDragging(true);
                }, onDragLeave: () => setDragging(false), onDrop: handleDrop, className: `flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition ${isDragging ? 'border-lime-400 bg-slate-900/70' : 'border-slate-700 bg-slate-900/40'} ${error ? 'border-red-500' : ''}`, children: [_jsx("input", { ref: inputRef, type: "file", accept: accept || '.pdf,.txt', className: "hidden", onChange: (event) => handleFiles(event.target.files) }), _jsx("button", { type: "button", onClick: () => inputRef.current?.click(), className: "rounded-full bg-slate-800 px-4 py-1 text-sm text-lime-300", children: "Choose file" }), _jsx("p", { className: "text-sm text-slate-300", children: "or drag & drop a PDF/TXT" }), file && _jsxs("p", { className: "text-xs text-slate-400", children: ["Selected: ", file.name] })] }), error && _jsx("p", { className: "text-xs text-red-400", children: error })] }));
}
