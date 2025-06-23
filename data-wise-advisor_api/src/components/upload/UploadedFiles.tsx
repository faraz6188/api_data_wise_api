
import React from "react";
import { FileText } from "lucide-react";

const UploadedFiles = () => {
  // For the demo, we'll show a placeholder for no files
  return (
    <div className="bg-card border rounded-lg">
      <div className="p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">No documents uploaded yet</h3>
        <p className="text-muted-foreground">
          Upload business documents to analyze with AI
        </p>
      </div>
    </div>
  );
};

export default UploadedFiles;
