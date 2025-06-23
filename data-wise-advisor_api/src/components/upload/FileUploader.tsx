import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { geminiService } from "@/lib/gemini";

interface FileUploaderProps {
  compact?: boolean;
  onAnalysisComplete?: (analysis: string) => void;
  onFileUpload?: (file: File) => void;
}

const FileUploader = ({ compact = false, onAnalysisComplete, onFileUpload }: FileUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFileUpload(files);
    }
  };
  
  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Check file types and sizes
    const validFileTypes = ['text/csv', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json', 'text/plain'];
    const maxSizeMB = 50;
    
    const invalidFiles = files.filter(file => {
      return !validFileTypes.includes(file.type) || file.size > maxSizeMB * 1024 * 1024;
    });
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid files",
        description: `${invalidFiles.length} files were rejected due to invalid format or size exceeding ${maxSizeMB}MB`,
        variant: "destructive"
      });
      setIsUploading(false);
      return;
    }
    
    try {
      // Process each file with Gemini
      for (const file of files) {
        const analysis = await geminiService.analyzeFile(file);
        if (onAnalysisComplete) {
          onAnalysisComplete(analysis);
        }
        if (onFileUpload) {
          onFileUpload(file);
        }
      }
      
      toast({
        title: "Upload successful",
        description: `${files.length} file${files.length > 1 ? 's' : ''} uploaded and analyzed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const openFileBrowser = () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  };
  
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-lg flex flex-col items-center justify-center w-full transition-colors",
        isDragOver ? "border-bizoracle-blue bg-blue-50" : "border-gray-300",
        isUploading ? "opacity-70" : "opacity-100",
        compact ? "p-4" : "p-10"
      )}
    >
      <input 
        id="file-input" 
        type="file" 
        multiple 
        className="hidden" 
        onChange={handleFileInput} 
        accept=".csv,.pdf,.xlsx,.xls,.json,.txt"
      />
      
      <Upload className={cn(
        "text-gray-400",
        compact ? "h-10 w-10 mb-2" : "h-16 w-16 mb-4"
      )} />
      
      <div className="text-center">
        <p className={cn(
          "font-medium",
          compact ? "text-sm" : "text-base"
        )}>
          Drag files here or click to browse
        </p>
        <p className={cn(
          "text-muted-foreground",
          compact ? "text-xs mt-1" : "text-sm mt-2"
        )}>
          Supports CSV, PDF, XLSX, JSON, and TXT files (up to 50MB)
        </p>
      </div>
      
      {!compact && (
        <Button 
          onClick={openFileBrowser}
          disabled={isUploading} 
          className="mt-6"
        >
          {isUploading ? "Uploading..." : "Select Files"}
        </Button>
      )}
    </div>
  );
};

export default FileUploader;
