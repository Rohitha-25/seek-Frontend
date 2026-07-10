import React, { useState } from "react";
import { type ChatMessage, type Document } from "../types";
import { queryDocument } from "../api/documentAPI";
import { ArrowUp, UploadIcon } from "lucide-react";

interface ChatProps {
    selectedDocument: Document | null;
}

export default function Chat({
    selectedDocument 
}: ChatProps) {

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleQuery() {
        if (!selectedDocument || !input.trim()) return;

        const query = input.trim();
        setMessages((prev) => [...prev, { role: "user", content: query }]);
        setInput("");
        setLoading(true);

        try {
            const { answer } = await queryDocument(selectedDocument.id, query);
            setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong";
            setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${message}` }]);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !loading) {
            handleQuery();
        }
    }

    if (!selectedDocument) {
        return (
            <div className="chat-field empty">
                <UploadIcon size={36} strokeWidth={2.0} className="empty-icon" />
                <p>select or upload a document to <strong>seek</strong>.</p>
            </div>
        );
    }

    return (
        <div className="chat-section">
            <h2>seek about: {selectedDocument.fileName}</h2>
            
            <div className="message-list">
                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.role}`}>
                        <span className="message-role">{msg.role === "user" ? "You" : "Answer"}</span>
                        <p>{msg.content}</p>
                    </div>
                ))}
                {loading && (
                    <div className="message assistant">
                        <span className="message-role">Answer</span>
                        <p className="thinking">seeking..</p>
                    </div>
                )}
            </div>

            <div className="chat-input-row">
                <input
                    type="text"
                    placeholder="Ask your query about this document.."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <button onClick={handleQuery} disabled={loading || !input.trim()}>
                    <ArrowUp size={18} strokeWidth={3.0} />
                </button>
            </div>
        </div>
    );
}