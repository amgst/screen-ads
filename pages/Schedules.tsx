
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Clock, Monitor, PlaySquare, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import { store } from '../services/mockStore';
import { Schedule } from '../types';

const DAYS_OF_WEEK = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

const Schedules = () => {
  const [schedules, setSchedules] = useState(store.getSchedules());
  const [screens, setScreens] = useState(store.getScreens());
  const [playlists, setPlaylists] = useState(store.getPlaylists());
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    screenId: '',
    playlistId: '',
    startTime: '09:00',
    endTime: '17:00',
    days: [1, 2, 3, 4, 5] as number[],
  });

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setSchedules([...store.getSchedules()]);
      setScreens([...store.getScreens()]);
      setPlaylists([...store.getPlaylists()]);
    });

    // Update time every minute to refresh active badges
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      unsub();
      clearInterval(timer);
    };
  }, []);

  const isScheduleActive = (schedule: Schedule) => {
    const day = currentTime.getDay();
    const time = currentTime.getHours().toString().padStart(2, '0') + ':' + 
                 currentTime.getMinutes().toString().padStart(2, '0');
    
    const isToday = schedule.days.includes(day);
    const isInTimeRange = time >= schedule.startTime && time <= schedule.endTime;
    
    return isToday && isInTimeRange;
  };

  const handleToggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.screenId || !formData.playlistId) return;

    store.addSchedule(formData);
    setIsAdding(false);
    setFormData({
      screenId: '',
      playlistId: '',
      startTime: '09:00',
      endTime: '17:00',
      days: [1, 2, 3, 4, 5],
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      store.deleteSchedule(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Schedules</h1>
          <p className="text-slate-400 mt-1">Automate content delivery by time and day.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>New Schedule</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 animate-in fade-in slide-in-from-top-4 duration-300 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Create New Schedule</h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Target Screen</label>
                <select 
                  value={formData.screenId}
                  onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select Screen</option>
                  {screens.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Playlist to Show</label>
                <select 
                  value={formData.playlistId}
                  onChange={(e) => setFormData({ ...formData, playlistId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select Playlist</option>
                  {playlists.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Start Time</label>
                  <input 
                    type="time" 
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">End Time</label>
                  <input 
                    type="time" 
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-400">Active Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleToggleDay(day.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      formData.days.includes(day.value)
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              <div className="pt-6">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition-colors">
                  Create Schedule
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {schedules.map(schedule => {
          const screen = screens.find(s => s.id === schedule.screenId);
          const playlist = playlists.find(p => p.id === schedule.playlistId);
          const active = isScheduleActive(schedule);

          return (
            <div 
              key={schedule.id} 
              className={`relative bg-slate-800 border transition-all duration-300 rounded-xl p-6 space-y-4 hover:border-slate-500 group ${
                active ? 'border-green-500/50 ring-1 ring-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-slate-700'
              }`}
            >
              {active && (
                <div className="absolute -top-3 right-4 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 shadow-lg animate-pulse uppercase tracking-widest">
                  <CheckCircle2 size={10} />
                  Active Now
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 ${active ? 'text-green-400' : 'text-blue-400'}`}>
                    <Clock size={16} />
                    <span className="text-sm font-bold uppercase tracking-wider">{schedule.startTime} - {schedule.endTime}</span>
                  </div>
                  <h3 className="text-lg font-bold">{playlist?.name || 'Unknown Playlist'}</h3>
                </div>
                <button 
                  onClick={() => handleDelete(schedule.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400">
                  <Monitor size={16} />
                  <span className="text-sm">Displaying on <span className="text-slate-100 font-medium">{screen?.name || 'Deleted Screen'}</span></span>
                </div>
                
                <div className="flex gap-1">
                  {DAYS_OF_WEEK.map(day => (
                    <div
                      key={day.value}
                      className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold transition-colors ${
                        schedule.days.includes(day.value)
                          ? (active ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-blue-600/20 text-blue-400 border border-blue-600/30')
                          : 'bg-slate-900 text-slate-600 border border-slate-800'
                      }`}
                    >
                      {day.label[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {schedules.length === 0 && !isAdding && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-slate-800/20 border-2 border-dashed border-slate-700 rounded-xl">
            <AlertCircle size={48} className="text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-300">No Schedules Active</h3>
            <p className="text-slate-500 text-sm mt-1">Create your first automated schedule to save time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedules;
