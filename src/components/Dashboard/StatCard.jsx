import CountUp from "react-countup";

export default function StatCard({ title, value, color, prefix }) {
  return (
    <div className={`p-4 rounded-md shadow text-white cursor-pointer ${color || 'bg-green-600'}`}>
      <h2 className="text-sm font-medium">{title}</h2>
      <p className="text-xl font-semibold">
        <CountUp
          start={0}
          end={value}
          duration={5}

        />
      </p>
    </div>
  );
}
