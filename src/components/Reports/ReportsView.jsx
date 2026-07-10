export default function ReportsView({ requests = [], loading = false }) {
  const reports = requests.filter(req => !req.deleted);
  const reportCount = reports.length;
  const completed = reports.filter(req => req.status === 'completed').length;
  const pending = reportCount - completed;

  const formatDate = (value) => {
    if (!value) return 'No date';
    const date = value?.toDate ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? 'No date' : date.toLocaleString();
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-bold">Reports</h1>
          <p className="text-gray-500">Summary of current pickup requests.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-lg bg-blue-50 text-blue-700 px-3 py-2 text-sm">Total {reportCount}</span>
          <span className="rounded-lg bg-green-50 text-green-700 px-3 py-2 text-sm">Completed {completed}</span>
          <span className="rounded-lg bg-yellow-50 text-yellow-700 px-3 py-2 text-sm">Pending {pending}</span>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">Loading report data...</div>
      ) : reportCount === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-600">
          No report data available yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li key={r.id} className="p-4 bg-white rounded shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <h2 className="font-semibold text-gray-700">Request ID: {r.id}</h2>
                  <p className="text-sm text-gray-500">Pickup Date: {formatDate(r.date)}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  {r.status || 'pending'}
                </span>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Charge: {r.price != null ? `K ${r.price}` : 'N/A'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
