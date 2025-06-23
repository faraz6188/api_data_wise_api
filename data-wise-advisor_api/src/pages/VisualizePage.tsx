import React, { useState, useEffect, useCallback, useRef } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { geminiService } from "@/lib/gemini";
import { jsPDF } from "jspdf";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Download, RefreshCw } from "lucide-react";
import html2canvas from "html2canvas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import axios from "axios";

// Predefined prompts for different types of reports and insights
const REPORT_PROMPTS = {
  monthly: `As a business analyst, generate a comprehensive monthly business report. Follow these formatting rules strictly:
- Use plain text headings with proper capitalization (e.g., "Executive Summary", "Key Performance Indicators")
- Do NOT use markdown bold (**) or asterisks (*)
- Use clear section breaks with numbered lists
- Use proper indentation for sub-sections
- Use tables where appropriate with clear column headers

Include the following sections:

1. Executive Summary
   - Overall performance overview
   - Key highlights and challenges
   - Month-over-month and year-over-year comparisons

2. Key Performance Indicators
   - Revenue metrics (total revenue, growth rate)
   - Customer metrics (acquisition, retention)
   - Product performance (top sellers, categories)

3. Trend Analysis
   - Month-over-month comparisons
   - Year-over-year comparisons
   - Seasonal patterns

4. Actionable Recommendations
   - Priority actions
   - Implementation steps
   - Expected outcomes

Format all numbers with proper currency symbols and percentages. Use clear, business-friendly language.`,
  
  quarterly: `As a business analyst, create a detailed quarterly business report. Follow these formatting rules strictly:
- Use plain text headings with proper capitalization
- Do NOT use markdown bold (**) or asterisks (*)
- Use clear section breaks with numbered lists
- Use proper indentation for sub-sections
- Use tables where appropriate

Include the following sections:

1. Quarterly Performance Overview
   - Financial highlights
   - Operational achievements
   - Market position

2. Financial Analysis
   - Revenue breakdown by category
   - Cost analysis and margins
   - Profitability metrics

3. Market Position
   - Competitive analysis
   - Market share trends
   - Industry benchmarks

4. Strategic Recommendations
   - Growth opportunities
   - Risk mitigation
   - Resource allocation

Use clear, professional language and proper formatting for all metrics and numbers.`,
  
  custom: `Generate a custom business report following these formatting rules strictly:
- Use plain text headings with proper capitalization
- Do NOT use markdown bold (**) or asterisks (*)
- Use clear section breaks with numbered lists
- Use proper indentation for sub-sections
- Use tables where appropriate

Include the following sections:

1. Business Performance Metrics
   - Key performance indicators
   - Growth metrics
   - Efficiency measures

2. Operational Efficiency
   - Process improvements
   - Resource utilization
   - Cost optimization

3. Customer Insights
   - Behavior patterns
   - Satisfaction metrics
   - Engagement levels

4. Growth Opportunities
   - Market potential
   - Innovation areas
   - Strategic initiatives

Present all data in a clear, structured format suitable for business stakeholders.`
};

const INSIGHT_PROMPTS = {
  performance: `Analyze the business performance data following these formatting rules strictly:
- Use plain text headings with proper capitalization
- Do NOT use markdown bold (**) or asterisks (*)
- Use clear section breaks with numbered lists
- Use proper indentation for sub-sections
- Use tables where appropriate

Provide insights in these areas:

1. Key Performance Trends
   - Revenue growth patterns
   - Customer behavior changes
   - Operational efficiency

2. Growth Opportunities
   - Market expansion potential
   - Product development areas
   - Customer acquisition channels

3. Risk Factors
   - Market risks
   - Operational challenges
   - Competitive threats

4. Strategic Recommendations
   - Priority actions
   - Implementation timeline
   - Success metrics

Use clear, actionable language and proper formatting for all metrics.`,
  
  customer: `Generate customer-focused insights following these formatting rules strictly:
- Use plain text headings with proper capitalization
- Do NOT use markdown bold (**) or asterisks (*)
- Use clear section breaks with numbered lists
- Use proper indentation for sub-sections
- Use tables where appropriate

Include these sections:

1. Customer Behavior Patterns
   - Purchase frequency
   - Product preferences
   - Channel usage

2. Segmentation Analysis
   - Customer segments
   - Segment performance
   - Growth opportunities

3. Retention Opportunities
   - Churn risk factors
   - Loyalty drivers
   - Engagement strategies

4. Customer Experience Improvements
   - Pain points
   - Satisfaction drivers
   - Service enhancements

Present insights in a clear, structured format with actionable recommendations.`,
  
  market: `Provide market analysis insights following these formatting rules strictly:
- Use plain text headings with proper capitalization
- Do NOT use markdown bold (**) or asterisks (*)
- Use clear section breaks with numbered lists
- Use proper indentation for sub-sections
- Use tables where appropriate

Cover these areas:

1. Market Trends
   - Industry developments
   - Consumer behavior shifts
   - Technology impacts

2. Competitive Position
   - Market share analysis
   - Competitor strategies
   - Unique advantages

3. Growth Opportunities
   - Market gaps
   - Emerging segments
   - Innovation potential

4. Strategic Recommendations
   - Market entry strategies
   - Competitive responses
   - Resource allocation

Use clear, professional language and proper formatting for all analysis.`
};

// Chart color schemes
const CHART_COLORS = {
  primary: "#2563eb", // blue-600
  secondary: "#7c3aed", // violet-600
  success: "#16a34a", // green-600
  warning: "#d97706", // amber-600
  danger: "#dc2626", // red-600
  gray: "#6b7280", // gray-500
};

// Add explicit types
interface RevenueMonth {
  revenue: number;
  profit: number;
  expenses: number;
}
interface CustomerMonth {
  newCustomers: number;
  returningCustomers: number;
  totalCustomers: number;
}
interface CategoryData {
  category: string;
  revenue: number;
  percentage: number;
}

// Sample data types (replace with actual API data)
interface RevenueData {
  date: string;
  revenue: number;
  profit: number;
  expenses: number;
}

interface CustomerData {
  date: string;
  newCustomers: number;
  returningCustomers: number;
  totalCustomers: number;
}

interface ProductCategoryData {
  category: string;
  revenue: number;
  percentage: number;
}

interface FunnelData {
  stage: string;
  value: number;
  percentage: number;
}

const VisualizePage = () => {
  const { toast } = useToast();
  const [report, setReport] = useState<string | null>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [reportType, setReportType] = useState<keyof typeof REPORT_PROMPTS>("monthly");
  const [insightType, setInsightType] = useState<keyof typeof INSIGHT_PROMPTS>("performance");
  const [timeRange, setTimeRange] = useState("month");
  const [metric, setMetric] = useState("revenue");
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [categoryData, setCategoryData] = useState<ProductCategoryData[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartRefs] = useState({
    revenue: React.createRef<HTMLDivElement>(),
    customer: React.createRef<HTMLDivElement>(),
    category: React.createRef<HTMLDivElement>(),
    funnel: React.createRef<HTMLDivElement>(),
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Fetch Shopify data from backend
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (isRefreshing && !forceRefresh) return;
    setIsRefreshing(true);
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/shopify/data");
      if (response.data.error) {
        toast({
          title: "Shopify Data Error",
          description: response.data.error,
          variant: "destructive",
        });
        setLoading(false);
        setIsRefreshing(false);
        return;
      }
      const data = response.data.data;
      const orders = Array.isArray(data?.raw_data?.orders) ? data.raw_data.orders : [];
      const products = Array.isArray(data?.raw_data?.products) ? data.raw_data.products : [];
      const customers = Array.isArray(data?.raw_data?.customers) ? data.raw_data.customers : [];

      // Revenue Data (by month)
      const revenueByMonth: Record<string, RevenueMonth> = {};
      orders.forEach(order => {
        if (!order.created_at || !order.total_price) return;
        const date = new Date(order.created_at);
        const month = date.toLocaleString('default', { month: 'short' });
        if (!revenueByMonth[month]) revenueByMonth[month] = { revenue: 0, profit: 0, expenses: 0 };
        revenueByMonth[month].revenue += parseFloat(order.total_price);
        revenueByMonth[month].profit += parseFloat(order.total_price) * 0.5;
        revenueByMonth[month].expenses += parseFloat(order.total_price) * 0.5;
      });
      const revenueDataArr = Object.entries(revenueByMonth).map(([month, vals]) => ({
        date: month,
        revenue: vals.revenue,
        profit: vals.profit,
        expenses: vals.expenses,
      }));
      setRevenueData(revenueDataArr);

      // Customer Data (by month)
      const customerByMonth: Record<string, CustomerMonth> = {};
      customers.forEach(customer => {
        if (!customer.created_at) return;
        const date = new Date(customer.created_at);
        const month = date.toLocaleString('default', { month: 'short' });
        if (!customerByMonth[month]) customerByMonth[month] = { newCustomers: 0, returningCustomers: 0, totalCustomers: 0 };
        customerByMonth[month].newCustomers += 1;
        customerByMonth[month].totalCustomers += 1;
      });
      Object.values(customerByMonth).forEach((val) => {
        val.returningCustomers = Math.round(val.newCustomers * 0.4);
      });
      const customerDataArr = Object.entries(customerByMonth).map(([month, vals]) => ({
        date: month,
        newCustomers: vals.newCustomers,
        returningCustomers: vals.returningCustomers,
        totalCustomers: vals.totalCustomers,
      }));
      setCustomerData(customerDataArr);

      // Category Data (by product type)
      const categoryMap: Record<string, number> = {};
      products.forEach(product => {
        const category = product.product_type || "Other";
        if (!categoryMap[category]) categoryMap[category] = 0;
        orders.forEach(order => {
          if (order.line_items) {
            order.line_items.forEach(item => {
              if (item.product_id === product.id) {
                categoryMap[category] += parseFloat(item.price) * item.quantity;
              }
            });
          }
        });
      });
      const totalCategoryRevenue = Object.values(categoryMap).reduce((a, b) => a + b, 0);
      const categoryDataArr: CategoryData[] = Object.entries(categoryMap).map(([category, revenue]) => ({
        category,
        revenue,
        percentage: totalCategoryRevenue ? Math.round((revenue / totalCategoryRevenue) * 100) : 0,
      }));
      setCategoryData(categoryDataArr);

      // Funnel Data (simulate based on orders)
      const totalOrders = orders.length;
      const funnelDataArr = [
        { stage: "Visitors", value: totalOrders * 5, percentage: 100 },
        { stage: "Add to Cart", value: Math.round(totalOrders * 2.5), percentage: 50 },
        { stage: "Checkout", value: Math.round(totalOrders * 1.25), percentage: 25 },
        { stage: "Purchase", value: totalOrders, percentage: 20 },
      ];
      setFunnelData(funnelDataArr);

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching Shopify data:", error);
      toast({
        title: "Shopify Data Error",
        description: "Failed to fetch Shopify data. Please check your API key and store domain.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, [isRefreshing, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    setReport(null);
    try {
      const prompt = REPORT_PROMPTS[reportType];
      const aiResponse = await geminiService.sendMessage(prompt);
      setReport(aiResponse);
    } catch (err) {
      console.error("Error generating report:", err);
      setReport("Sorry, could not generate the report at this time. Please check your API configuration and try again.");
    }
    setLoadingReport(false);
  };

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    setInsight(null);
    try {
      const prompt = INSIGHT_PROMPTS[insightType];
      const aiResponse = await geminiService.sendMessage(prompt);
      setInsight(aiResponse);
    } catch (err) {
      console.error("Error generating insights:", err);
      setInsight("Sorry, could not generate insights at this time. Please check your API configuration and try again.");
    }
    setLoadingInsight(false);
  };

  const handleDownloadPDF = (content: string, title: string) => {
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.text(title, 10, 15);
      doc.setFontSize(11);
      
      // Split content into lines and add to PDF
      const lines = content.split('\n');
      let yPosition = 25;
      
      lines.forEach(line => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 15;
        }
        doc.text(line, 10, yPosition, { maxWidth: 190 });
        yPosition += 7;
      });
      
      doc.save(`${title.replace(/\s+/g, "_").toLowerCase()}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Function to export charts as images
  const exportCharts = async () => {
    try {
      const charts = Object.entries(chartRefs).map(([key, ref]) => ref.current);
      const canvas = await html2canvas(document.body, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      // Add the image to the PDF
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Save the PDF
      pdf.save(`business-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error exporting charts:", error);
      toast({
        title: "Export Error",
        description: "Failed to export charts. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to refresh all charts
  const refreshCharts = () => {
    fetchData(true);
    toast({
      title: "Refreshing Charts",
      description: "Updating all charts with latest data...",
    });
  };

  // Print handler for modal preview
  const handlePrintPreview = () => {
    if (previewRef.current) {
      const printContents = previewRef.current.innerHTML;
      const printWindow = window.open('', '', 'height=800,width=1200');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Charts Preview</title>');
        printWindow.document.write('<style>body{font-family:Inter,Arial,sans-serif;}@media print{.no-print{display:none;}}</style>');
        printWindow.document.write('</head><body >');
        printWindow.document.write(printContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Data Visualization</h1>
          <p className="text-muted-foreground">
            Create and view charts and insights from your business data
          </p>
        </div>

        <div className="flex justify-between items-center">
          <Tabs defaultValue="charts" className="w-full">
            <TabsList>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="charts" className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Select value={metric} onValueChange={setMetric}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="customers">Customers</SelectItem>
                      <SelectItem value="orders">Orders</SelectItem>
                      <SelectItem value="aov">Avg Order Value</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last Quarter</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="text-sm text-muted-foreground">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    onClick={refreshCharts}
                    disabled={isRefreshing}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh Charts'}
                  </Button>
                </div>
              </div>
              
              <div ref={previewRef} id="charts-preview">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Revenue Overview</CardTitle>
                      <CardDescription>Monthly revenue, expenses and profit</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div ref={chartRefs.revenue}>
                        {loading ? (
                          <div className="h-72 flex items-center justify-center">
                            <p className="text-muted-foreground">Loading data...</p>
                          </div>
                        ) : (
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area
                                  type="monotone"
                                  dataKey="revenue"
                                  stroke={CHART_COLORS.primary}
                                  fill={CHART_COLORS.primary}
                                  fillOpacity={0.2}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="profit"
                                  stroke={CHART_COLORS.success}
                                  fill={CHART_COLORS.success}
                                  fillOpacity={0.2}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="expenses"
                                  stroke={CHART_COLORS.danger}
                                  fill={CHART_COLORS.danger}
                                  fillOpacity={0.2}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Customer Growth</CardTitle>
                      <CardDescription>New vs returning customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div ref={chartRefs.customer}>
                        {loading ? (
                          <div className="h-72 flex items-center justify-center">
                            <p className="text-muted-foreground">Loading data...</p>
                          </div>
                        ) : (
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={customerData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="newCustomers"
                                  stroke={CHART_COLORS.primary}
                                  strokeWidth={2}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="returningCustomers"
                                  stroke={CHART_COLORS.secondary}
                                  strokeWidth={2}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="totalCustomers"
                                  stroke={CHART_COLORS.success}
                                  strokeWidth={2}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Sales by Product Category</CardTitle>
                      <CardDescription>Revenue distribution across product lines</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div ref={chartRefs.category}>
                        {loading ? (
                          <div className="h-72 flex items-center justify-center">
                            <p className="text-muted-foreground">Loading data...</p>
                          </div>
                        ) : (
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={categoryData}
                                  dataKey="revenue"
                                  nameKey="category"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                  {categoryData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={Object.values(CHART_COLORS)[index % Object.keys(CHART_COLORS).length]}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Conversion Funnel</CardTitle>
                      <CardDescription>Customer journey and conversion rates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div ref={chartRefs.funnel}>
                        {loading ? (
                          <div className="h-72 flex items-center justify-center">
                            <p className="text-muted-foreground">Loading data...</p>
                          </div>
                        ) : (
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={funnelData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="stage" type="category" />
                                <Tooltip />
                                <Legend />
                                <Bar
                                  dataKey="value"
                                  fill={CHART_COLORS.primary}
                                  label={{ position: 'right' }}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reports">
              <div className="p-12 text-center">
                <h3 className="text-lg font-medium mb-2">Reports</h3>
                <p className="text-muted-foreground mb-4">
                  Generate a business report using AI
                </p>
                <div className="flex gap-4 justify-center mb-4">
                  <Select value={reportType} onValueChange={(value: keyof typeof REPORT_PROMPTS) => setReportType(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly Report</SelectItem>
                      <SelectItem value="quarterly">Quarterly Report</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleGenerateReport} disabled={loadingReport}>
                    {loadingReport ? "Generating..." : "Generate Report"}
                  </Button>
                </div>
                {report && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded text-base text-left" style={{ fontFamily: 'Inter, Arial, sans-serif', lineHeight: 1.7, letterSpacing: 0.1, color: '#1a202c' }}>
                    <div className="font-semibold text-lg mb-2 text-bizoracle-blue">AI Business Report</div>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: 'none', fontFamily: 'inherit', fontSize: '1rem', margin: 0 }}>{report}</pre>
                    <Button className="mt-4" variant="outline" onClick={() => handleDownloadPDF(report, "AI Business Report")}>Download as PDF</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="insights">
              <div className="p-12 text-center">
                <h3 className="text-lg font-medium mb-2">AI Insights</h3>
                <p className="text-muted-foreground mb-4">
                  Get automatic insights from your business data
                </p>
                <div className="flex gap-4 justify-center mb-4">
                  <Select value={insightType} onValueChange={(value: keyof typeof INSIGHT_PROMPTS) => setInsightType(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select insight type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance Insights</SelectItem>
                      <SelectItem value="customer">Customer Insights</SelectItem>
                      <SelectItem value="market">Market Insights</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleGenerateInsight} disabled={loadingInsight}>
                    {loadingInsight ? "Generating..." : "Generate Insights"}
                  </Button>
                </div>
                {insight && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded text-base text-left" style={{ fontFamily: 'Inter, Arial, sans-serif', lineHeight: 1.7, letterSpacing: 0.1, color: '#1a202c' }}>
                    <div className="font-semibold text-lg mb-2 text-bizoracle-blue">AI Insights</div>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: 'none', fontFamily: 'inherit', fontSize: '1rem', margin: 0 }}>{insight}</pre>
                    <Button className="mt-4" variant="outline" onClick={() => handleDownloadPDF(insight, "AI Insights")}>Download as PDF</Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Charts Export Preview</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[60vh] border rounded p-4 bg-white">
            <div>{/* Render the same charts as in the main view for preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue, expenses and profit</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div ref={chartRefs.revenue}>
                      {loading ? (
                        <div className="h-72 flex items-center justify-center">
                          <p className="text-muted-foreground">Loading data...</p>
                        </div>
                      ) : (
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke={CHART_COLORS.primary}
                                fill={CHART_COLORS.primary}
                                fillOpacity={0.2}
                              />
                              <Area
                                type="monotone"
                                dataKey="profit"
                                stroke={CHART_COLORS.success}
                                fill={CHART_COLORS.success}
                                fillOpacity={0.2}
                              />
                              <Area
                                type="monotone"
                                dataKey="expenses"
                                stroke={CHART_COLORS.danger}
                                fill={CHART_COLORS.danger}
                                fillOpacity={0.2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Customer Growth</CardTitle>
                    <CardDescription>New vs returning customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div ref={chartRefs.customer}>
                      {loading ? (
                        <div className="h-72 flex items-center justify-center">
                          <p className="text-muted-foreground">Loading data...</p>
                        </div>
                      ) : (
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={customerData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="newCustomers"
                                stroke={CHART_COLORS.primary}
                                strokeWidth={2}
                              />
                              <Line
                                type="monotone"
                                dataKey="returningCustomers"
                                stroke={CHART_COLORS.secondary}
                                strokeWidth={2}
                              />
                              <Line
                                type="monotone"
                                dataKey="totalCustomers"
                                stroke={CHART_COLORS.success}
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Sales by Product Category</CardTitle>
                    <CardDescription>Revenue distribution across product lines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div ref={chartRefs.category}>
                      {loading ? (
                        <div className="h-72 flex items-center justify-center">
                          <p className="text-muted-foreground">Loading data...</p>
                        </div>
                      ) : (
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryData}
                                dataKey="revenue"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                              >
                                {categoryData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={Object.values(CHART_COLORS)[index % Object.keys(CHART_COLORS).length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Conversion Funnel</CardTitle>
                    <CardDescription>Customer journey and conversion rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div ref={chartRefs.funnel}>
                      {loading ? (
                        <div className="h-72 flex items-center justify-center">
                          <p className="text-muted-foreground">Loading data...</p>
                        </div>
                      ) : (
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis dataKey="stage" type="category" />
                              <Tooltip />
                              <Legend />
                              <Bar
                                dataKey="value"
                                fill={CHART_COLORS.primary}
                                label={{ position: 'right' }}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handlePrintPreview}>Print</Button>
            <Button variant="outline" onClick={() => setShowExportModal(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default VisualizePage;
