
import React, { useState, useEffect } from 'react';
import { ImageIcon, Film, Plus, Trash2, Search, Filter, Sparkles, X } from 'lucide-react';
import { store } from '../services/mockStore';

const MediaLibrary = () => {
  const [media, setMedia] = useState(store.getMedia());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setMedia([...store.getMedia()]);
    });
    return unsub;
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await store.uploadFile(file);
      } catch (e) {
        console.error("Upload failed", e);
      }
    }
  };


  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? It will be removed from all playlists.`)) {
      store.deleteMedia(id);
    }
  };

  const filteredMedia = media.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Media Library</h1>
          <p className="text-slate-400 mt-1">Manage images, videos, and AI-generated slides.</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-lg">
            <Plus size={20} />
            <span>Upload Media</span>
            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
          </label>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search media..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center space-x-2 bg-slate-700 px-4 py-2 rounded-lg text-slate-300 hover:text-white transition-colors">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredMedia.map(item => (
          <div key={item.id} className="group relative bg-slate-800 border border-slate-700 rounded-xl overflow-hidden aspect-video hover:border-blue-500 transition-all shadow-md">
            {item.type === 'image' ? (
              <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                <Film size={32} className="text-slate-700" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
              <div className="text-sm font-semibold truncate text-white">{item.name}</div>
              <div className="text-[10px] text-slate-300 flex items-center justify-between mt-1">
                <span>{item.type.toUpperCase()} • {item.duration}s</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.name); }}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredMedia.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-800/20 rounded-xl border-2 border-dashed border-slate-700">
            <ImageIcon size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500">No media assets found</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default MediaLibrary;
