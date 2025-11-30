export type ChatInputProps = {
    onSend(question: string): Promise<void> | void;
    disabled?: boolean;
};
export declare function ChatInput({ onSend, disabled }: ChatInputProps): import("react/jsx-runtime").JSX.Element;
