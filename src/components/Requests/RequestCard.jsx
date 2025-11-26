export default function RequestCard({ request }) {
  return (
    <div className="p-4 bg-white rounded shadow mb-2 flex justify-between items-center">
      <div>
        <h3 className="font-medium pb-2">{request.userName}</h3>
        <h3 className="font-medium pb-2">{request.phone}</h3>
        <p className="text-sm text-gray-500">{request.address}</p>
        <p className="text-sm text-green-500 font-semibold pt-2">
          Waste Type{" : "}
          {request.wasteType}
        </p>
        <p className="text-sm text-blue-500 font-semibold pt-2">
          Pickup Time {" : "}
          {request.timeFrame}
        </p>
      </div>
      <span
        className={`px-2 py-1 rounded ${
          request.status === "completed" ? "bg-green-500" : "bg-yellow-500"
        } text-white text-sm`}
      >
        {request.status}
      </span>
    </div>
  );
}