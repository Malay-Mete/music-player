import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseId: text("firebase_id").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull(),
});

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const playlistTracks = pgTable("playlist_tracks", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").references(() => playlists.id).notNull(),
  videoId: text("video_id").notNull(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull(),
  position: integer("position").notNull()
});

export const likedSongs = pgTable("liked_songs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  videoId: text("video_id").notNull(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users);
export const insertPlaylistSchema = createInsertSchema(playlists).pick({
  name: true,
  userId: true
});
export const insertPlaylistTrackSchema = createInsertSchema(playlistTracks).pick({
  playlistId: true,
  videoId: true,
  title: true,
  thumbnail: true,
  position: true
});
export const insertLikedSongSchema = createInsertSchema(likedSongs).pick({
  userId: true,
  videoId: true,
  title: true,
  thumbnail: true
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type PlaylistTrack = typeof playlistTracks.$inferSelect;
export type InsertPlaylistTrack = z.infer<typeof insertPlaylistTrackSchema>;
export type LikedSong = typeof likedSongs.$inferSelect;
export type InsertLikedSong = z.infer<typeof insertLikedSongSchema>;