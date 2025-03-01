import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertPlaylistSchema, insertPlaylistTrackSchema, insertLikedSongSchema } from "@shared/schema";
import type { User } from "firebase/auth";

declare module "express-session" {
  interface SessionData {
    user?: User;
  }
}

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // User routes
  app.post("/api/auth", async (req, res) => {
    const firebaseUser = req.body;
    let user = await storage.getUserByFirebaseId(firebaseUser.uid);

    if (!user) {
      user = await storage.createUser({
        firebaseId: firebaseUser.uid,
        displayName: firebaseUser.displayName || "Anonymous",
        email: firebaseUser.email || ""
      });
    }

    req.session.user = firebaseUser;
    res.json(user);
  });

  // Playlist routes
  app.get("/api/playlists", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUserByFirebaseId(req.session.user.uid);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const playlists = await storage.getPlaylists(user.id);
    res.json(playlists);
  });

  app.post("/api/playlists", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUserByFirebaseId(req.session.user.uid);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const validation = insertPlaylistSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid playlist data" });
    }

    const playlist = await storage.createPlaylist({
      ...validation.data,
      userId: user.id
    });
    res.json(playlist);
  });

  app.get("/api/playlists/:id", async (req, res) => {
    const playlist = await storage.getPlaylist(parseInt(req.params.id));
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.json(playlist);
  });

  app.get("/api/playlists/:id/tracks", async (req, res) => {
    const tracks = await storage.getPlaylistTracks(parseInt(req.params.id));
    res.json(tracks);
  });

  app.post("/api/playlists/:id/tracks", async (req, res) => {
    const validation = insertPlaylistTrackSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid track data" });
    }

    const track = await storage.addTrackToPlaylist({
      ...validation.data,
      playlistId: parseInt(req.params.id)
    });
    res.json(track);
  });

  // Liked songs routes
  app.get("/api/liked-songs", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUserByFirebaseId(req.session.user.uid);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const likedSongs = await storage.getLikedSongs(user.id);
    res.json(likedSongs);
  });

  app.post("/api/liked-songs", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUserByFirebaseId(req.session.user.uid);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const validation = insertLikedSongSchema.safeParse({
      ...req.body,
      userId: user.id
    });

    if (!validation.success) {
      return res.status(400).json({ message: "Invalid song data" });
    }

    const likedSong = await storage.addLikedSong(validation.data);
    res.json(likedSong);
  });

  app.delete("/api/liked-songs/:videoId", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUserByFirebaseId(req.session.user.uid);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    await storage.removeLikedSong(user.id, req.params.videoId);
    res.status(204).send();
  });

  app.get("/api/liked-songs/:videoId", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUserByFirebaseId(req.session.user.uid);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isLiked = await storage.isLikedSong(user.id, req.params.videoId);
    res.json({ isLiked });
  });

  return httpServer;
}