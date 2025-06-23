import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
// import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  // API key states
  const [openaiKey, setOpenaiKey] = useState(localStorage.getItem("openai_api_key") || "");
  const [shopifyKey, setShopifyKey] = useState(localStorage.getItem("shopify_api_key") || "");
  const [googleKey, setGoogleKey] = useState(localStorage.getItem("google_api_key") || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  // const { toast } = useToast();

  const handleSaveApiKeys = () => {
    setSaving(true);
    localStorage.setItem("openai_api_key", openaiKey);
    localStorage.setItem("shopify_api_key", shopifyKey);
    localStorage.setItem("google_api_key", googleKey);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      // toast({ title: "API Keys Saved", description: "Your API keys have been saved successfully." });
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>

        <Tabs defaultValue="account">
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4 max-w-2xl mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your account information and email address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Acme Inc." />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Update your password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="api-keys" className="space-y-4 max-w-2xl mt-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for external connections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai">OpenAI API Key</Label>
                  <Input
                    id="openai"
                    type="password"
                    placeholder="sk-..."
                    value={openaiKey}
                    onChange={e => setOpenaiKey(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Required for AI-powered analysis and chat features
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopify">Shopify API Key</Label>
                  <Input
                    id="shopify"
                    placeholder="Optional"
                    value={shopifyKey}
                    onChange={e => setShopifyKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="google">Google Analytics API Key</Label>
                  <Input
                    id="google"
                    placeholder="Optional"
                    value={googleKey}
                    onChange={e => setGoogleKey(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveApiKeys} disabled={saving}>
                  {saving ? "Saving..." : "Save API Keys"}
                </Button>
                {saved && <span className="text-green-600 ml-4">Saved!</span>}
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="max-w-2xl mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch id="email-notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly business performance reports
                    </p>
                  </div>
                  <Switch id="weekly-reports" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Import Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new data is imported
                    </p>
                  </div>
                  <Switch id="import-alerts" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="max-w-2xl mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
                <CardDescription>
                  Customize how the application works
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme for the interface
                    </p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-refresh Dashboard</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically refresh dashboard data every hour
                    </p>
                  </div>
                  <Switch id="auto-refresh" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable AI Suggestions</p>
                    <p className="text-sm text-muted-foreground">
                      Show AI-generated suggestions and insights
                    </p>
                  </div>
                  <Switch id="ai-suggestions" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
