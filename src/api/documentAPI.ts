const BASE_URL = "https://seek-backend-dcef.onrender.com/api/documents";

export async function uploadDocument(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload document");
    }
    
    return response.json();
}

export async function getDocuments() {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch documents");
    }

    return response.json();
}

export async function queryDocument(documentId: number, query: string) {
    const response = await fetch(`${BASE_URL}/${documentId}/query`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({query}),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error ?? "Failed to get an answer");
    }

    return response.json();
}

export async function deleteDocument(documentId: number) {
    const response = await fetch(`${BASE_URL}/${documentId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete document");
    }
}