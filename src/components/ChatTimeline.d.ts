import type { ChatMessage } from '../types/application';
export type ChatTimelineProps = {
    messages: ChatMessage[];
    loading?: boolean;
};
export declare function ChatTimeline({ messages, loading }: ChatTimelineProps): import("react/jsx-runtime").JSX.Element;
