# Resume Screening Tool – Architecture & Implementation Plan

## 1. Component Hierarchy & Routing
- **Routing**: SPA with React Router.
  - `/` → `<ResumeScreen />` (upload + analysis + chat).
  - `/applications/:applicationId` → same screen hydrated by URL param to refetch.
- **Component tree (major nodes)**:
  - `<App>`: Router + `<AppProviders>` for context.
    - `<Layout>`: page shell (header, responsive grid).
      - `<UploadPanel>`: wraps `<FileUploader>` for resume + JD, includes Job details form & submit CTA.
      - `<AnalysisPanel>`: renders `<MatchScoreBadge>`, `<MatchCard>` (Strengths, Gaps, Missing Skills, Assessment), `<ResumeBreakdown>`.
      - `<ChatPanel>`: `<ChatTimeline>` + `<ChatInput>`, optional `<SuggestedPrompts>`.
      - `<ErrorBoundary>` / `<ErrorBanner>` for API failures.

Supporting components: `<SkeletonBlock>`, `<EmptyState>`, `<StatusPill>`, `<ChipList>`, `<InsightList>`.

## 2. State, Hooks & Data Flow
- **Global Context (`ApplicationProvider`)**
  ```ts
  type ApplicationState = {
    current?: Application;
    status: 'idle' | 'uploading' | 'ready' | 'error';
    error?: ApiError;
    chats: { items: ChatMessage[]; total: number; loading: boolean; error?: ApiError };
  };
  ```
  Actions via reducer: `startUpload`, `uploadSuccess`, `uploadFailure`, `setChats`, `appendChat`, `chatError`.

- **Hooks**
  - `useApplication()` expose state + dispatch helpers (`submitApplication`, `refreshChats`, `sendChat`).
  - `usePolling` (optional) for refetching chats on interval; default manual refresh.
  - `useFileInput` handles drag-drop, file validation (type/size) + inline errors.

- **Local UI state**
  - Form data: `jobKey`, `jobTitle`, `candidateUserId`, files.
  - Chat input text + optimistic queue (`pendingMessageIds`).
  - Loading toggles per API call to drive skeletons/spinners.

- **Data lifecycle**
  1. User selects files; validation ensures PDF/TXT.
  2. Submit triggers `POST /api/applications` via `apiClient.uploadApplication`, updates context.
  3. Upon success, fetch chats for `applicationId`.
  4. Chat sends call `POST /chat`, optimistic push into timeline; replaced w/ server payload or error.

## 3. API Service Strategy
- `src/services/apiClient.ts`
  - `request<T>(path, options)` injects headers (`x-user-id`, `x-user-role`), sets `Content-Type` when not FormData, handles non-2xx by parsing JSON and throwing typed `ApiError`.
  - Methods: `uploadApplication(form: UploadForm): Promise<Application>`, `getApplication(id)`, `getJobApplications(jobKey)`, `listChats(applicationId, params)`, `sendChat(applicationId, message)`.
  - Mock mode via env flag; returns stubbed data from `src/utils/mocks.ts` for Storybook/demo.

## 4. UI/UX States
- **Upload Panel**: default idle w/ dropzones, show file names + remove icons; validation errors inline near inputs. Submit button disabled until required fields present.
- **Analysis Panel**: shows skeletons while loading; after success displays match score, cards with bullet lists; empty sections show placeholder text.
- **Error Handling**: `<ErrorBanner>` at top of each panel; uses API error message + code.
- **Chat Panel**: timeline skeleton, handles empty state (“No messages yet”); message sending shows spinner, disables input.
- **Resume Breakdown**: uses `match.insights` and derived arrays for skills/experience/education/summary with fallback copy.

## 5. Styling Strategy (Tailwind)
- Base layout: `min-h-screen bg-slate-950 text-slate-100` with container `max-w-7xl mx-auto p-6 gap-6 grid md:grid-cols-[2fr_1fr]`.
- Upload cards: `border-2 border-dashed rounded-2xl bg-slate-900/80 hover:border-indigo-400 transition`. Drag-over uses `data-state` for ring.
- Match score badge: `text-4xl font-black text-lime-400` with circular progress accent using CSS gradient.
- Cards share `rounded-2xl bg-slate-900 shadow-xl p-5 space-y-3`.
- Chat bubbles: `rounded-2xl px-4 py-3 max-w-[85%]` with conditional colors (`bg-indigo-600 text-white` for AI, `bg-slate-800` for user). Timeline uses `overflow-y-auto h-full flex flex-col gap-3`.
- Buttons: use Tailwind variants (primary, ghost) defined via utility `cn` or `clsx` helper.
- Responsive: grid collapses to single column on <1024px, chat panel stacks below analysis.
- Typography: Title `text-3xl font-semibold tracking-tight`, subtitles `text-sm uppercase text-slate-400`.

## 6. Testing & Demo
- Provide Storybook stories using mock data; fallback mode triggered via `VITE_USE_MOCKS=true` to bypass network.
- Hooks and service functions unit-tested with Vitest + MSW mocks (future scope).
