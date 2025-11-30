export type FileUploaderProps = {
    label: string;
    description?: string;
    accept?: string;
    file?: File;
    onFileSelect(file: File): void;
    error?: string;
};
export declare function FileUploader({ label, description, accept, file, onFileSelect, error }: FileUploaderProps): import("react/jsx-runtime").JSX.Element;
