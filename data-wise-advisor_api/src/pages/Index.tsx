import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";
import AiInsightCard from "@/components/dashboard/AiInsightCard";
import FileUploadCard from "@/components/dashboard/FileUploadCard";
import DocumentsList from "@/components/dashboard/DocumentsList";
import QuickActions from "@/components/dashboard/QuickActions";
import axios from "axios";

const TIME_RANGES = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Last year", value: "1y" },
  { label: "Custom", value: "custom" },
];

function getDateRange(range) {
  const today = new Date();
  let start, end;
  end = new Date(today);
  if (range === "7d") start = new Date(today.setDate(today.getDate() - 6));
  else if (range === "30d") start = new Date(today.setDate(today.getDate() - 29));
  else if (range === "90d") start = new Date(today.setDate(today.getDate() - 89));
  else if (range === "1y") start = new Date(today.setFullYear(today.getFullYear() - 1));
  else start = new Date(today);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    customers: 0,
    aov: 0,
    conversion: 0,
    orders: 0,
    returningCustomerRate: 0,
    grossSales: 0,
    netSales: 0,
    discounts: 0,
    returns: 0,
    shipping: 0,
    taxes: 0,
    fulfilledOrders: 0,
  });
  const [timeRange, setTimeRange] = useState("30d");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  const fetchShopifyStats = async (startDate, endDate) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/shopify/data", {
        params: { start_date: startDate, end_date: endDate },
      });
      const data = response.data.data;
      setStats({
        revenue: data.sales_summary.total_sales,
        customers: data.orders_summary.count,
        aov: data.average_order_value.value,
        conversion: data.conversion_rate.rate,
        orders: data.orders_summary.count,
        returningCustomerRate: data.customer_metrics.returning_customer_rate,
        grossSales: data.sales_summary.gross_sales,
        netSales: data.sales_summary.net_sales,
        discounts: data.sales_summary.discounts,
        returns: data.sales_summary.returns,
        shipping: data.sales_summary.shipping,
        taxes: data.sales_summary.taxes,
        fulfilledOrders: data.orders_summary.fulfilled,
      });
    } catch (err) {
      setStats({ revenue: 0, customers: 0, aov: 0, conversion: 0, orders: 0, returningCustomerRate: 0, grossSales: 0, netSales: 0, discounts: 0, returns: 0, shipping: 0, taxes: 0, fulfilledOrders: 0 });
    }
    setLoading(false);
  };

  useEffect(() => {
    let range = timeRange;
    let start, end;
    if (range === "custom" && customRange.start && customRange.end) {
      start = customRange.start;
      end = customRange.end;
    } else {
      const r = getDateRange(range);
      start = r.start;
      end = r.end;
    }
    fetchShopifyStats(start, end);
    // eslint-disable-next-line
  }, [timeRange, customRange]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">AI Business Oracle</h1>
          <p className="text-muted-foreground">Your intelligent business analysis assistant.</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGES.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {timeRange === "custom" && (
              <>
                <input
                  type="date"
                  value={customRange.start}
                  onChange={e => setCustomRange(r => ({ ...r, start: e.target.value }))}
                  className="border rounded px-2 py-1"
                />
                <span>to</span>
                <input
                  type="date"
                  value={customRange.end}
                  onChange={e => setCustomRange(r => ({ ...r, end: e.target.value }))}
                  className="border rounded px-2 py-1"
                />
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => fetchShopifyStats(getDateRange(timeRange).start, getDateRange(timeRange).end)}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-blue-600">{loading ? "..." : stats.orders}</div>
              <div className="text-sm text-blue-800">Orders</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-green-600">{loading ? "..." : stats.customers}</div>
              <div className="text-sm text-green-800">Customers</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-100">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-amber-600">{loading ? "..." : `$${stats.revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}</div>
              <div className="text-sm text-amber-800">Total Sales</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Gross Sales"
            value={loading ? "..." : `$${stats.grossSales.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            icon="$"
          />
          <StatCard
            title="Net Sales"
            value={loading ? "..." : `$${stats.netSales.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            icon="$"
          />
          <StatCard
            title="Discounts"
            value={loading ? "..." : `$${stats.discounts.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            icon="$"
          />
          <StatCard
            title="Returns"
            value={loading ? "..." : `$${stats.returns.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            icon="$"
          />
          <StatCard
            title="Shipping"
            value={loading ? "..." : `$${stats.shipping.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            icon="$"
          />
          <StatCard
            title="Taxes"
            value={loading ? "..." : `$${stats.taxes.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            icon="$"
          />
          <StatCard
            title="AOV"
            value={loading ? "..." : `$${stats.aov.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            icon="🛒"
          />
          <StatCard
            title="Returning Customer Rate"
            value={loading ? "..." : `${stats.returningCustomerRate.toFixed(2)}%`}
            icon="👥"
          />
          <StatCard
            title="Conversion Rate"
            value={loading ? "..." : `${(stats.conversion * 100).toFixed(2)}%`}
            icon="📈"
          />
          <StatCard
            title="Orders Fulfilled"
            value={loading ? "..." : stats.fulfilledOrders}
            icon="✔️"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <AiInsightCard />
          </div>
          <div className="lg:col-span-1">
            <FileUploadCard />
          </div>
        </div>
        <DocumentsList />
        <QuickActions />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
