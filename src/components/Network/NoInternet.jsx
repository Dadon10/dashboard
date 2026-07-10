export default function NoInternet() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-7xl mb-4">📡</div>

        <h1 className="text-3xl font-bold text-gray-800">You're Offline</h1>

        <p className="text-gray-500 mt-4">
          We couldn't detect an internet connection.
        </p>

        <p className="text-gray-500">
          Please check your Wi-Fi or mobile data and try again.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-8 bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-lg"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
