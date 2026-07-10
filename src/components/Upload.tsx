import React, { useRef, useState } from "react";
import type { Document } from "../types";
import { deleteDocument, uploadDocument } from "../api/documentAPI";
import { Trash2, UploadIcon } from "lucide-react";

interface UploadProps {
    documents: Document[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    onUpload: (doc: Document) => void;
    onDelete: (id: number) => void;
}

export default function Upload({
    documents,
    selectedId,
    onSelect,
    onUpload,
    onDelete,
}: UploadProps) {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const doc = await uploadDocument(file);
            onUpload(doc);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    async function handleDelete(e: React.MouseEvent, id: number) {
        e.stopPropagation();
        try {
            await deleteDocument(id);
            onDelete(id);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed");
        }
    }

    return (
        <div className="upload-section">
            <h2>Documents</h2>
            <label className="upload-button">
                <UploadIcon size={15} strokeWidth={3.0} />
                {uploading ? "Uploading.." : "Upload a file"}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf, .doc, .docx, .txt, .pptx"
                    onChange={handleFileChange}
                    disabled={uploading}
                    hidden
                />
            </label>

            {error && <p className="error-text">{error}</p>}

            <ul className="document-list">
                {documents.length === 0 && !uploading && (
                    <li className="empty-state">No documents yet. Upload one to <strong>seek</strong>.</li>
                )}
                {documents.map((doc) => (
                    <li
                        key={doc.id}
                        className={doc.id === selectedId ? "document-item selected" : "document-item"}
                        onClick={() => onSelect(doc.id)}
                    >
                        <span className="document-name">{doc.fileName}</span>
                        <span className="document-time">
                            {new Date(doc.uploadTime).toLocaleString()}
                        </span>
                        <button className="delete-button"
                            onClick={(e) => handleDelete(e, doc.id)}
                            title="Delete"
                        >
                            <Trash2 size={15} strokeWidth={1.75} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}