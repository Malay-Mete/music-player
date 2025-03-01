import { type User, type InsertUser, type Playlist, type InsertPlaylist, type PlaylistTrack, type InsertPlaylistTrack } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseId(firebaseId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Playlist operations
  getPlaylists(userId: number): Promise<Playlist[]>;
  getPlaylist(id: number): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  deletePlaylist(id: number): Promise<void>;
  
  // Playlist track operations
  getPlaylistTracks(playlistId: number): Promise<PlaylistTrack[]>;
  addTrackToPlaylist(track: InsertPlaylistTrack): Promise<PlaylistTrack>;
  removeTrackFromPlaylist(id: number): Promise<void>;
  updateTrackPosition(id: number, position: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private playlists: Map<number, Playlist>;
  private playlistTracks: Map<number, PlaylistTrack>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.playlists = new Map();
    this.playlistTracks = new Map();
    this.currentIds = { user: 1, playlist: 1, track: 1 };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseId === firebaseId
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentIds.user++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async getPlaylists(userId: number): Promise<Playlist[]> {
    return Array.from(this.playlists.values()).filter(
      (playlist) => playlist.userId === userId
    );
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    const id = this.currentIds.playlist++;
    const newPlaylist = {
      ...playlist,
      id,
      createdAt: new Date()
    };
    this.playlists.set(id, newPlaylist);
    return newPlaylist;
  }

  async deletePlaylist(id: number): Promise<void> {
    this.playlists.delete(id);
    // Delete associated tracks
    const trackIds = Array.from(this.playlistTracks.values())
      .filter(track => track.playlistId === id)
      .map(track => track.id);
    trackIds.forEach(trackId => this.playlistTracks.delete(trackId));
  }

  async getPlaylistTracks(playlistId: number): Promise<PlaylistTrack[]> {
    return Array.from(this.playlistTracks.values())
      .filter(track => track.playlistId === playlistId)
      .sort((a, b) => a.position - b.position);
  }

  async addTrackToPlaylist(track: InsertPlaylistTrack): Promise<PlaylistTrack> {
    const id = this.currentIds.track++;
    const newTrack = { ...track, id };
    this.playlistTracks.set(id, newTrack);
    return newTrack;
  }

  async removeTrackFromPlaylist(id: number): Promise<void> {
    this.playlistTracks.delete(id);
  }

  async updateTrackPosition(id: number, position: number): Promise<void> {
    const track = this.playlistTracks.get(id);
    if (track) {
      this.playlistTracks.set(id, { ...track, position });
    }
  }
}

export const storage = new MemStorage();
