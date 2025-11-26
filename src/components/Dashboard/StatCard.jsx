export default function StatCard({ title, value, color }) {
  return (
    <div className={`p-4 rounded-lg shadow text-white ${color || 'bg-green-600'}`}>
      <h2 className="text-sm font-medium">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
