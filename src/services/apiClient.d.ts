import { Application, ChatMessage, PaginatedResponse, UploadForm } from '../types/application';
export declare function uploadApplication(payload: UploadForm): Promise<Application>;
export declare function getApplication(applicationId: string): Promise<Application>;
export declare function getJobApplications(jobKey: string): Promise<Application[]>;
export declare function listChats(applicationId: string, params?: {
    limit?: number;
    offset?: number;
}): Promise<PaginatedResponse<ChatMessage>>;
export declare function sendChat(applicationId: string, message: string): Promise<{
    id: string;
    applicationId: string;
    role: "assistant";
    content: string;
    createdAt: string;
    sources: import("../types/application").ChatSource[] | undefined;
}>;
