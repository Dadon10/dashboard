import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import RequestCard from './RequestCard';

export default function RequestsView() {
  const [requests, setRequests] = useState([]);

 
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const snapshot = await getDocs(collection(db, "pickups"));
        const data = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const pickupData = { id: docSnap.id, ...docSnap.data() };

            // Fetch the user document
            if (pickupData.userId) {
              const userRef = doc(db, "users", pickupData.userId);
              const userSnap = await getDoc(userRef);

              if (userSnap.exists()) {
                const userData = userSnap.data();
                pickupData.userName = `${userData.fname} ${userData.lname}`;
                pickupData.phone = `${userData.phone_number}`
              } else {
                pickupData.userName = "Unknown User";
              }
            } else {
              pickupData.userName = "Unknown User";
            }

            return pickupData;
          })
        );

        setRequests(data);
        console.log(data)
      } catch (err) {
        console.error(err);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Pickup Requests</h1>
      {
      requests.map(req => <RequestCard key={req.id} request={req} />)}
    </div>
  );
}
