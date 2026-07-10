import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import RequestCard from "./RequestCard";
import RequestCardSkeleton from "./RequestCradSkeleton";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function RequestsView() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // READ — Fetch pickup requests + user details
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);

      try {
       //TODO: Uncomment this if you want to test the skeleton
        //await new Promise((resolve) => setTimeout(resolve, 2000));

        const snapshot = await getDocs(collection(db, "pickups"));

        const data = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const pickupData = {
              id: docSnap.id,
              ...docSnap.data(),
            };

            if (pickupData.userId) {
              const userRef = doc(db, "users", pickupData.userId);
              const userSnap = await getDoc(userRef);

              if (userSnap.exists()) {
                const user = userSnap.data();

                pickupData.userName = `${user.fname} ${user.lname}`;
                pickupData.phone = user.phone_number;
              } else {
                pickupData.userName = "Unknown User";
                pickupData.phone = "N/A";
              }
            } else {
              pickupData.userName = "Unknown User";
              pickupData.phone = "N/A";
            }

            return pickupData;
          })
        );

        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
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
        updatedAt: serverTimestamp(),
      });

      setRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // DELETE — Soft delete
  const softDelete = async (id) => {
    try {
      const ref = doc(db, "pickups", id);

      await updateDoc(ref, {
        deleted: true,
        deletedAt: serverTimestamp(),
      });

      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error) {
      console.error("Failed to archive request:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Pickup Requests</h1>

      {isLoading ? (
        [...Array(5)].map((_, index) => (
          <SkeletonTheme key={index} baseColor="#e5e7eb" highlightColor="#f3f4f6">
            <RequestCardSkeleton />
          </SkeletonTheme>
        ))
      ) : requests.length > 0 ? (
        requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onUpdateStatus={updateStatus}
            onDelete={softDelete}
          />
        ))
      ) : (
        <p className="text-gray-500">No pickup requests found.</p>
      )}
    </div>
  );
}
