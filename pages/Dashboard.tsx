
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Image as ImageIcon, PlayCircle, Activity, Sparkles, Layout } from 'lucide-react';
import { store } from '../services/mockStore';
import { suggestSchedule } from '../services/geminiService';

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
  const [aiSuggestion, setAiSuggestion] = useState<any[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setScreens([...store.getScreens()]);
      setMedia([...store.getMedia()]);
      setPlaylists([...store.getPlaylists()]);
    });
    return unsub;
  }, []);

  const getAiSuggestions = async () => {
    setLoadingAi(true);
    try {
      const data = await suggestSchedule('Modern Coffee Shop & Bistro');
      setAiSuggestion(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  const onlineScreens = screens.filter(s => s.status === 'online').length;

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
          <button 
            onClick={getAiSuggestions}
            disabled={loadingAi}
            className="flex items-center space-x-2 bg-slate-800 border border-slate-700 hover:border-purple-500 text-white px-4 py-2 rounded-lg transition-all"
          >
            <Sparkles size={18} className="text-purple-400" />
            <span>{loadingAi ? 'Asking AI...' : 'Suggest Schedule'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Screens" value={screens.length} icon={Monitor} color="bg-blue-600" />
        <StatCard label="Online Now" value={onlineScreens} icon={Activity} color="bg-green-600" />
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
                      <span className={`flex items-center space-x-2 text-xs font-semibold px-2 py-1 rounded-full ${screen.status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${screen.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span>{screen.status.toUpperCase()}</span>
                      </span>
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

        {/* AI Insight */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center space-x-2">
            <Sparkles size={20} className="text-purple-400" />
            <span>AI Content Strategy</span>
          </h2>
          {aiSuggestion.length > 0 ? (
            <div className="space-y-6">
              {aiSuggestion.map((s, idx) => (
                <div key={idx} className="border-l-2 border-purple-500/30 pl-4 py-1">
                  <div className="text-xs font-bold text-purple-400 uppercase mb-1">{s.timeBlock}</div>
                  <div className="font-medium text-slate-100">{s.suggestion}</div>
                  <div className="text-xs text-slate-400 mt-1 italic">{s.reasoning}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} className="text-slate-500" />
              </div>
              <p className="text-sm text-slate-400">
                Click "Suggest Schedule" to get AI insights for your business type.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
