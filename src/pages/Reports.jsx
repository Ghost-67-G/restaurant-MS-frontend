import { useMemo, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useReportsSummary } from "../hooks/useReports";

const toDateInput = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const currency = (value) => `$${Number(value || 0).toFixed(2)}`;

const buildCsvContent = (reportData) => {
  if (!reportData) return "";

  const lines = [];

  lines.push("Report Summary");
  lines.push(`Period From,${reportData.period.from}`);
  lines.push(`Period To,${reportData.period.to}`);
  lines.push("");

  lines.push("KPIs");
  lines.push("Metric,Value");
  lines.push(`Gross Sales,${Number(reportData.kpis.grossSales || 0).toFixed(2)}`);
  lines.push(`Net Sales,${Number(reportData.kpis.netSales || 0).toFixed(2)}`);
  lines.push(`Total Orders,${reportData.kpis.totalOrders || 0}`);
  lines.push(`Completed Orders,${reportData.kpis.completedOrders || 0}`);
  lines.push(`Cancelled Orders,${reportData.kpis.cancelledOrders || 0}`);
  lines.push(`Average Order Value,${Number(reportData.kpis.averageOrderValue || 0).toFixed(2)}`);
  lines.push(`Total Discount,${Number(reportData.kpis.totalDiscount || 0).toFixed(2)}`);
  lines.push(`Total Tax,${Number(reportData.kpis.totalTax || 0).toFixed(2)}`);
  lines.push(`Total Refunds,${Number(reportData.kpis.totalRefunds || 0).toFixed(2)}`);
  lines.push(`Total Voids,${Number(reportData.kpis.totalVoids || 0).toFixed(2)}`);
  lines.push("");

  lines.push("Daily Sales Trend");
  lines.push("Date,Orders,Sales");
  (reportData.breakdown.dailySales || []).forEach((row) => {
    lines.push(`${row.date},${row.orders},${Number(row.sales || 0).toFixed(2)}`);
  });
  lines.push("");

  lines.push("Top Selling Items");
  lines.push("Item,Quantity Sold,Sales");
  (reportData.breakdown.topSellingItems || []).forEach((row) => {
    const escapedName = String(row.name || "").replace(/,/g, " ");
    lines.push(`${escapedName},${row.quantitySold},${Number(row.sales || 0).toFixed(2)}`);
  });

  return lines.join("\n");
};

export default function Reports() {
  const today = useMemo(() => toDateInput(new Date()), []);

  const [filters, setFilters] = useState({
    from: today,
    to: today,
    orderType: "",
    includeCancelled: false,
    includeRefunded: true,
  });

  const { data, isLoading, isError, refetch, isFetching } = useReportsSummary({
    from: filters.from,
    to: filters.to,
    ...(filters.orderType ? { orderType: filters.orderType } : {}),
    includeCancelled: filters.includeCancelled,
    includeRefunded: filters.includeRefunded,
  });

  const kpis = data?.kpis || {};
  const dailySales = data?.breakdown?.dailySales || [];
  const topItems = data?.breakdown?.topSellingItems || [];

  const maxDailySales = dailySales.reduce((max, entry) => Math.max(max, Number(entry.sales || 0)), 0);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExportCsv = () => {
    if (!data) return;

    const csv = buildCsvContent(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const from = filters.from || "start";
    const to = filters.to || "end";
    link.href = url;
    link.setAttribute("download", `reports_${from}_to_${to}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
          <p className="text-slate-600 mt-1">Sales and performance summary for your selected period.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">From</label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => updateFilter("from", e.target.value)}
                className="w-full h-10 px-3 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">To</label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => updateFilter("to", e.target.value)}
                className="w-full h-10 px-3 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Order Type</label>
              <select
                value={filters.orderType}
                onChange={(e) => updateFilter("orderType", e.target.value)}
                className="w-full h-10 px-3 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All</option>
                <option value="dine-in">Dine In</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={filters.includeCancelled}
                  onChange={(e) => updateFilter("includeCancelled", e.target.checked)}
                />
                Include Cancelled
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={filters.includeRefunded}
                  onChange={(e) => updateFilter("includeRefunded", e.target.checked)}
                />
                Include Refunded
              </label>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="h-10 px-4 rounded bg-orange-500 hover:bg-orange-600 text-white font-medium"
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={!data}
              className="inline-flex items-center gap-2 h-9 px-3 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="h-72 flex items-center justify-center bg-white border border-slate-200 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">Failed to load reports.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase">Gross Sales</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{currency(kpis.grossSales)}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase">Net Sales</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{currency(kpis.netSales)}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase">Total Orders</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{kpis.totalOrders || 0}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase">Avg Order Value</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{currency(kpis.averageOrderValue)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Adjustments Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-600">Refunds</span><span className="font-semibold text-red-600">{currency(kpis.totalRefunds)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Voids</span><span className="font-semibold text-red-600">{currency(kpis.totalVoids)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Discount</span><span className="font-semibold text-slate-900">{currency(kpis.totalDiscount)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Tax Collected</span><span className="font-semibold text-slate-900">{currency(kpis.totalTax)}</span></div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Order Status Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-600">Completed</span><span className="font-semibold">{kpis.completedOrders || 0}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Cancelled</span><span className="font-semibold">{kpis.cancelledOrders || 0}</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Order Type Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-200">
                      <th className="py-2 pr-3">Order Type</th>
                      <th className="py-2 pr-3">Orders</th>
                      <th className="py-2 pr-3">Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.breakdown?.orderTypes || []).length === 0 ? (
                      <tr>
                        <td className="py-3 text-slate-500" colSpan={3}>No data for selected filters.</td>
                      </tr>
                    ) : (
                      data.breakdown.orderTypes.map((row) => (
                        <tr key={row.orderType} className="border-b border-slate-100">
                          <td className="py-2 pr-3 capitalize">{row.orderType}</td>
                          <td className="py-2 pr-3">{row.orders}</td>
                          <td className="py-2 pr-3">{currency(row.sales)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Sales Trend</h3>
              {dailySales.length === 0 ? (
                <p className="text-sm text-slate-500">No trend data for selected filters.</p>
              ) : (
                <div className="space-y-3">
                  {dailySales.map((row) => {
                    const widthPct = maxDailySales > 0 ? (Number(row.sales || 0) / maxDailySales) * 100 : 0;
                    return (
                      <div key={row.date}>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>{row.date}</span>
                          <span>{currency(row.sales)} ({row.orders} orders)</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded">
                          <div
                            className="h-2 bg-orange-500 rounded"
                            style={{ width: `${Math.max(widthPct, 2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Top Selling Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-200">
                      <th className="py-2 pr-3">Item</th>
                      <th className="py-2 pr-3">Qty Sold</th>
                      <th className="py-2 pr-3">Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topItems.length === 0 ? (
                      <tr>
                        <td className="py-3 text-slate-500" colSpan={3}>No top items for selected filters.</td>
                      </tr>
                    ) : (
                      topItems.map((item) => (
                        <tr key={`${item.menuItemId || item.name}`} className="border-b border-slate-100">
                          <td className="py-2 pr-3">{item.name}</td>
                          <td className="py-2 pr-3">{item.quantitySold}</td>
                          <td className="py-2 pr-3">{currency(item.sales)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
