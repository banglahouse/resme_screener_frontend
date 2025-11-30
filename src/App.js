import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from 'react-router-dom';
import { ApplicationProvider } from './hooks/useApplication';
import { ResumeScreen } from './screens/ResumeScreen';
function PageLayout() {
    return (_jsx("main", { className: "min-h-screen bg-slate-950 px-4 py-10 text-slate-100", children: _jsx("div", { className: "mx-auto max-w-6xl", children: _jsx(ResumeScreen, {}) }) }));
}
export function App() {
    return (_jsx(ApplicationProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(PageLayout, {}) }), _jsx(Route, { path: "/applications/:applicationId", element: _jsx(PageLayout, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
