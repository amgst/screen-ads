
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Image as ImageIcon, PlayCircle, Activity, Sparkles, Layout } from 'lucide-react';
import { store, HEARTBEAT_TIMEOUT } from '../services/mockStore';

const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
    <div className="flex items-center justify-between mb-4">
      <span className="text-slate-400 text-sm font-medium">{label}</span>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <div className="text-3xl font-bold">{value}</div>
  </div>
);

const Dashboard = () => {
  const [screens, setScreens] = useState(store.getScreens());
  const [media, setMedia] = useState(store.getMedia());
  const [playlists, setPlaylists] = useState(store.getPlaylists());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setScreens([...store.getScreens()]);
      setMedia([...store.getMedia()]);
      setPlaylists([...store.getPlaylists()]);
    });

    // Refresh connectivity UI every 10 seconds in case a heartbeat expires
    const refreshInterval = setInterval(() => {
      setScreens([...store.getScreens()]);
    }, 10000);

    return () => {
      unsub();
      clearInterval(refreshInterval);
    };
  }, []);

  const isScreenOnline = (lastHeartbeat: number) => {
    return (Date.now() - lastHeartbeat) < HEARTBEAT_TIMEOUT;
  };

  const onlineScreensCount = screens.filter(s => isScreenOnline(s.lastHeartbeat)).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Cloud Dashboard</h1>
          <p className="text-slate-400 mt-1">Monitor your global network of digital screens.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/player"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-all font-semibold"
          >
            <Layout size={18} />
            <span>Launch Player</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Screens" value={screens.length} icon={Monitor} color="bg-blue-600" />
        <StatCard label="Online Now" value={onlineScreensCount} icon={Activity} color="bg-green-600" />
        <StatCard label="Media Assets" value={media.length} icon={ImageIcon} color="bg-purple-600" />
        <StatCard label="Active Playlists" value={playlists.length} icon={PlayCircle} color="bg-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Screens */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Screen Connectivity</h2>
            <span className="text-xs text-slate-400">Live Status Updates</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="px-6 py-4">Screen Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Playlist</th>
                  <th className="px-6 py-4">Last Ping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {screens.map(screen => (
                  <tr key={screen.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{screen.name}</td>
                    <td className="px-6 py-4">
                      {isScreenOnline(screen.lastHeartbeat) ? (
                        <span className="flex items-center space-x-2 text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span>ONLINE</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2 text-xs font-semibold px-2 py-1 rounded-full bg-red-500/10 text-red-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <span>OFFLINE</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {playlists.find(p => p.id === screen.currentPlaylistId)?.name || 'None'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(screen.lastHeartbeat).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
