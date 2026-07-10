import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db, initFirebase } from "./firebase/firebase";
import Sidebar from './components/Sidebar';
import Login from "./components/Auth/Login";
import FirebaseConfig from "./components/Auth/FirebaseConfig";
import DashboardView from "./components/Dashboard/DashboardView";
import RequestsView from "./components/Requests/RequestsView";
import ReportsView from "./components/Reports/ReportsView";
import { Menu } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { BlinkBlur } from 'react-loading-indicators';

export default function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [operationError, setOperationError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const configured = initFirebase();
    setIsConfigured(configured);

    if (configured) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else setLoading(false);
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    setRequestsLoading(true);
    const q = query(collection(db, 'requests'), orderBy('requestDate', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const requestsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(requestsData);
        setRequestsLoading(false);
      },
      err => {
        console.error('Realtime load error', err);
        setOperationError('Unable to load request data. Please try again later.');
        setRequestsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const requestRef = doc(db, 'requests', requestId);
      const updateData = { status: newStatus, updatedAt: serverTimestamp() };
      await updateDoc(requestRef, updateData);
      setOperationError('');
    } catch (error) {
      console.error('Status update failed', error);
      setOperationError('Failed to update request status.');
    }
  };

  const handleArchiveRequest = async (requestId) => {
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        deleted: true,
        deletedAt: serverTimestamp(),
      });
      setOperationError('');
    } catch (error) {
      console.error('Archive failed', error);
      setOperationError('Failed to archive request.');
    }
  };

  if (!isConfigured) return <FirebaseConfig />;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-center animate-pulse text-2xl text-green-500">
      <BlinkBlur
        color="#32cd32"
        size="medium"
        text="garbage Collector"
        textColor=""
      />
    </div>
  );

  if (!user) return <Login onLogin={() => setUser(auth.currentUser)} />;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between gap-4">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-500">{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h2>
            <p className="text-sm text-gray-400">Garbage collection dashboard</p>
          </div>
          <span className="text-sm text-gray-600 hidden sm:inline">{user.email}</span>
        </header>
        {operationError && (
          <div className="mx-6 mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 flex items-center justify-between">
            <span>{operationError}</span>
            <button onClick={() => setOperationError('')} className="text-sm underline">
              Dismiss
            </button>
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === 'dashboard' && <DashboardView requests={requests} loading={requestsLoading} />}
          {currentView === 'requests' && <RequestsView requests={requests} loading={requestsLoading} onUpdateStatus={handleUpdateStatus} onArchive={handleArchiveRequest} />}
          {currentView === 'reports' && <ReportsView requests={requests} loading={requestsLoading} />}
        </main>
      </div>
    </div>
  );
}
