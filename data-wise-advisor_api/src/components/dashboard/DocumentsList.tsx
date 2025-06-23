import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/upload/FileUploader";

const DocumentsList = () => {
  const [folder, setFolder] = useState("default");
  const [folders, setFolders] = useState<string[]>(["default"]);
  const [uploadedDocs, setUploadedDocs] = useState<{ [folder: string]: string[] }>({ default: [] });

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolder(e.target.value);
  };

  const handleCreateFolder = () => {
    if (folder && !folders.includes(folder)) {
      setFolders([...folders, folder]);
      setUploadedDocs({ ...uploadedDocs, [folder]: [] });
    }
  };

  const handleUpload = (file: File) => {
    if (!folders.includes(folder)) {
      setFolders([...folders, folder]);
      setUploadedDocs({ ...uploadedDocs, [folder]: [file.name] });
    } else {
      setUploadedDocs({
        ...uploadedDocs,
        [folder]: [...(uploadedDocs[folder] || []), file.name],
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Uploaded Documents</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4 flex gap-2 items-center">
          <input
            type="text"
            value={folder}
            onChange={handleFolderChange}
            placeholder="Enter folder name"
            className="border px-2 py-1 rounded"
          />
          <Button onClick={handleCreateFolder} variant="outline" size="sm">
            Create Folder
          </Button>
        </div>
        <FileUploader onFileUpload={handleUpload} />
        <div className="mt-6">
          <h3 className="font-bold mb-2">Folders & Documents</h3>
          {folders.map((f) => (
            <div key={f} className="mb-2">
              <div className="font-semibold">{f}</div>
              <ul className="ml-4">
                {(uploadedDocs[f] || []).map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsList;
