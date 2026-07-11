export default function RequestCard({ request, onUpdateStatus, onDelete }) {
  const status = request.status || 'pending';
  const isCompleted = status === 'completed';
  const isRejected = status === 'rejected';
  const showAccept = status === 'pending';
  const showReject = !isCompleted && !isRejected;
  const showComplete = !isCompleted && !isRejected;

  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-start">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{request.userName || 'Unknown requester'}</h3>
          <p className="text-sm text-gray-500">{request.phone || 'No contact provided'}</p>
          {request.address && <p className="text-sm text-gray-500">{request.address}</p>}
          <p className="text-sm text-green-600 font-semibold">Waste Type: {request.wasteType || 'Unknown'}</p>
          <p className="text-sm text-blue-600 font-semibold">Pickup Time: {request.timeFrame || 'Not set'}</p>
          <p className="text-sm text-gray-400">Request ID: {request.id}</p>
    <div className="p-4 bg-white rounded shadow mb-2">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="pb-2 font-bold">{request.userName}</h3>
          <h3 className="font-medium pb-2">Phone: {request.phone}</h3>
          <p className="text-sm text-gray-500">{request.address}</p>

          <p className="text-sm text-green-500 font-semibold pt-2">
            Waste Type : {request.wasteType}
          </p>

          <p className="text-sm text-blue-500 font-semibold pt-2">
            Pickup Time : {request.timeFrame}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-white text-sm ${
            isCompleted
              ? 'bg-green-500'
              : isRejected
              ? 'bg-red-500'
              : status === 'accepted'
              ? 'bg-blue-500'
              : 'bg-yellow-500'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {showAccept && (
          <button onClick={() => onUpdateStatus(request.id, 'accepted')} className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
            Accept
          </button>
        )}

        {showReject && (
          <button onClick={() => onUpdateStatus(request.id, 'rejected')} className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">
            Reject
          </button>
        )}

        {showComplete && (
          <button onClick={() => onUpdateStatus(request.id, 'completed')} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
            Complete
          </button>
        )}

        <button onClick={() => onDelete(request.id)} className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-800">
          Archive
        </button>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
}
