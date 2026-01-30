
import { Screen, MediaItem, Playlist, Schedule, PlaylistItem } from '../types';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  setDoc,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

const IMGBB_API_KEY = '3666496bd414d7fd557409414f034abe'; // Provided by user

class FirebaseStore {
  private screens: Screen[] = [];
  private media: MediaItem[] = [];
  private playlists: Playlist[] = [];
  private schedules: Schedule[] = [];

  private listeners: (() => void)[] = [];

  constructor() {
    this.initListeners();
  }

  private initListeners() {
    // Media Listener
    onSnapshot(collection(db, 'media'), (snapshot) => {
      this.media = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaItem));
      this.notify();
    });

    // Playlists Listener
    onSnapshot(collection(db, 'playlists'), (snapshot) => {
      this.playlists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Playlist));
      this.notify();
    });

    // Screens Listener
    onSnapshot(collection(db, 'screens'), (snapshot) => {
      this.screens = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Screen));
      this.notify();
    });

    // Schedules Listener
    onSnapshot(collection(db, 'schedules'), (snapshot) => {
      this.schedules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Schedule));
      this.notify();
    });
  }

  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  getScreens() { return this.screens; }
  getMedia() { return this.media; }
  getPlaylists() { return this.playlists; }
  getSchedules() { return this.schedules; }

  async addScreen(name: string, pairingCode: string) {
    const q = query(collection(db, 'screens'), where('pairingCode', '==', pairingCode));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const screenDoc = snapshot.docs[0];
      await updateDoc(doc(db, 'screens', screenDoc.id), {
        name,
        userId: 'user1',
        status: 'online'
      });
    } else {
      await addDoc(collection(db, 'screens'), {
        name,
        pairingCode,
        status: 'online',
        currentPlaylistId: null,
        lastHeartbeat: Date.now(),
        userId: 'user1'
      });
    }
  }

  async deleteScreen(id: string) {
    await deleteDoc(doc(db, 'screens', id));
    // Clean up schedules for this screen
    const q = query(collection(db, 'schedules'), where('screenId', '==', id));
    const snapshot = await getDocs(q);
    snapshot.forEach(async (d) => {
      await deleteDoc(doc(db, 'schedules', d.id));
    });
  }

  async uploadFile(file: File) {
    // Note: ImgBB only supports images.
    if (!file.type.startsWith('image')) {
      throw new Error('ImgBB only supports image uploads.');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload to ImgBB failed');
    }

    const result = await response.json();
    const url = result.data.url;
    const deleteUrl = result.data.delete_url;

    await this.addMedia(file.name, url, 'image', deleteUrl);
    return url;
  }

  async addMedia(name: string, url: string, type: 'image' | 'video', externalDeleteUrl?: string) {
    await addDoc(collection(db, 'media'), {
      name,
      type,
      url,
      externalDeleteUrl: externalDeleteUrl || null,
      duration: 10,
      createdAt: Date.now()
    });
  }

  async deleteMedia(id: string) {
    await deleteDoc(doc(db, 'media', id));
  }

  async addPlaylist(name: string, items: PlaylistItem[]) {
    await addDoc(collection(db, 'playlists'), {
      name,
      userId: 'user1',
      items
    });
  }

  async deletePlaylist(id: string) {
    await deleteDoc(doc(db, 'playlists', id));
  }

  async assignPlaylistToScreen(screenId: string, playlistId: string | null) {
    await updateDoc(doc(db, 'screens', screenId), {
      currentPlaylistId: playlistId
    });
  }

  async updateHeartbeat(pairingCode: string) {
    const q = query(collection(db, 'screens'), where('pairingCode', '==', pairingCode));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await updateDoc(doc(db, 'screens', snapshot.docs[0].id), {
        lastHeartbeat: Date.now(),
        status: 'online'
      });
    }
  }

  async addSchedule(schedule: Omit<Schedule, 'id'>) {
    await addDoc(collection(db, 'schedules'), {
      ...schedule
    });
  }

  async deleteSchedule(id: string) {
    await deleteDoc(doc(db, 'schedules', id));
  }
}

export const store = new FirebaseStore();
