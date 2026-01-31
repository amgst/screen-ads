
export type ScreenStatus = 'online' | 'offline' | 'pending';

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  duration: number; // in seconds
  createdAt: number;
  storagePath?: string;
}

export interface PlaylistItem {
  id: string;
  mediaId: string;
  duration: number; // custom duration per playlist entry
}

export interface Playlist {
  id: string;
  name: string;
  items: PlaylistItem[];
  userId: string;
}

export interface Screen {
  id: string;
  name: string;
  pairingCode: string;
  status: ScreenStatus;
  currentPlaylistId: string | null;
  lastHeartbeat: number;
  userId: string | null;
}

export interface Schedule {
  id: string;
  playlistId: string;
  screenId: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  days: number[]; // 0-6 (Sun-Sat)
}
