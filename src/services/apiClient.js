const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const DEFAULT_USER_ID = import.meta.env.VITE_USER_ID || 'demo-user';
const DEFAULT_USER_ROLE = import.meta.env.VITE_USER_ROLE || 'recruiter';
const USE_MOCKS = import.meta?.env?.VITE_USE_MOCKS === 'true';
async function handleResponse(res) {
    if (!res.ok) {
        let error = { message: 'Unknown error', statusCode: res.status };
        try {
            error = await res.json();
        }
        catch (err) {
            // ignore body parsing errors
        }
        throw error;
    }
    return res.json();
}
async function request(path, options = {}) {
    if (USE_MOCKS || options.useMock) {
        const { mockRequest } = await import('../utils/mocks');
        return mockRequest(path, options);
    }
    const headers = {
        'x-user-id': DEFAULT_USER_ID,
        'x-user-role': DEFAULT_USER_ROLE,
        ...options.headers,
    };
    const res = await fetch(`${API_BASE}${path}`, {
        credentials: options.credentials ?? 'include',
        ...options,
        headers,
    });
    return handleResponse(res);
}
export async function uploadApplication(payload) {
    const formData = new FormData();
    formData.append('jobKey', payload.jobKey);
    if (payload.jobTitle)
        formData.append('jobTitle', payload.jobTitle);
    formData.append('candidateUserId', payload.candidateUserId);
    formData.append('resumeFile', payload.resumeFile);
    formData.append('jdFile', payload.jdFile);
    return request('/applications', {
        method: 'POST',
        body: formData,
    });
}
export function getApplication(applicationId) {
    return request(`/applications/${applicationId}`);
}
export function getJobApplications(jobKey) {
    return request(`/jobs/${jobKey}/applications`);
}
export function listChats(applicationId, params) {
    const search = new URLSearchParams();
    if (params?.limit)
        search.set('limit', String(params.limit));
    if (params?.offset)
        search.set('offset', String(params.offset));
    const query = search.toString();
    const suffix = query ? `?${query}` : '';
    return request(`/applications/${applicationId}/chats${suffix}`);
}
export async function sendChat(applicationId, message) {
    const response = await request(`/applications/${applicationId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message }),
    });
    if (response.content || response.id) {
        return {
            id: response.id || crypto.randomUUID(),
            applicationId: response.applicationId || applicationId,
            role: response.role || 'assistant',
            content: response.content || response.answer || '',
            createdAt: response.createdAt || new Date().toISOString(),
            sources: response.sources,
        };
    }
    return {
        id: crypto.randomUUID(),
        applicationId,
        role: 'assistant',
        content: response.answer || 'No answer provided',
        createdAt: new Date().toISOString(),
        sources: response.sources,
    };
}
