import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db, initFirebase } from "./firebase/firebase";
import Sidebar from './components/Sidebar';
import Login from "./components/Auth/Login";
import FirebaseConfig from "./components/Auth/FirebaseConfig";
import DashboardView from "./components/Dashboard/DashboardView";
import RequestsView from "./components/Requests/RequestsView";
import ReportsView from "./components/Reports/ReportsView";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [requests, setRequests] = useState([]);
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
    const q = query(collection(db, 'requests'), orderBy('requestDate', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const requestsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(requestsData);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    const requestRef = doc(db, 'requests', requestId);
    const updateData = { status: newStatus, updatedAt: serverTimestamp() };
    if (newStatus.toLowerCase() === 'collected') updateData.paymentStatus = 'Completed';
    await updateDoc(requestRef, updateData);
  };

  if (!isConfigured) return <FirebaseConfig />;
  if (loading) return <div className="min-h-screen flex items-center justify-center text-center animate-pulse text-2xl text-green-500">Loading...</div>;
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
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            ☰
          </button>
          <h2 className="text-lg font-semibold">{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h2>
          <span className="text-sm text-gray-600 hidden sm:inline">{user.email}</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === 'dashboard' && <DashboardView requests={requests} />}
          {currentView === 'requests' && <RequestsView requests={requests} onUpdateStatus={handleUpdateStatus} />}
          {currentView === 'reports' && <ReportsView requests={requests} />}
        </main>
      </div>
    </div>
  );
}
