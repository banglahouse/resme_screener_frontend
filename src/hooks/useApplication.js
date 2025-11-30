import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import * as api from '../services/apiClient';
const initialState = {
    status: 'idle',
    chats: { loading: false, items: [], total: 0 },
};
function reducer(state, action) {
    switch (action.type) {
        case 'startUpload':
            return { ...state, status: 'uploading', error: undefined };
        case 'loadExistingStart':
            return { ...state, status: 'loading', error: undefined };
        case 'uploadSuccess':
            return { ...state, status: 'ready', current: action.payload };
        case 'uploadFailure':
            return { ...state, status: 'error', error: action.payload };
        case 'chatLoading':
            return { ...state, chats: { ...state.chats, loading: true, error: undefined } };
        case 'setChats':
            return { ...state, chats: { loading: false, items: action.payload.items, total: action.payload.total } };
        case 'appendChat':
            return {
                ...state,
                chats: {
                    ...state.chats,
                    items: [...state.chats.items, action.payload],
                    total: state.chats.total + 1,
                },
            };
        case 'chatError':
            return { ...state, chats: { ...state.chats, loading: false, error: action.payload } };
        case 'reset':
            return { status: 'idle', chats: { loading: false, items: [], total: 0 } };
        default:
            return state;
    }
}
const ApplicationContext = createContext(undefined);
function useApplicationController() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const loadChats = useCallback(async (applicationId) => {
        if (!applicationId)
            return;
        dispatch({ type: 'chatLoading' });
        try {
            const res = await api.listChats(applicationId, { limit: 50 });
            dispatch({ type: 'setChats', payload: { items: res.messages, total: res.total } });
        }
        catch (error) {
            dispatch({ type: 'chatError', payload: error });
        }
    }, []);
    const submitApplication = useCallback(async (payload) => {
        dispatch({ type: 'startUpload' });
        try {
            const application = await api.uploadApplication(payload);
            dispatch({ type: 'uploadSuccess', payload: application });
            await loadChats(application.applicationId);
            return application;
        }
        catch (error) {
            dispatch({ type: 'uploadFailure', payload: error });
            throw error;
        }
    }, [loadChats]);
    const loadApplicationById = useCallback(async (applicationId) => {
        if (!applicationId)
            return;
        dispatch({ type: 'loadExistingStart' });
        try {
            const application = await api.getApplication(applicationId);
            dispatch({ type: 'uploadSuccess', payload: application });
            await loadChats(application.applicationId);
            return application;
        }
        catch (error) {
            dispatch({ type: 'uploadFailure', payload: error });
            throw error;
        }
    }, [loadChats]);
    const sendMessage = useCallback(async (applicationId, message) => {
        const optimistic = {
            id: `temp-${Date.now()}`,
            applicationId,
            role: 'user',
            content: message,
            createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'appendChat', payload: optimistic });
        try {
            const res = await api.sendChat(applicationId, message);
            dispatch({ type: 'appendChat', payload: res });
            return res;
        }
        catch (error) {
            dispatch({ type: 'chatError', payload: error });
            throw error;
        }
    }, []);
    const resetApplication = useCallback(() => {
        dispatch({ type: 'reset' });
    }, []);
    return useMemo(() => ({ state, submitApplication, loadApplicationById, sendMessage, loadChats, resetApplication }), [state, submitApplication, loadApplicationById, sendMessage, loadChats, resetApplication]);
}
export function ApplicationProvider({ children }) {
    const value = useApplicationController();
    return _jsx(ApplicationContext.Provider, { value: value, children: children });
}
export function useApplication() {
    const ctx = useContext(ApplicationContext);
    if (!ctx)
        throw new Error('useApplication must be used within ApplicationProvider');
    return ctx;
}
