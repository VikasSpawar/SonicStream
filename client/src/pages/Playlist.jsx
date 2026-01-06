import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlaylistDetails } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { Play, Clock, Music } from 'lucide-react';

const Playlist = () => {
  const { id } = useParams(); // Get ID from URL
  const { playTrack } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { data } = await getPlaylistDetails(id);
        setPlaylist(data.data);
      } catch (err) {
        console.error("Failed to load playlist", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="p-8 text-text-muted">Loading playlist...</div>;
  if (!playlist) return <div className="p-8 text-red-500">Playlist not found.</div>;

  return (
    <div className="pb-32">
      
      {/* 1. Playlist Header */}
      <div className="flex flex-col md:flex-row items-end gap-6 pb-8 border-b border-border-subtle">
        {/* Cover Art Placeholder */}
        <div className="w-52 h-52 bg-gradient-to-br from-indigo-800 to-purple-900 shadow-2xl rounded-lg flex items-center justify-center">
            <Music size={64} className="text-white/50" />
        </div>

        <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Playlist</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">{playlist.name}</h1>
            <p className="text-text-muted">{playlist.description || "No description provided."}</p>
            
            <div className="flex items-center gap-2 text-sm text-text-muted mt-2">
                <span className="text-white font-bold">You</span>
                <span>•</span>
                <span>{playlist.tracks?.length || 0} songs</span>
            </div>
        </div>
      </div>

      {/* 2. Controls */}
      <div className="py-6">
        <button className="w-14 h-14 bg-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg group">
            <Play size={28} fill="black" className="ml-1 text-black" />
        </button>
      </div>

      {/* 3. Tracks List (Table Layout) */}
      <div className="flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 text-sm text-text-muted border-b border-border-subtle mb-4">
            <span>#</span>
            <span>Title</span>
            <span>Date Added</span>
            <span className="flex justify-end"><Clock size={16} /></span>
        </div>

        {/* Songs */}
        {playlist.tracks && playlist.tracks.length > 0 ? (
            playlist.tracks.map((track, index) => (
                <div 
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-3 text-sm text-text-muted hover:bg-white/5 rounded-md cursor-pointer group items-center"
                >
                    <span className="group-hover:text-white">{index + 1}</span>
                    
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img src={track.cover_url} alt="" className="w-10 h-10 rounded-sm object-cover" />
                        <div className="flex flex-col">
                            <span className="text-white font-medium truncate">{track.title}</span>
                            <span className="text-xs group-hover:text-white truncate">{track.artist}</span>
                        </div>
                    </div>

                    <span className="text-xs">2 days ago</span>
                    
                    <span className="flex justify-end font-mono">
                        {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                    </span>
                </div>
            ))
        ) : (
            <div className="text-center py-20 text-text-muted">
                <p className="text-lg text-white mb-2">It's a bit empty here</p>
                <p>Find some songs to add to this playlist.</p>
            </div>
        )}
      </div>

    </div>
  );
};

export default Playlist;