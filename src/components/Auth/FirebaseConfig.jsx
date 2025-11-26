export default function FirebaseConfig() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded shadow max-w-xl w-full">
        <h1 className="text-xl font-bold mb-4">Firebase Config Required</h1>
        <p className="text-gray-600 mb-4">
          Add your Firebase configuration in browser console:
        </p>
        <pre className="bg-gray-900 text-green-400 p-2 rounded text-sm overflow-x-auto">
          {`localStorage.setItem('firebaseConfig', JSON.stringify({
  apiKey: "AIzaSyAWywzGnsKCkfuabo7hCpzECkizVUlwFtc",
  authDomain: "garbagecollectionapp-e999e.firebaseapp.com",
  projectId: "garbagecollectionapp-e999e",
  storageBucket: "garbagecollectionapp-e999e.firebasestorage.app",
  messagingSenderId: "34201078156",
  appId: "1:34201078156:web:befecd59c9c99f9357aea9",
  measurementId: "G-BSDLHWCKJX"
}));
window.location.reload();`}
        </pre>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 text-white py-2 rounded mt-4"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
