export default function RequestCard({ request, onUpdateStatus, onDelete }) {
  return (
    <div className="p-4 bg-white rounded shadow mb-2">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="pb-2 font-bold">{request.userName}</h3>
          <h3 className="font-medium pb-2">{request.phone}</h3>
          <p className="text-sm text-gray-500">{request.address}</p>

          <p className="text-sm text-green-500 font-semibold pt-2">
            Waste Type : {request.wasteType}
          </p>

          <p className="text-sm text-blue-500 font-semibold pt-2">
            Pickup Time : {request.timeFrame}
          </p>
        </div>

        <span
          className={`px-2 py-1 rounded text-white text-sm ${
            request.status === "completed"
              ? "bg-green-500"
              : request.status === "rejected"
              ? "bg-red-500"
              : request.status === "accepted"
              ? "bg-blue-500"
              : "bg-yellow-500"
          }`}
        >
          {request.status || "pending"}
        </span>
      </div>

      {/* CRUD ACTION BUTTONS */}
      <div className="flex gap-3 mt-4">

        <button
          onClick={() => onUpdateStatus(request.id, "accepted")}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Accept
        </button>

        <button
          onClick={() => onUpdateStatus(request.id, "rejected")}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Reject
        </button>

        <button
          onClick={() => onUpdateStatus(request.id, "completed")}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Complete
        </button>

        <button
          onClick={() => onDelete(request.id)}
          className="bg-gray-700 text-white px-3 py-1 rounded"
        >
          Archive
        </button>
      </div>
    </div>
  );
}
