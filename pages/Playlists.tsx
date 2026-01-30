
import React, { useState, useEffect } from 'react';
import { PlaySquare, Plus, Clock, List, Trash2, GripVertical, Image as ImageIcon, Settings, PlayCircle } from 'lucide-react';
import { store } from '../services/mockStore';
import { MediaItem, PlaylistItem, Playlist } from '../types';

const Playlists = () => {
  const [playlists, setPlaylists] = useState(store.getPlaylists());
  const [media, setMedia] = useState(store.getMedia());
  const [isCreating, setIsCreating] = useState(false);
  
  const [name, setName] = useState('');
  const [selectedItems, setSelectedItems] = useState<PlaylistItem[]>([]);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setPlaylists([...store.getPlaylists()]);
      setMedia([...store.getMedia()]);
    });
    return unsub;
  }, []);

  const addToPlaylist = (mediaItem: MediaItem) => {
    const newItem: PlaylistItem = {
      id: `pi${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      mediaId: mediaItem.id,
      duration: mediaItem.duration
    };
    setSelectedItems([...selectedItems, newItem]);
  };

  const removeFromPlaylist = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete playlist "${name}"? This will also remove any schedules using this playlist.`)) {
      store.deletePlaylist(id);
    }
  };

  const handleSave = () => {
    if (name && selectedItems.length > 0) {
      store.addPlaylist(name, selectedItems);
      setIsCreating(false);
      setName('');
      setSelectedItems([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Playlists</h1>
          <p className="text-slate-400 mt-1">Sequence your media assets for automated playback.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>New Playlist</span>
        </button>
      </div>

      {isCreating ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-800 border border-slate-700 rounded-xl p-8">
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Playlist Builder</h3>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Playlist Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lobby Main Morning Loop"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm text-slate-400">Content Order</label>
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-2 min-h-[200px] space-y-2 overflow-y-auto max-h-[400px]">
                {selectedItems.map((item, idx) => {
                  const m = media.find(x => x.id === item.mediaId);
                  return (
                    <div key={item.id} className="flex items-center bg-slate-800 p-2 rounded border border-slate-700 group">
                      <GripVertical size={16} className="text-slate-600 mr-2" />
                      <div className="w-10 h-6 bg-slate-900 rounded overflow-hidden mr-3">
                        {m?.type === 'image' ? <img src={m?.url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-700" />}
                      </div>
                      <span className="flex-1 truncate text-sm">{m?.name || 'Deleted Media'}</span>
                      <span className="text-xs text-slate-500 mr-4">{item.duration}s</span>
                      <button onClick={() => removeFromPlaylist(item.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
                {selectedItems.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 py-12">
                    <List size={32} />
                    <p className="text-sm mt-2">Select items from the library</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button 
                onClick={handleSave} 
                disabled={!name || selectedItems.length === 0}
                className="flex-1 bg-blue-600 py-2 rounded-lg font-bold disabled:opacity-50"
              >
                Save Playlist
              </button>
              <button onClick={() => setIsCreating(false)} className="px-6 bg-slate-700 py-2 rounded-lg font-bold">Cancel</button>
            </div>
          </div>

          <div className="space-y-4 border-l border-slate-700 pl-8">
            <h3 className="font-bold flex items-center gap-2">
              <ImageIcon size={18} />
              Choose Media
            </h3>
            <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {media.map(m => (
                <div 
                  key={m.id} 
                  onClick={() => addToPlaylist(m)}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-2 cursor-pointer hover:border-blue-500 transition-all group"
                >
                  <div className="aspect-video rounded overflow-hidden relative mb-2">
                    {m.type === 'image' ? <img src={m.url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800 flex items-center justify-center"><ImageIcon className="text-slate-700" /></div>}
                    <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Plus className="text-white" />
                    </div>
                  </div>
                  <div className="text-xs font-medium truncate">{m.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map(playlist => (
            <div key={playlist.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-500 transition-colors flex flex-col h-full group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
                    <PlaySquare size={20} />
                  </div>
                  <h3 className="font-bold text-lg">{playlist.name}</h3>
                </div>
                <button 
                  onClick={() => handleDelete(playlist.id, playlist.name)}
                  className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <List size={14} />
                  <span>{playlist.items.length} items</span>
                  <span className="mx-1 text-slate-600">•</span>
                  <Clock size={14} />
                  <span>{playlist.items.reduce((acc, curr) => acc + curr.duration, 0)}s total</span>
                </div>
                
                <div className="flex -space-x-2 pt-2">
                  {playlist.items.slice(0, 5).map((item, idx) => {
                    const m = media.find(x => x.id === item.mediaId);
                    return (
                      <div key={item.id} className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-900 overflow-hidden">
                        {m?.type === 'image' ? <img src={m.url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-700" />}
                      </div>
                    );
                  })}
                  {playlist.items.length > 5 && (
                    <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                      +{playlist.items.length - 5}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-700 flex justify-between items-center">
                 <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    <Settings size={14} />
                    Edit Playlist
                 </button>
                 <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                    Looping Active
                 </div>
              </div>
            </div>
          ))}

          {playlists.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center bg-slate-800/20 border-2 border-dashed border-slate-700 rounded-xl">
              <PlayCircle size={48} className="text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-300">No Playlists Created</h3>
              <p className="text-slate-500 text-sm mt-1">Organize your media into loops for your screens.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Playlists;
