import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import RequestCard from './RequestCard';

export default function RequestsView() {
  const [requests, setRequests] = useState([]);

  // READ — Fetch pickup requests + user details
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const snapshot = await getDocs(collection(db, "pickups"));
        const data = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const pickupData = { id: docSnap.id, ...docSnap.data() };

            // Fetch user document
            if (pickupData.userId) {
              const userRef = doc(db, "users", pickupData.userId);
              const userSnap = await getDoc(userRef);

              if (userSnap.exists()) {
                const user = userSnap.data();
                pickupData.userName = `${user.fname} ${user.lname}`;
                pickupData.phone = user.phone_number;
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
      } catch (err) {
        console.error(err);
      }
    };

    fetchRequests();
  }, []);

  // UPDATE — Change pickup status
  const updateStatus = async (id, newStatus) => {
    try {
      const ref = doc(db, "pickups", id);
      await updateDoc(ref, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // Update UI locally
      setRequests(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status: newStatus } : r
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // DELETE — Soft delete (recommended for production)
  const softDelete = async (id) => {
    try {
      const ref = doc(db, "pickups", id);
      await updateDoc(ref, {
        deleted: true,
        deletedAt: serverTimestamp()
      });

      // Remove from UI
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Failed to archive request", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Pickup Requests</h1>

      {requests
        .filter(req => !req.deleted) // hide soft-deleted items
        .map(req => (
          <RequestCard
            key={req.id}
            request={req}
            onUpdateStatus={updateStatus}
            onDelete={softDelete}
          />
        ))
      }
    </div>
  );
}
