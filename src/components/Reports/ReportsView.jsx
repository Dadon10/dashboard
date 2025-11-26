import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export default function ReportsView() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'pickups'));
        setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Reports</h1>
      <ul className="space-y-2">
        {reports.map(r => (
          <li key={r.id} className="p-3 bg-white rounded shadow">
            {r.title}: {r.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
