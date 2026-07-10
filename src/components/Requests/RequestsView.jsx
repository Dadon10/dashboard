import RequestCard from './RequestCard';

export default function RequestsView({ requests = [], loading = false, onUpdateStatus, onArchive }) {
  const visibleRequests = requests.filter(req => !req.deleted);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Pickup Requests</h1>
        <span className="text-sm text-gray-500">{visibleRequests.length} active request{visibleRequests.length === 1 ? '' : 's'}</span>
      </div>

      {loading ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">Loading requests...</div>
      ) : visibleRequests.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-600">
          No pickup requests found. When requests arrive, they will appear here.
        </div>
      ) : (
        visibleRequests.map(req => (
          <RequestCard
            key={req.id}
            request={req}
            onUpdateStatus={onUpdateStatus}
            onDelete={onArchive}
          />
        ))
      )}
    </div>
  );
}
