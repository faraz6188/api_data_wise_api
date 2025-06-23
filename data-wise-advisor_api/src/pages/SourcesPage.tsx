import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploader from "@/components/upload/FileUploader";

const SourcesPage = () => {
  // State for API keys and modals
  const [shopifyKey, setShopifyKey] = useState(localStorage.getItem("shopify_api_key") || "");
  const [gaKey, setGaKey] = useState(localStorage.getItem("ga_api_key") || "");
  const [metaKey, setMetaKey] = useState(localStorage.getItem("meta_api_key") || "");
  const [klaviyoKey, setKlaviyoKey] = useState(localStorage.getItem("klaviyo_api_key") || "");
  const [modal, setModal] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [success, setSuccess] = useState("");

  const openModal = (type: string) => {
    setModal(type);
    setInput("");
    setSuccess("");
  };

  const handleSave = () => {
    if (modal === "shopify") {
      localStorage.setItem("shopify_api_key", input);
      setShopifyKey(input);
    } else if (modal === "ga") {
      localStorage.setItem("ga_api_key", input);
      setGaKey(input);
    } else if (modal === "meta") {
      localStorage.setItem("meta_api_key", input);
      setMetaKey(input);
    } else if (modal === "klaviyo") {
      localStorage.setItem("klaviyo_api_key", input);
      setKlaviyoKey(input);
    }
    setSuccess("API key saved and connected!");
    setTimeout(() => setModal(null), 1200);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Data Sources</h1>
          <p className="text-muted-foreground">
            Connect and manage your business data sources
          </p>
        </div>

        <Tabs defaultValue="data-sources">
          <TabsList>
            <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="ai-chat">AI Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data-sources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shopify</CardTitle>
                  <CardDescription>Ecommerce platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your Shopify store to sync products, orders, and customer data.
                  </p>
                  <Button className="w-full" variant={shopifyKey ? "secondary" : "default"} onClick={() => openModal("shopify")}>{shopifyKey ? "Connected (Update Key)" : "Connect Shopify"}</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Google Analytics</CardTitle>
                  <CardDescription>Web analytics platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Import your Google Analytics data to analyze traffic and conversion metrics.
                  </p>
                  <Button className="w-full" variant={gaKey ? "secondary" : "default"} onClick={() => openModal("ga")}>{gaKey ? "Connected (Update Key)" : "Connect Analytics"}</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Meta Ads</CardTitle>
                  <CardDescription>Social media advertising</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your Meta Ad accounts to analyze campaign performance.
                  </p>
                  <Button className="w-full" variant={metaKey ? "secondary" : "default"} onClick={() => openModal("meta")}>{metaKey ? "Connected (Update Key)" : "Connect Meta Ads"}</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Klaviyo</CardTitle>
                  <CardDescription>Email marketing platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect Klaviyo to analyze email campaign performance and customer segments.
                  </p>
                  <Button className="w-full" variant={klaviyoKey ? "secondary" : "default"} onClick={() => openModal("klaviyo")}>{klaviyoKey ? "Connected (Update Key)" : "Connect Klaviyo"}</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Upload Business Data</CardTitle>
                  <CardDescription>Upload documents, spreadsheets, PDFs, or data exports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-28">
                    <FileUploader compact={true} />
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-dashed">
                <CardHeader>
                  <CardTitle>Custom Integration</CardTitle>
                  <CardDescription>Connect a custom data source</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect to any other data source via API or file upload.
                  </p>
                  <Button variant="outline" className="w-full">Add Custom Source</Button>
                </CardContent>
              </Card>
            </div>
            {/* Modal for API key input */}
            {modal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                  <h2 className="text-lg font-bold mb-2">Enter API Key</h2>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="w-full border px-3 py-2 rounded mb-4"
                    placeholder="Paste your API key here"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">Save</Button>
                    <Button variant="outline" onClick={() => setModal(null)} className="flex-1">Cancel</Button>
                  </div>
                  {success && <div className="text-green-600 mt-3 text-center">{success}</div>}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium mb-2">Uploaded Documents</h3>
              <p className="text-muted-foreground mb-4">
                View and manage your uploaded business documents
              </p>
              <Button>Upload New Document</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="dashboard">
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium mb-2">Dashboard Data Sources</h3>
              <p className="text-muted-foreground mb-4">
                Manage data sources used in your dashboard
              </p>
              <Button>Configure Dashboard Sources</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="ai-chat">
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium mb-2">AI Chat Data Sources</h3>
              <p className="text-muted-foreground mb-4">
                Manage which data sources are used by the AI assistant
              </p>
              <Button>Configure AI Data Sources</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SourcesPage;
