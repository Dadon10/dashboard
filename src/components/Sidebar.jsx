import { LayoutDashboard, ClipboardList, FileText, LogOut, Menu, X } from 'lucide-react';

export default function Sidebar({ currentView, onViewChange, onLogout, isMobileOpen, onMobileClose }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'Requests', icon: ClipboardList },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  return (
    <>
      {isMobileOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onMobileClose} />}
      <aside className={`fixed lg:static left-0 top-0 h-full w-64 bg-gray-900 text-white p-6 z-50 transform transition ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-bold text-lg">GC Admin</h1>
          <button className="lg:hidden" onClick={onMobileClose}><X className="w-6 h-6"/></button>
        </div>
        <nav className="flex-1 space-y-2">
          {items.map(i => (
            <button key={i.id} onClick={() => { onViewChange(i.id); onMobileClose(); }} className={`flex items-center w-full p-2 rounded ${currentView === i.id ? 'bg-green-600' : 'hover:bg-gray-800'}`}>
              <i.icon className="w-5 h-5 mr-2" /> {i.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="flex items-center w-full mt-4 p-2 rounded hover:bg-gray-800">
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </button>
      </aside>
    </>
  );
}
