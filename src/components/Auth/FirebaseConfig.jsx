export default function FirebaseConfig() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded shadow max-w-xl w-full">
        <h1 className="text-xl font-bold mb-4">Firebase Configuration Required</h1>
        <p className="text-gray-600 mb-4">
          The app cannot connect to Firebase because the client configuration is missing or invalid.
          Please verify `src/firebase/firebase.js` contains your Firebase project settings.
        </p>
        <div className="rounded bg-gray-100 p-4 text-sm text-gray-700">
          <p className="font-semibold mb-2">Example config location</p>
          <code>src/firebase/firebase.js</code>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 text-white py-2 rounded mt-4"
        >
          Reload after configuration
        </button>
      </div>
    </div>
  );
}
