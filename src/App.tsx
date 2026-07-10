import { useEffect, useState } from "react";
import type { Document } from "./types";
import { getDocuments } from "./api/documentAPI";
import Upload from "./components/Upload";
import Chat from "./components/Chat";

import "./App.css";
import { FileSearchCorner } from "lucide-react";

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    getDocuments()
    .then(setDocuments)
    .catch(() => setDocuments([]));
  }, []);

  function handleUpload(doc: Document) {
    setDocuments((prev) => [...prev, doc]);
    setSelectedId(doc.id);
  }

  function handleDelete(id: number) {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  }

  const selectedDocument = documents.find((d) => d.id === selectedId) ?? null;

  return (
    <div className="app-interface">
      <Upload
          documents={documents}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpload={handleUpload}
          onDelete={handleDelete}
        />
        <main className="app-main">
          <header className="app-header">
            <h1>
              <FileSearchCorner size={20} strokeWidth={2.2} className="title-icon" />
              seek
            </h1>
            <p>query your documents. seek your answers.</p>
          </header>      
          <Chat selectedDocument={selectedDocument} />
        </main>
    </div>
  );
}

export default App;