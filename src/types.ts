export interface Document {
    id: number;
    fileName: string;
    uploadTime: string;
}

export interface QueryResponse {
    answer: string;
}

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}