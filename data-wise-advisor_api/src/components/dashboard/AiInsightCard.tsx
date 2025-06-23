import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { geminiService } from "@/lib/gemini";

// This should be dynamically extracted from the dashboard in a real app
const DASHBOARD_METRICS_RAW = `
Revenue
$100,000
$
+5.2% vs. previous month
Customers
1,200
👥
+4.3% vs. previous month
Average Order Value
$83
🛒
+0.9% vs. previous month
Conversion Rate
2.5%
📈
+0.1% vs. previous month
`;

const AI_PROMPT_TEMPLATE = `You are an expert AI Business Analyst.

You are provided with key business metrics and their changes versus the previous month. Your goal is to:
- Give a very short, effective, and actionable summary for an executive.
- Only highlight the most important points and trends.
- Use clear headings (not markdown bold or asterisks), just plain text.
- Use this format:

Performance Snapshot:
- Revenue: ...
- Customers: ...
- AOV: ...
- Conversion Rate: ...

Insight:
<one or two sentences with the main story>

Recommendation:
<one or two specific next steps>

Here are the latest metrics:
{metrics}
`;

const AiInsightCard = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // In a real app, extract these from dashboard state/props
  const dashboardMetrics = DASHBOARD_METRICS_RAW;

  const handleQuickAnalysis = async () => {
    setLoading(true);
    setSummary(null);
    try {
      const prompt = AI_PROMPT_TEMPLATE.replace("{metrics}", dashboardMetrics);
      const aiResponse = await geminiService.sendMessage(prompt);
      setSummary(aiResponse);
    } catch (err) {
      setSummary("Sorry, I couldn't generate a summary at this time.");
    }
    setLoading(false);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-bizoracle-blue" /> AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4">
          <p className="text-sm">
            Click analyze to get AI insights about your:
          </p>
          <ul className="space-y-2">
            <li className="flex gap-2 items-start">
              <span className="bg-bizoracle-blue text-white rounded-full h-5 w-5 flex items-center justify-center shrink-0 text-xs">•</span>
              <span className="text-sm">Store data for the selected date range (MTD)</span>
            </li>
          </ul>
          <div className="flex gap-4 mt-6">
            <Button
              variant="default"
              size="sm"
              className="bg-bizoracle-blue hover:bg-bizoracle-blue/90"
              onClick={handleQuickAnalysis}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Quick Analysis"}
            </Button>
          </div>
          {summary && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded text-sm">
              <div className="mt-2 whitespace-pre-line">{summary}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AiInsightCard;
