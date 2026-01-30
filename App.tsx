
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Monitor,
  PlaySquare,
  Image as ImageIcon,
  LayoutDashboard,
  Plus,
  Settings,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  Calendar,
  ChevronLeft
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Screens from './pages/Screens';
import MediaLibrary from './pages/MediaLibrary';
import Playlists from './pages/Playlists';
import Player from './pages/Player';
import Schedules from './pages/Schedules';
import Landing from './pages/Landing';

const SidebarLink = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active
      ? 'bg-blue-600 text-white'
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Monitor size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">LuminaSign</span>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <SidebarLink to="/admin" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/admin'} />
            <SidebarLink to="/admin/screens" icon={Monitor} label="Screens" active={location.pathname === '/admin/screens'} />
            <SidebarLink to="/admin/media" icon={ImageIcon} label="Media Library" active={location.pathname === '/admin/media'} />
            <SidebarLink to="/admin/playlists" icon={PlaySquare} label="Playlists" active={location.pathname === '/admin/playlists'} />
            <SidebarLink to="/admin/schedules" icon={Calendar} label="Schedules" active={location.pathname === '/admin/schedules'} />
          </nav>

          <div className="p-4 border-t border-slate-800 space-y-2">
            <Link
              to="/player"
              className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white transition-colors bg-slate-900/50 rounded-lg hover:bg-blue-600/10"
            >
              <Monitor size={20} />
              <span className="text-sm font-semibold text-blue-400">Launch Player App</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-8 py-4 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white">
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-medium">Demo User</span>
              <span className="text-xs text-green-500">Administrator</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <Settings size={20} />
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/screens" element={<AdminLayout><Screens /></AdminLayout>} />
        <Route path="/admin/media" element={<AdminLayout><MediaLibrary /></AdminLayout>} />
        <Route path="/admin/playlists" element={<AdminLayout><Playlists /></AdminLayout>} />
        <Route path="/admin/schedules" element={<AdminLayout><Schedules /></AdminLayout>} />
        <Route path="/player" element={<Player />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
