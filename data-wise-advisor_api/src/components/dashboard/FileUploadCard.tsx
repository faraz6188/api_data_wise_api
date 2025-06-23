
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FileUploadCard = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/upload");
  };
  
  return (
    <Card className="h-full cursor-pointer hover:border-blue-300 transition-colors" onClick={handleClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Upload Business Data</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center pb-6 pt-4">
        <div className="w-full h-32 rounded-md border-2 border-dashed flex flex-col items-center justify-center p-4">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports CSV, PDF, XLSX, JSON, and TXT files (up to 50MB)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadCard;
