export default function ErrorScreen({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  onRetry,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-7xl mb-4">⚠️</div>

        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>

        <p className="text-gray-500 mt-4">{message}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-8 bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-lg"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
