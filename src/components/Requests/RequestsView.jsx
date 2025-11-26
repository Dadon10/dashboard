import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import RequestCard from './RequestCard';

export default function RequestsView() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'pickups'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Requests</h1>
      {requests.map(req => <RequestCard key={req.id} request={req} />)}
    </div>
  );
}
