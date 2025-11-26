import StatCard from './StatCard';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export default function DashboardView() {
  const [stats, setStats] = useState({ totalRequests: 0, completed: 0, pending: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const reqSnap = await getDocs(collection(db, 'requests'));
        let total = reqSnap.size;
        let completed = 0, pending = 0;

        reqSnap.forEach(doc => {
          const data = doc.data();
          if (data.status === 'completed') completed++;
          else pending++;
        });

        setStats({ totalRequests: total, completed, pending });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <StatCard title="Total Requests" value={stats.totalRequests} color="bg-blue-500" />
      <StatCard title="Completed" value={stats.completed} color="bg-green-500" />
      <StatCard title="Pending" value={stats.pending} color="bg-yellow-500" />
    </div>
  );
}
