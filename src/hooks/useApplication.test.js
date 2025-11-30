import { jsx as _jsx } from "react/jsx-runtime";
import { rest } from 'msw';
import { renderHook, act } from '@testing-library/react';
import { ApplicationProvider, useApplication } from './useApplication';
import { server } from '../tests/server';
const apiUrl = '*/api';
const wrapper = ({ children }) => _jsx(ApplicationProvider, { children: children });
describe('useApplication', () => {
    test('submitApplication hydrates application and chats', async () => {
        server.use(rest.post(`${apiUrl}/applications`, async (_req, res, ctx) => res(ctx.status(200), ctx.json({
            applicationId: 'app-123',
            jobKey: 'ENG-1',
            match: { score: 90, strengths: ['Leadership'], gaps: [], insights: [] },
        }))), rest.get(`${apiUrl}/applications/:id/chats`, (_req, res, ctx) => res(ctx.status(200), ctx.json({ messages: [{ id: '1', role: 'assistant', content: 'Insight', createdAt: new Date().toISOString(), applicationId: 'app-123' }], total: 1, limit: 50, offset: 0 }))));
        const { result } = renderHook(() => useApplication(), { wrapper });
        const file = new File(['resume'], 'resume.txt', { type: 'text/plain' });
        await act(async () => {
            await result.current.submitApplication({ jobKey: 'ENG-1', candidateUserId: 'cand-1', resumeFile: file, jdFile: file });
        });
        expect(result.current.state.current?.applicationId).toBe('app-123');
        expect(result.current.state.chats.items).toHaveLength(1);
    });
    test('loadApplicationById fetches existing application', async () => {
        server.use(rest.get(`${apiUrl}/applications/:applicationId`, (req, res, ctx) => res(ctx.status(200), ctx.json({ applicationId: req.params.applicationId, jobKey: 'ENG-1', match: { score: 75, strengths: [], gaps: [], insights: [] } }))), rest.get(`${apiUrl}/applications/:applicationId/chats`, (_req, res, ctx) => res(ctx.status(200), ctx.json({ messages: [], total: 0, limit: 50, offset: 0 }))));
        const { result } = renderHook(() => useApplication(), { wrapper });
        await act(async () => {
            await result.current.loadApplicationById('existing-app');
        });
        expect(result.current.state.current?.jobKey).toBe('ENG-1');
        expect(result.current.state.status).toBe('ready');
    });
    test('sendMessage appends optimistic and assistant replies', async () => {
        server.use(rest.post(`${apiUrl}/applications/:applicationId/chat`, (_req, res, ctx) => res(ctx.status(200), ctx.json({
            answer: 'Reply',
            sources: [{ type: 'resume', chunkId: 'chunk-1', excerpt: 'Resume detail' }],
        }))));
        const { result } = renderHook(() => useApplication(), { wrapper });
        await act(async () => {
            await result.current.sendMessage('app-200', 'Hello');
        });
        const lastTwo = result.current.state.chats.items.slice(-2);
        expect(lastTwo.map((item) => item.role)).toEqual(['user', 'assistant']);
        expect(lastTwo[1].sources?.[0].excerpt).toBe('Resume detail');
    });
});
