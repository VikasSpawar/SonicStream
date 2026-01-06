import React, { useState, useEffect } from 'react';
import { Play, Heart, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { toggleLike, getLikedSongs } from '../../services/api';

const PlayerBar = () => {
  const { 
    currentTrack, isPlaying, togglePlay, progress, duration, seek,
    nextTrack, prevTrack, changeVolume, volume 
  } = usePlayer();

  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  // 1. Check if the current song is ALREADY liked when track changes
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user || !currentTrack) {
        setIsLiked(false);
        return;
      }
      try {
        // Fetch user's liked songs to check status
        // (In a larger app, you'd optimize this to check just one ID)
        const { data } = await getLikedSongs(user.id);
        const likedTracks = data.data || [];
        const found = likedTracks.some(t => t.id === currentTrack.id);
        setIsLiked(found);
      } catch (err) {
        console.error("Error checking like status", err);
      }
    };
    checkLikeStatus();
  }, [currentTrack, user]);

  // 2. Handle Like Click
  const handleLike = async () => {
    if (!user) return alert("Please login to like songs");
    if (!currentTrack) return;

    // Optimistic Update (Change UI instantly)
    const previousState = isLiked;
    setIsLiked(!isLiked);

    try {
      await toggleLike(user.id, currentTrack.id);
    } catch (err) {
      // Revert if API fails
      setIsLiked(previousState);
      console.error("Like failed", err);
    }
  };

  if (!currentTrack) return null;

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl h-20 bg-bg-card border border-border-highlight rounded-2xl shadow-2xl flex items-center px-4 md:px-6 justify-between z-50 backdrop-blur-md bg-opacity-95">
      
      {/* 1. Track Info */}
      <div className="flex items-center gap-4 w-1/3 min-w-0">
        <img 
            src={currentTrack.cover_url} 
            className={`h-12 w-12 rounded-md object-cover border border-border-subtle ${isPlaying ? 'animate-spin-slow' : ''}`} 
            alt="Art"
        />
        <div className="hidden md:block overflow-hidden">
          <h4 className="text-white text-sm font-bold truncate">{currentTrack.title}</h4>
          <p className="text-text-muted text-xs truncate">{currentTrack.artist}</p>
        </div>
        
        {/* Like Button */}
        <button onClick={handleLike} className="hover:scale-110 transition-transform ml-2">
            <Heart size={20} className={isLiked ? "fill-primary text-primary" : "text-text-muted hover:text-white"} />
        </button>
      </div>

      {/* 2. Controls */}
      <div className="flex flex-col items-center w-1/3 gap-1">
        <div className="flex items-center gap-4">
            <button onClick={prevTrack} className="text-text-muted hover:text-white transition-colors">
                <SkipBack size={20} />
            </button>
            
            <button 
                onClick={togglePlay}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
                {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" className="ml-0.5" />}
            </button>

            <button onClick={nextTrack} className="text-text-muted hover:text-white transition-colors">
                <SkipForward size={20} />
            </button>
        </div>

        <div className="w-full flex items-center gap-2 text-xs text-text-muted font-mono">
            <span>{formatTime(progress)}</span>
            <input 
                type="range" 
                min="0" 
                max={duration || 0} 
                value={progress}
                onChange={(e) => seek(Number(e.target.value))}
                className="w-full h-1 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Volume */}
      <div className="w-1/3 flex justify-end items-center gap-2 group">
        <button onClick={() => changeVolume(volume > 0 ? 0 : 50)}>
            {volume === 0 ? <VolumeX size={18} className="text-text-muted" /> : <Volume2 size={18} className="text-text-muted" />}
        </button>
        <input 
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => changeVolume(e.target.value)}
            className="w-20 h-1 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-white opacity-50 group-hover:opacity-100 transition-opacity"
        />
      </div>

    </div>
  );
};

export default PlayerBar;