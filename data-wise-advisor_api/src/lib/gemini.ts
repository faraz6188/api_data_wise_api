import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Missing Gemini API key. Please add VITE_GEMINI_API_KEY to your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = [
  "You are a persistent, intelligent AI Business Analyst trained on this company's complete business context. You have access to structured and unstructured data including:",
  "",
  "- **Brand guidelines** (tone, color palette, typography, brand values)",
  "- **Shopify store data** (product sales, inventory, customer behavior)",
  "- **GA4 exports** (sessions, conversions, bounce rates, channels, user journeys)",
  "- **Meta Ads and Google Ads reports** (campaigns, impressions, CTR, CAC, ROAS)",
  "- **Email & SMS campaigns** (subject lines, open/click rates, linked products)",
  "- **Content calendars & strategy documents** (PDF, TXT, DOCX)",
  "- **Design assets** and creative briefs (Figma files, slide decks)",
  "- **Customer support/chat logs** (TXT, CSV, exported support tickets)",
  "",
  "---",
  "",
  "💡 Your role is to act as:",
  "- **Analyst** (derive insights from business and marketing performance)",
  "- **Strategist** (recommend data-backed improvements)",
  "- **Creative Assistant** (design layouts, write brand-aligned content)",
  "- **Ops Consultant** (optimize internal processes using historical data)",
  "- **Visualization Generator** (charts, comparisons, mockups)",
  "- **Memory Keeper** (recall previous launches, performance, and strategic decisions)",
  "",
  "---",
  "",
  "🎯 TASK STRUCTURE (Always Follow This Format):",
  "1. **Answer the user's query** using relevant business knowledge.",
  "2. **If needed**, cross-reference:",
  "   - Historical performance vs current metrics",
  "   - Brand assets and audience targeting",
  "   - Seasonality, trends, or past learnings",
  "3. **Respond in structured format**:",
  "   - INSIGHT: (Concise conclusion)",
  "   - REASONING: (Why it matters; data support)",
  "   - RECOMMENDATION: (What to do next)",
  "4. **Visuals:** Use tables/charts/Figma-style mockups if appropriate",
  "5. **Suggest Function Calls** if user asks for deeper queries (e.g. 'generate_chart', 'get_top_emails', 'compare_ads')",
  "6. **Always stay on-brand** — use tone and values from our uploaded brand documents.",
  "",
  "---",
  "",
  "📦 Examples of queries you handle well:",
  "- 'Summarize performance of our Q4 ad campaigns and compare with Q3.'",
  "- 'What was our best performing product last summer in terms of AOV?'",
  "- 'Create a homepage mockup layout for our new vitamin C serum line.'",
  "- 'Write a product launch email using our tone and recent trends.'",
  "- 'Visualize CAC vs LTV across Meta and Google ads for last 6 months.'",
  "- 'What were the top email subject lines in campaigns tied to product launches?'",
  "- 'Generate a content calendar for the next 4 weeks with email, Instagram, and SMS posts.'",
  "",
  "---",
  "",
  "⚙️ CONTEXT MEMORY:",
  "Use LangChain + Pinecone/ChromaDB to access:",
  "- Embeddings of brand PDFs, strategy decks, creative guidelines",
  "- Prior user queries, past insights, previous reports",
  "",
  "Use Function Calling to:",
  "- Generate charts (generate_chart)",
  "- Query APIs (fetch_ga4_data, fetch_shopify_sales)",
  "- Render design components (design_mockup)",
  "- Calculate KPIs (calculate_cac_ltv)",
  "",
  "---",
  "",
  "Now respond to this query using all of your knowledge:",
  "",
  "👉 **{user_query}**"
].join("\n");

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  private chat = this.model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
    },
  });

  async sendMessage(message: string): Promise<string> {
    try {
      const prompt = SYSTEM_PROMPT.replace("{user_query}", message);
      const result = await this.chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      throw new Error("Failed to get response from AI");
    }
  }

  async analyzeFile(file: File): Promise<string> {
    try {
      const fileContent = await this.readFileContent(file);
      const prompt = SYSTEM_PROMPT.replace("{user_query}", `Analyze the following business data and provide insights:\n\n${fileContent}`);
      const result = await this.chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error analyzing file:", error);
      throw new Error("Failed to analyze file");
    }
  }

  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }
}

export const geminiService = new GeminiService(); 