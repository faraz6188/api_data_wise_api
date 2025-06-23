
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import FileUploader from "@/components/upload/FileUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadedFiles from "@/components/upload/UploadedFiles";
import { Card } from "@/components/ui/card";

const UploadPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Upload Business Data</h1>
          <p className="text-muted-foreground">
            Upload documents, spreadsheets, PDFs, or data exports for AI analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <FileUploader />
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">How it works</h2>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <div className="bg-bizoracle-blue text-white rounded-full h-6 w-6 flex items-center justify-center shrink-0">1</div>
                <div>
                  <p className="font-medium">Upload your business files</p>
                  <p className="text-sm text-muted-foreground">
                    Supported file formats: CSV, PDF, XLSX, JSON, and TXT (up to 50MB)
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="bg-bizoracle-blue text-white rounded-full h-6 w-6 flex items-center justify-center shrink-0">2</div>
                <div>
                  <p className="font-medium">AI processes your documents</p>
                  <p className="text-sm text-muted-foreground">
                    Our AI system reads, analyzes, and indexes your data for instant insights
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="bg-bizoracle-blue text-white rounded-full h-6 w-6 flex items-center justify-center shrink-0">3</div>
                <div>
                  <p className="font-medium">Ask questions about your data</p>
                  <p className="text-sm text-muted-foreground">
                    Use the AI Chat to ask specific questions and get data-driven answers
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="bg-bizoracle-blue text-white rounded-full h-6 w-6 flex items-center justify-center shrink-0">4</div>
                <div>
                  <p className="font-medium">Generate insights and visualizations</p>
                  <p className="text-sm text-muted-foreground">
                    Create charts, reports, and strategic recommendations based on your data
                  </p>
                </div>
              </li>
            </ol>
          </Card>
        </div>

        <Tabs defaultValue="files">
          <TabsList>
            <TabsTrigger value="files">Uploaded Files</TabsTrigger>
            <TabsTrigger value="recent">Recently Analyzed</TabsTrigger>
          </TabsList>
          <TabsContent value="files">
            <UploadedFiles />
          </TabsContent>
          <TabsContent value="recent">
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium mb-2">No recent analysis</h3>
              <p className="text-muted-foreground">
                Upload a file and ask questions to see analysis history
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default UploadPage;
