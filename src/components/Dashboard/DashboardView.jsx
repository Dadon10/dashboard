import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import StatCard from "./StatCard";
import UsersTable from "./UsersTable";
import DashboardSkeleton from "./DashboardSkeleton"; 

import { SkeletonTheme } from "react-loading-skeleton";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardView() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalRequests: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  const [statusChart, setStatusChart] = useState(null);
  const [monthlyChart, setMonthlyChart] = useState(null);
  const [revenueChart, setRevenueChart] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const reqSnap = await getDocs(collection(db, "pickups"));

        let total = 0;
        let completed = 0;
        let pending = 0;
        let cancelled = 0;
        let totalRevenue = 0;

        const monthlyRequests = Array(12).fill(0);
        const monthlyRevenue = Array(12).fill(0);

        const currentYear = new Date().getFullYear();

        reqSnap.forEach((doc) => {
          const data = doc.data();

          if (data.deleted) return;

          total++;

          switch (data.status) {
            case "completed":
              completed++;
              totalRevenue += Number(data.price) || 0;
              break;

            case "pending":
              pending++;
              break;

            case "cancelled":
              cancelled++;
              break;

            default:
              break;
          }

          if (data.createdAt) {
            const created = data.createdAt.toDate();

            if (created.getFullYear() === currentYear) {
              monthlyRequests[created.getMonth()]++;

              if (data.status === "completed") {
                monthlyRevenue[created.getMonth()] += Number(data.price) || 0;
              }
            }
          }
        });

        setStats({
          totalRequests: total,
          completed,
          pending,
          cancelled,
          totalRevenue,
        });

        setStatusChart({
          labels: ["Completed", "Pending", "Cancelled"],
          datasets: [
            {
              data: [completed, pending, cancelled],
              backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
            },
          ],
        });

        setMonthlyChart({
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Pickup Requests",
              data: monthlyRequests,
              borderColor: "#2563eb",
              backgroundColor: "rgba(37,99,235,0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        });

        setRevenueChart({
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Revenue (ZMW)",
              data: monthlyRevenue,
              borderColor: "#16a34a",
              backgroundColor: "rgba(22,163,74,0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        {[...Array(1)].map((_, index) => (
          <SkeletonTheme
            key={index}
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
          >
            <DashboardSkeleton />
          </SkeletonTheme>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          color="bg-blue-500"
          prefix={""}
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          color="bg-green-500"
          prefix={""}
        />

        <StatCard title="Pending" value={stats.pending} color="bg-yellow-500" />

        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          color="bg-red-500"
          prefix={""}
        />

        <StatCard
          title="Revenue"
          value={stats.totalRevenue.toFixed(2)}
          color="bg-emerald-600"
          prefix={"ZMW"}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Request Status</h2>
          <div className="h-64">
            <Doughnut data={statusChart} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Requests This Year</h2>

          <div className="h-64">
            <Line data={monthlyChart} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue This Year</h2>

          <div className="h-64">
            <Line data={revenueChart} />
          </div>
        </div>
      </div>

      <UsersTable />
    </div>
  );
}
