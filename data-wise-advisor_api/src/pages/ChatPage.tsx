
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/chat/ChatInterface";

const ChatPage = () => {
  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">AI Chat</h1>
          <p className="text-muted-foreground">
            Ask questions about your business data and get AI-powered insights.
          </p>
        </div>
        
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="flex-1">
            <ChatInterface />
          </TabsContent>
          
          <TabsContent value="data-sources">
            <div className="h-full flex items-center justify-center text-center p-12">
              <div>
                <h3 className="text-lg font-medium mb-2">Data Sources (5 connected)</h3>
                <p className="text-muted-foreground mb-4">
                  View or manage your connected data sources
                </p>
                <p className="text-sm text-muted-foreground">
                  Your questions will be answered using insights from connected data sources.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="h-full flex items-center justify-center text-center p-12">
              <div>
                <h3 className="text-lg font-medium mb-2">Uploaded Documents (3 files)</h3>
                <p className="text-muted-foreground mb-4">
                  View or manage your uploaded business documents
                </p>
                <p className="text-sm text-muted-foreground">
                  Your questions will be answered using insights from these documents.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="dashboard">
            <div className="h-full flex items-center justify-center text-center p-12">
              <div>
                <h3 className="text-lg font-medium mb-2">Dashboard Metrics</h3>
                <p className="text-muted-foreground mb-4">
                  Ask questions about your dashboard metrics
                </p>
                <p className="text-sm text-muted-foreground">
                  Your questions will be answered using insights from dashboard data.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ChatPage;
