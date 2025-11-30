import { rest } from 'msw';
import { server } from '../tests/server';
import { getApplication, listChats, sendChat, uploadApplication } from './apiClient';
const apiUrl = '*/api';
describe('apiClient', () => {
    test('uploadApplication sends multipart payload with auth headers', async () => {
        server.use(rest.post(`${apiUrl}/applications`, async (req, res, ctx) => {
            const formData = await req.formData();
            expect(formData.get('jobKey')).toBe('ENG-1');
            expect(req.headers.get('x-user-id')).toBe('demo-user');
            return res(ctx.status(200), ctx.json({
                applicationId: 'app-1',
                jobKey: 'ENG-1',
                match: { score: 90, strengths: [], gaps: [], insights: [] },
            }));
        }));
        const file = new File(['resume'], 'resume.txt', { type: 'text/plain' });
        const jd = new File(['jd'], 'jd.txt', { type: 'text/plain' });
        const result = await uploadApplication({
            jobKey: 'ENG-1',
            candidateUserId: 'cand-1',
            resumeFile: file,
            jdFile: jd,
        });
        expect(result.applicationId).toBe('app-1');
    });
    test('uploadApplication throws ApiError on failure', async () => {
        server.use(rest.post(`${apiUrl}/applications`, (_req, res, ctx) => res(ctx.status(400), ctx.json({ message: 'Missing data', statusCode: 400 }))));
        const file = new File(['resume'], 'resume.txt', { type: 'text/plain' });
        const jd = new File(['jd'], 'jd.txt', { type: 'text/plain' });
        await expect(uploadApplication({ jobKey: 'ENG-1', candidateUserId: 'cand-1', resumeFile: file, jdFile: jd })).rejects.toMatchObject({ message: 'Missing data', statusCode: 400 });
    });
    test('listChats and sendChat parse payloads', async () => {
        server.use(rest.get(`${apiUrl}/applications/:id/chats`, (_req, res, ctx) => res(ctx.status(200), ctx.json({ messages: [{ id: '1', role: 'assistant', content: 'Hi', createdAt: new Date().toISOString(), applicationId: 'app-1' }], total: 1, limit: 50, offset: 0 }))), rest.post(`${apiUrl}/applications/:id/chat`, async (req, res, ctx) => {
            const body = await req.json();
            expect(body.question).toBe('Hello');
            return res(ctx.status(200), ctx.json({
                answer: 'Response',
                sources: [{ type: 'resume', chunkId: '1', excerpt: 'Resume evidence' }],
            }));
        }));
        const chats = await listChats('app-1');
        expect(chats.total).toBe(1);
        const reply = await sendChat('app-1', 'Hello');
        expect(reply.content).toBe('Response');
        expect(reply.sources?.[0]?.excerpt).toBe('Resume evidence');
    });
    test('getApplication retrieves existing data', async () => {
        server.use(rest.get(`${apiUrl}/applications/:applicationId`, (req, res, ctx) => res(ctx.status(200), ctx.json({
            applicationId: req.params.applicationId,
            jobKey: 'ENG-1',
            match: { score: 70, strengths: [], gaps: [], insights: [] },
        }))));
        const data = await getApplication('saved-app');
        expect(data.applicationId).toBe('saved-app');
    });
});
