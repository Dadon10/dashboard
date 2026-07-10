import StatCard from './StatCard';

export default function DashboardView({ requests = [], loading = false }) {
  const visibleRequests = requests.filter(req => !req.deleted);
  const totalRequests = visibleRequests.length;
  const completed = visibleRequests.filter(req => req.status === 'completed').length;
  const pending = totalRequests - completed;

  return (
    <div className="p-4">
      {loading ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Total Requests" value={totalRequests} color="bg-blue-500" />
            <StatCard title="Completed" value={completed} color="bg-green-500" />
            <StatCard title="Pending" value={pending} color="bg-yellow-500" />
          </div>
          {totalRequests === 0 && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">
              No requests have been loaded yet. Check back once pickup requests are submitted.
            </div>
          )}
        </>
      )}
    </div>
  );
}
