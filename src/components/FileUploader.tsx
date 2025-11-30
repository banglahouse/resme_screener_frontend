import { useCallback, useRef, useState } from 'react';

export type FileUploaderProps = {
  label: string;
  description?: string;
  accept?: string;
  file?: File;
  onFileSelect(file: File): void;
  error?: string;
};

const ACCEPTED_TYPES = ['application/pdf', 'text/plain'];

export function FileUploader({ label, description, accept, file, onFileSelect, error }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setDragging] = useState(false);

  const validateFile = useCallback(
    (selected?: File) => {
      if (!selected) return;
      if (!ACCEPTED_TYPES.includes(selected.type)) {
        throw new Error('Only PDF or TXT files are allowed');
      }
      onFileSelect(selected);
    },
    [onFileSelect]
  );

  const handleFiles = useCallback(
    (files?: FileList | null) => {
      if (!files || !files.length) return;
      try {
        validateFile(files[0]);
      } catch (err) {
        alert((err as Error).message);
      } finally {
        setDragging(false);
      }
    },
    [validateFile]
  );

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-200">{label}</p>
      {description && <p className="text-xs text-slate-400">{description}</p>}
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition ${
          isDragging ? 'border-lime-400 bg-slate-900/70' : 'border-slate-700 bg-slate-900/40'
        } ${error ? 'border-red-500' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept || '.pdf,.txt'}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-slate-800 px-4 py-1 text-sm text-lime-300"
        >
          Choose file
        </button>
        <p className="text-sm text-slate-300">or drag & drop a PDF/TXT</p>
        {file && <p className="text-xs text-slate-400">Selected: {file.name}</p>}
      </label>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
