export default function RequestCard({ request }) {
  return (
    <div className="p-4 bg-white rounded shadow mb-2 flex justify-between items-center">
      <div>
        <h3 className="font-medium">{request.user}</h3>
        <p className="text-sm text-gray-500">{request.address}</p>
      </div>
      <span className={`px-2 py-1 rounded ${request.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'} text-white text-sm`}>
        {request.status}
      </span>
    </div>
  );
}
