import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, BarChart, Database } from "lucide-react";
import { geminiService } from "@/lib/gemini";

const AI_PROMPT_BASE = `You are an expert AI Business Analyst. When generating a report, use clear headings, subheadings, and tables. Do not use markdown bold (**), asterisks, or stars. Use plain text for all formatting. Keep the response concise, structured, and visually clear for business users.

If an API key is missing, clearly state which data is unavailable and what is used as a placeholder. Use only plain text headings and tables.`;

const QuickActions = () => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [resultTitle, setResultTitle] = useState<string>("");

  const shopifyKey = import.meta.env.VITE_SHOPIFY_API_KEY;
  const gaKey = import.meta.env.VITE_GA_API_KEY;

  const handleAction = async (type: string) => {
    setLoading(type);
    setResult(null);
    let prompt = AI_PROMPT_BASE;
    let title = "";
    if (type === "report") {
      prompt += `\n\nGenerate a concise monthly business report for the last 30 days using all available data. Focus on overall business health, key drivers, and actionable insights. Shopify API Key: ${shopifyKey || "[not set]"}`;
      title = "Monthly Business Report";
    } else if (type === "cohort") {
      prompt += `\n\nPerform a customer cohort analysis for the last 6 months. Identify cohort trends, retention, and actionable insights. Shopify API Key: ${shopifyKey || "[not set]"}`;
      title = "Customer Cohort Analysis";
    } else if (type === "product") {
      prompt += `\n\nAnalyze product performance trends for the last month. Highlight top and underperforming products, trends, and recommendations. Shopify API Key: ${shopifyKey || "[not set]"}`;
      title = "Product Performance Trends";
    } else if (type === "source") {
      prompt += `\n\nSuggest the best way to connect a new data source (e.g., Shopify, Google Analytics). List integration steps and benefits. Google Analytics API Key: ${gaKey || "[not set]"}`;
      title = "Connect New Data Source";
    }
    setResultTitle(title);
    try {
      const aiResponse = await geminiService.sendMessage(prompt);
      setResult(aiResponse);
    } catch (err) {
      setResult("Sorry, could not complete the action at this time.");
    }
    setLoading(null);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3" onClick={() => handleAction("report")} disabled={loading !== null}>
            <FileText className="h-6 w-6 text-bizoracle-blue" />
            <span>Generate monthly report</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3" onClick={() => handleAction("cohort")} disabled={loading !== null}>
            <Users className="h-6 w-6 text-bizoracle-green" />
            <span>Customer cohort analysis</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3" onClick={() => handleAction("product")} disabled={loading !== null}>
            <BarChart className="h-6 w-6 text-bizoracle-yellow" />
            <span>Product performance trends</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3" onClick={() => handleAction("source")} disabled={loading !== null}>
            <Database className="h-6 w-6 text-bizoracle-purple" />
            <span>Connect new data source</span>
          </Button>
        </div>
        {loading && (
          <div className="mt-6 text-center text-blue-600">Analyzing...</div>
        )}
        {result && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded text-base" style={{ fontFamily: 'Inter, Arial, sans-serif', lineHeight: 1.7, letterSpacing: 0.1, color: '#1a202c' }}>
            <div className="font-semibold text-lg mb-2 text-bizoracle-blue">{resultTitle}</div>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: 'none', fontFamily: 'inherit', fontSize: '1rem', margin: 0 }}>{result}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
