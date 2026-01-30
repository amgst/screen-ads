
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Loader2, Wifi, WifiOff, Maximize, PlayCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import { store } from '../services/mockStore';
import { Playlist, MediaItem, Screen, Schedule } from '../types';

const Player = () => {
  const [pairingCode] = useState(() => {
    const saved = localStorage.getItem('lumina_pairing_code');
    if (saved) return saved;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('lumina_pairing_code', newCode);
    return newCode;
  });
  const [screen, setScreen] = useState<Screen | undefined>(store.getScreens().find(s => s.pairingCode === pairingCode));
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentTime, setCurrentTime] = useState(new Date());

  const timerRef = useRef<any>(null);
  const playlistIdRef = useRef<string | null>(null);

  // Helper to determine active playlist based on schedules or default screen assignment
  const getActivePlaylistId = (screen: Screen, schedules: Schedule[]) => {
    const now = new Date();
    const day = now.getDay();
    const time = now.getHours().toString().padStart(2, '0') + ':' +
      now.getMinutes().toString().padStart(2, '0');

    // Find active schedule for this screen
    const activeSchedule = schedules.find(sch =>
      sch.screenId === screen.id &&
      sch.days.includes(day) &&
      time >= sch.startTime &&
      time <= sch.endTime
    );

    return activeSchedule ? activeSchedule.playlistId : screen.currentPlaylistId;
  };

  useEffect(() => {
    const syncData = () => {
      const screens = store.getScreens();
      const schedules = store.getSchedules();
      const s = screens.find(x => x.pairingCode === pairingCode);
      setScreen(s);

      if (s) {
        const targetPlaylistId = getActivePlaylistId(s, schedules);

        if (targetPlaylistId !== playlistIdRef.current) {
          const playlists = store.getPlaylists();
          const p = playlists.find(pl => pl.id === targetPlaylistId);
          setCurrentPlaylist(p || null);
          setCurrentItemIndex(0);
          playlistIdRef.current = targetPlaylistId || null;
        }
      } else {
        setCurrentPlaylist(null);
        playlistIdRef.current = null;
      }
    };

    syncData();

    const unsub = store.subscribe(() => {
      syncData();
    });

    const heartbeat = setInterval(() => {
      store.updateHeartbeat(pairingCode);
      setCurrentTime(new Date()); // Refresh time-based logic every heartbeat
    }, 5000);

    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);

    return () => {
      unsub();
      clearInterval(heartbeat);
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pairingCode]);

  useEffect(() => {
    if (currentPlaylist && currentPlaylist.items.length > 0) {
      const currentItem = currentPlaylist.items[currentItemIndex];
      const duration = (currentItem?.duration || 10) * 1000;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setCurrentItemIndex((prev) => (prev + 1) % currentPlaylist.items.length);
      }, duration);
    }
  }, [currentItemIndex, currentPlaylist]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => { });
      setIsFullscreen(false);
    }
  };

  const BackButton = () => (
    <Link
      to="/admin"
      className="absolute top-6 left-6 z-50 flex items-center space-x-2 bg-black/40 hover:bg-black/80 text-white px-4 py-2 rounded-full backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100"
    >
      <ChevronLeft size={18} />
      <span className="text-sm font-semibold">Exit to Admin</span>
    </Link>
  );

  if (!screen || !screen.userId) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center relative group">
        <BackButton />
        <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 animate-pulse shadow-[0_0_50px_rgba(37,99,235,0.3)]">
          <Monitor size={48} />
        </div>
        <h1 className="text-4xl font-bold mb-4">LuminaSign Player</h1>
        <p className="text-slate-400 max-w-md mb-12">
          This device is ready to be paired. Open your admin dashboard and enter the code below to connect this screen.
        </p>
        <div className="bg-slate-900 border-2 border-blue-500 rounded-2xl p-8 mb-12">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-2">Pairing Code</div>
          <div className="text-7xl font-mono font-bold tracking-widest text-blue-400">{pairingCode}</div>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Loader2 size={16} className="animate-spin" />
          <span>Waiting for connection...</span>
        </div>
      </div>
    );
  }

  if (!currentPlaylist || currentPlaylist.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white relative group">
        <BackButton />
        <div className="text-center">
          <PlayCircle size={64} className="text-slate-800 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-700">No Content Assigned</h2>
          <p className="text-slate-800 text-sm mt-2">Assign a playlist or create a schedule from the dashboard.</p>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-4 bg-black/50 backdrop-blur rounded-full px-4 py-2 text-xs border border-white/10">
          <span className="text-slate-400">ID: {screen.name}</span>
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    );
  }

  const currentItem = currentPlaylist.items[currentItemIndex];
  const media = store.getMedia().find(m => m.id === currentItem?.mediaId);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center group">
      <BackButton />
      <div className="w-full h-full relative">
        {media?.type === 'image' ? (
          <img
            key={media.id}
            src={media.url}
            className="w-full h-full object-cover animate-in fade-in zoom-in-105 duration-1000"
            alt="Signage Content"
          />
        ) : media?.type === 'video' ? (
          <video
            key={media.id}
            src={media.url}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 text-sm">Media Loading or Missing...</p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 cursor-none hover:cursor-default">
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex justify-between items-start pointer-events-none">
          <div className="pl-32"> {/* Push right to clear back button */}
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Now Playing</div>
            <div className="text-xl font-bold text-white drop-shadow-md">{media?.name || 'Untitled Content'}</div>
            {playlistIdRef.current !== screen.currentPlaylistId && (
              <div className="text-[10px] text-green-400 font-bold uppercase mt-1">Scheduled Override Active</div>
            )}
          </div>
          <div className="flex gap-4 pointer-events-auto">
            {!isOnline && (
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                <WifiOff size={14} />
                Offline Mode
              </div>
            )}
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-black/40 hover:bg-black/60 rounded-lg text-white backdrop-blur border border-white/20 transition-all"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
              <Monitor size={24} className="text-slate-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-tight">{screen.name}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Signage Player Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
