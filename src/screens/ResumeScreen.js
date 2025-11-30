import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileUploader } from '../components/FileUploader';
import { MatchCard } from '../components/MatchCard';
import { ErrorBanner } from '../components/ErrorBanner';
import { ChatTimeline } from '../components/ChatTimeline';
import { ChatInput } from '../components/ChatInput';
import { MatchScoreBadge } from '../components/MatchScoreBadge';
import { ResumeBreakdown } from '../components/ResumeBreakdown';
import { useApplication } from '../hooks/useApplication';
export function ResumeScreen() {
    const navigate = useNavigate();
    const { applicationId } = useParams();
    const { state, submitApplication, sendMessage, loadApplicationById, resetApplication } = useApplication();
    const [jobKey, setJobKey] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [candidateUserId, setCandidateUserId] = useState('');
    const [resumeFile, setResumeFile] = useState();
    const [jdFile, setJdFile] = useState();
    const [formError, setFormError] = useState();
    const isBusy = state.status === 'uploading' || state.status === 'loading';
    const canSubmit = Boolean(jobKey && candidateUserId && resumeFile && jdFile && !isBusy);
    useEffect(() => {
        if (applicationId && state.current?.applicationId !== applicationId) {
            loadApplicationById(applicationId);
        }
    }, [applicationId, loadApplicationById, state.current?.applicationId]);
    useEffect(() => {
        const application = state.current;
        if (!application)
            return;
        setJobKey((prev) => prev || application.jobKey);
        setJobTitle((prev) => prev || application.jobTitle || '');
        setCandidateUserId((prev) => prev || application.candidateUserId || '');
    }, [state.current]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!canSubmit || !resumeFile || !jdFile) {
            setFormError('Please fill all required fields.');
            return;
        }
        setFormError(undefined);
        const application = await submitApplication({ jobKey, jobTitle, candidateUserId, resumeFile, jdFile });
        navigate(`/applications/${application.applicationId}`, { replace: true });
    };
    const handleReset = () => {
        resetApplication();
        setJobKey('');
        setJobTitle('');
        setCandidateUserId('');
        setResumeFile(undefined);
        setJdFile(undefined);
        setFormError(undefined);
        navigate('/', { replace: true });
    };
    const application = state.current;
    const buttonText = isBusy ? (state.status === 'uploading' ? 'Analyzing…' : 'Loading application…') : 'Generate Match Analysis';
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("header", { className: "space-y-2", children: [_jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-slate-500", children: "Resume Screening Tool" }), _jsx("h1", { className: "text-3xl font-semibold text-white", children: "AI-powered resume matching for recruiters" }), _jsx("p", { className: "text-sm text-slate-400", children: "Upload a JD and resume to see strengths, gaps, and chat with the AI assistant." })] }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-[1.6fr_1fr]", children: [_jsxs("section", { className: "space-y-6 rounded-3xl border border-slate-800 bg-slate-950/60 p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-white", children: "Upload & Analyze" }), _jsx(ErrorBanner, { error: state.error }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-300", children: "Job Key *" }), _jsx("input", { value: jobKey, onChange: (event) => setJobKey(event.target.value), placeholder: "e.g. ENG-2034", className: "mt-1 w-full rounded-2xl bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-300", children: "Job Title" }), _jsx("input", { value: jobTitle, onChange: (event) => setJobTitle(event.target.value), placeholder: "Senior Backend Engineer", className: "mt-1 w-full rounded-2xl bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-300", children: "Candidate User ID *" }), _jsx("input", { value: candidateUserId, onChange: (event) => setCandidateUserId(event.target.value), placeholder: "candidate-123", className: "mt-1 w-full rounded-2xl bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500" })] }), _jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [_jsx(FileUploader, { label: "Resume (PDF/TXT)", file: resumeFile, onFileSelect: setResumeFile }), _jsx(FileUploader, { label: "Job Description (PDF/TXT)", file: jdFile, onFileSelect: setJdFile })] }), formError && _jsx("p", { className: "text-sm text-red-400", children: formError }), _jsx("button", { type: "submit", disabled: !canSubmit, className: "w-full rounded-2xl bg-lime-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-lime-300 disabled:opacity-50", children: buttonText }), _jsx("button", { type: "button", onClick: handleReset, disabled: isBusy, className: "w-full rounded-2xl border border-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-900/40 disabled:opacity-50", children: "Clear Data & Start New" })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-[0.7fr_1.3fr]", children: [_jsx(MatchScoreBadge, { score: application?.match.score }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsx(MatchCard, { title: "Strengths", items: application?.match.strengths, accent: "border-lime-500/30" }), _jsx(MatchCard, { title: "Gaps", items: application?.match.gaps, accent: "border-amber-500/30" }), _jsx(MatchCard, { title: "Missing Skills/Experience", items: application?.match.breakdown?.skills, emptyFallback: "Insights will populate after analysis.", accent: "border-red-500/30" }), _jsx(MatchCard, { title: "Overall Assessment", items: application?.match.insights?.slice(-1), emptyFallback: "Assessment will appear after analysis.", accent: "border-indigo-500/30" })] })] }), _jsx(ResumeBreakdown, { match: application?.match })] }), _jsxs("section", { className: "flex h-full flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-white", children: "AI Chat" }), _jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Application context" })] }), application && (_jsxs("span", { className: "rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300", children: ["#", application.applicationId.slice(-6)] }))] }), _jsx(ErrorBanner, { error: state.chats.error }), _jsx("div", { className: "flex-1 overflow-y-auto rounded-2xl bg-slate-900/40 p-4", children: _jsx(ChatTimeline, { messages: state.chats.items, loading: state.chats.loading && !state.chats.items.length }) }), _jsx(ChatInput, { disabled: !application, onSend: async (message) => {
                                    if (!application)
                                        return;
                                    await sendMessage(application.applicationId, message);
                                } })] })] })] }));
}
