import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Download, Filter, Search } from "lucide-react";
import Skeleton from "react-loading-skeleton";

export default function ReportsView() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

 useEffect(() => {
   const fetchReports = async () => {
     try {
       setLoading(true);

       // Fetch all users
       const usersSnap = await getDocs(collection(db, "users"));

       const usersMap = {};

       usersSnap.forEach((doc) => {
         usersMap[doc.id] = doc.data();
       });

       // Fetch all pickups
       const pickupSnap = await getDocs(collection(db, "pickups"));

       const reportsData = pickupSnap.docs.map((doc) => {
         const data = doc.data();

         const user = usersMap[data.userId];

         return {
           id: doc.id,
           ...data,

           // Convert Firestore timestamps
           date: data.date?.toDate(),
           createdAt: data.createdAt?.toDate(),

           // User details where we i get the detailks from
           customerName: user ? `${user.fname} ${user.lname}` : "Unknown User",

           customerEmail: user?.email || "",
           customerPhone: user?.phone_number || "",
         };
       });

       setReports(reportsData);

       console.log(reportsData);
     } catch (err) {
       console.error("Error fetching reports:", err);
     } finally {
       setLoading(false);
     }
   };

   fetchReports();
 }, []);

  // Filter and search logic
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.address || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || (report.status || "pending") === statusFilter;

      const reportDate = report.date ? new Date(report.date) : null;
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchesDateRange =
        (!start || !reportDate || reportDate >= start) &&
        (!end || !reportDate || reportDate <= end);

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [reports, searchTerm, statusFilter, startDate, endDate]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = filteredReports.length;
    const totalRevenue = filteredReports.reduce((sum, r) => sum + (r.price || 0), 0);
    const avgCharge = total > 0 ? (totalRevenue / total).toFixed(2) : 0;

    return {
      total,
      totalRevenue: totalRevenue.toFixed(2),
      avgCharge,
    };
  }, [filteredReports]);

  // Prepare chart data (daily revenue)
  const chartData = useMemo(() => {
    const daily = {};
    filteredReports.forEach((report) => {
      if (report.date) {
        const dateKey = report.date.toLocaleDateString();
        daily[dateKey] = (daily[dateKey] || 0) + (report.price || 0);
      }
    });
    return Object.entries(daily)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .map(([date, revenue]) => ({ date, revenue: parseFloat(revenue.toFixed(2)) }))
      .slice(-14); // Last 14 days
  }, [filteredReports]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Report ID", "Pickup Date", "Created At", "Charge (K)", "Status", "Customer", "Address"];
    const rows = filteredReports.map((r) => [
      r.id,
      r.date ? r.date.toLocaleString() : "N/A",
      r.createdAt ? r.createdAt.toLocaleString() : "N/A",
      r.price || 0,
      r.status || "pending",
      r.customerName || "N/A",
      r.address || "N/A",
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 pb-4">
        <Skeleton height={100} count={3} className="mb-4" />
        <Skeleton height={300} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 pb-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Pickups</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="text-blue-600 text-xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">K{summaryStats.totalRevenue}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <span className="text-green-600 text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Average Charge</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">K{summaryStats.avgCharge}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <span className="text-purple-600 text-xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `K${value}`} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID, customer, or Address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-medium">No reports found</p>
            <p className="text-sm mt-2">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Report ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Pickup Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Created At</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Charge (K)</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, idx) => (
                  <tr key={report.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 text-gray-900 font-medium text-xs">{report.id}</td>
                    <td className="px-6 py-4 text-gray-600">{report.date ? report.date.toLocaleString() : "N/A"}</td>
                    <td className="px-6 py-4 text-gray-600">{report.createdAt ? report.createdAt.toLocaleString() : "N/A"}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">K{report.price || 0}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          (report.status || "pending") === "completed"
                            ? "bg-green-100 text-green-800"
                            : (report.status || "pending") === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {report.status || "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{report.customerName || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{report.address || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500 pb-4">
        Showing {filteredReports.length} of {reports.length} reports
      </div>
    </div>
  );
}
