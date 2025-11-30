import { Navigate, Route, Routes } from 'react-router-dom';
import { ApplicationProvider } from './hooks/useApplication';
import { ResumeScreen } from './screens/ResumeScreen';

function PageLayout() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <ResumeScreen />
      </div>
    </main>
  );
}

export function App() {
  return (
    <ApplicationProvider>
      <Routes>
        <Route path="/" element={<PageLayout />} />
        <Route path="/applications/:applicationId" element={<PageLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ApplicationProvider>
  );
}
