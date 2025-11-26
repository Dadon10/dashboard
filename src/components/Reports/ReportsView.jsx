import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export default function ReportsView() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const snapshot = await getDocs(collection(db, "pickups"));
        setReports(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            console.log(data)
            return {
              id: doc.id,
              ...data,
              date: data.date?.toDate(),
              createdAt: data.createdAt?.toDate(),
            };
          })
        );

      } catch (err) {
        console.error(err);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 ">Reports</h1>
      <ul className="space-y-2">
        {reports.map((r) => (
          <div key={r.id} className="p-3 bg-white rounded shadow">
            <h1 className="font-semibold text-gray-500 pb-2">{`ID : ${r.id}`}</h1>
            <h2 className='pb-2'>{"Pickup Date: "}{r.date ? r.date.toLocaleString() : "No date"}</h2>
            <h3 className="">{"Charge  K"}{r.price}</h3>
          </div>
        ))}
      </ul>
    </div>
  );
}
