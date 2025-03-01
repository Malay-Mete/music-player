import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, Search, Library, LogOut, Menu, Heart, Plus } from 'lucide-react';
import { signOut } from '@/lib/firebase';
import { useState } from 'react';

export function SideNav() {
  const [location] = useLocation();

  return (
    <div className="hidden md:flex flex-col w-64 h-full bg-black/90 border-r border-white/5">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12.5v6l5-3-5-3z"></path>
          </svg>
          Music Stream
        </h1>
      </div>

      <nav className="flex-1 px-3 py-2">
        <div className="space-y-1">
          <Link href="/" className="flex items-center">
            <Home size={20} className="mr-3" />
            Home
          </Link>
          <Link href="/search" className="flex items-center">
            <Search size={20} className="mr-3" />
            Search
          </Link>
        </div>

        <div className="mt-8 bg-white/5 rounded-md p-4">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center">
            <Library size={20} className="mr-3" />
            Your Library
          </h2>
          <div className="space-y-3">
            <Link href="/liked-songs" className="flex items-center pl-2">
              <div className="w-8 h-8 mr-3 rounded-md bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
                <Heart size={14} fill="white" />
              </div>
              Liked Songs
            </Link>
            {/* Add more library items here */}
          </div>
        </div>

        <div className="mt-8">
          <div className="px-3 pb-2">
            <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">Playlists</h3>
            <button className="w-full text-left py-2 text-sm font-semibold text-white/80 hover:text-white flex items-center transition-colors">
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center mr-3">
                <Plus size={14} />
              </div>
              Create Playlist
            </button>
          </div>
        </div>
      </nav>

      <div className="p-4">
        <div className="text-xs text-white/50 hover:text-white transition-colors">
          <a href="#" className="inline-block mr-2 hover:underline">Privacy</a>
          <a href="#" className="inline-block hover:underline">Terms</a>
        </div>
      </div>
    </div>
  );
}