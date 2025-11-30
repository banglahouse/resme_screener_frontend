import type { ApiError, Application, ChatMessage, UploadForm } from '../types/application';
type Status = 'idle' | 'uploading' | 'ready' | 'error' | 'loading';
type ApplicationState = {
    current?: Application;
    status: Status;
    error?: ApiError;
    chats: {
        loading: boolean;
        items: ChatMessage[];
        total: number;
        error?: ApiError;
    };
};
export declare function ApplicationProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useApplication(): {
    state: ApplicationState;
    submitApplication: (payload: UploadForm) => Promise<Application>;
    loadApplicationById: (applicationId: string) => Promise<Application | undefined>;
    sendMessage: (applicationId: string, message: string) => Promise<{
        id: string;
        applicationId: string;
        role: "assistant";
        content: string;
        createdAt: string;
        sources: import("../types/application").ChatSource[] | undefined;
    }>;
    loadChats: (applicationId: string) => Promise<void>;
    resetApplication: () => void;
};
export {};
