
import React, { useState, useEffect } from 'react';
import { Monitor, Plus, Link as LinkIcon, AlertCircle, PlayCircle, Settings, Trash2 } from 'lucide-react';
import { store, HEARTBEAT_TIMEOUT } from '../services/mockStore';

const Screens = () => {
  const [screens, setScreens] = useState(store.getScreens());
  const [playlists, setPlaylists] = useState(store.getPlaylists());
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [pairingCode, setPairingCode] = useState('');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setScreens([...store.getScreens()]);
      setPlaylists([...store.getPlaylists()]);
    });

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

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && pairingCode) {
      store.addScreen(newName, pairingCode);
      setIsAdding(false);
      setNewName('');
      setPairingCode('');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete screen "${name}"? All associated schedules will also be removed.`)) {
      store.deleteScreen(id);
    }
  };

  const handlePlaylistChange = (screenId: string, playlistId: string) => {
    store.assignPlaylistToScreen(screenId, playlistId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Screens</h1>
          <p className="text-slate-400 mt-1">Add, pair, and assign content to your signage devices.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Add Screen</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleAdd} className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-slate-400">Screen Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Lobby Entrance TV"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="w-full md:w-48 space-y-2">
              <label className="text-sm font-medium text-slate-400">Pairing Code (6 digits)</label>
              <input
                type="text"
                maxLength={6}
                value={pairingCode}
                onChange={(e) => setPairingCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-600 px-6 py-2 rounded-lg font-medium">Pair Device</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-slate-700 px-6 py-2 rounded-lg font-medium">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {screens.map(screen => (
          <div key={screen.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4 hover:border-slate-500 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${isScreenOnline(screen.lastHeartbeat) ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  <Monitor size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{screen.name}</h3>
                  <div className="text-xs text-slate-500 font-mono">Code: {screen.pairingCode}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDelete(screen.id, screen.name)}
                  className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  title="Delete Screen"
                >
                  <Trash2 size={18} />
                </button>
                <button className="text-slate-400 hover:text-white p-1">
                  <Settings size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Playlist</label>
              <select
                value={screen.currentPlaylistId || ''}
                onChange={(e) => handlePlaylistChange(screen.id, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Playlist Assigned</option>
                {playlists.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400">
              <div className="flex items-center space-x-1">
                <Activity size={12} className={isScreenOnline(screen.lastHeartbeat) ? 'text-green-500' : 'text-red-500'} />
                <span>Last updated {new Date(screen.lastHeartbeat).toLocaleTimeString()}</span>
              </div>
              {screen.currentPlaylistId && (
                <div className="flex items-center space-x-1 text-blue-400">
                  <PlayCircle size={12} />
                  <span>Playing</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {screens.length === 0 && !isAdding && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-slate-800/20 border-2 border-dashed border-slate-700 rounded-xl">
            <AlertCircle size={48} className="text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-300">No Screens Added Yet</h3>
            <p className="text-slate-500 text-sm mt-1">Get started by clicking the "Add Screen" button.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Activity = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

export default Screens;
