import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // Range 0.0 to 1.0
  
  // NEW: Queue State
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const audioRef = useRef(new Audio());

  // 1. Play a Track (Updated to handle Queues)
  // When you click a song on Home, we pass the specific song AND the list it came from
  const playTrack = (track, newQueue = []) => {
    // Determine index
    let index = -1;
    
    // If a new queue is provided, set it
    if (newQueue.length > 0) {
        setQueue(newQueue);
        index = newQueue.findIndex(t => t.id === track.id);
    } else {
        // If playing from existing queue
        index = queue.findIndex(t => t.id === track.id);
    }

    setCurrentIndex(index);
    setCurrentTrack(track);
    
    // Audio Logic
    audioRef.current.src = track.audio_url;
    audioRef.current.volume = volume; // Set initial volume
    audioRef.current.load();
    
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(error => console.error("Playback failed:", error));
    }
  };

  // 2. Next Track Logic
  const nextTrack = () => {
    if (currentIndex < queue.length - 1) {
        playTrack(queue[currentIndex + 1]); // Don't pass newQueue, keep existing
    } else {
        console.log("End of queue");
        // Optional: Loop back to start?
        // playTrack(queue[0]); 
    }
  };

  // 3. Previous Track Logic
  const prevTrack = () => {
    if (currentIndex > 0) {
        playTrack(queue[currentIndex - 1]);
    } else {
        // If at start, restart song
        seek(0);
    }
  };

  // 4. Volume Control
  const changeVolume = (val) => {
    // val is 0 to 100 from slider, convert to 0.0 to 1.0
    const newVol = val / 100;
    setVolume(newVol);
    audioRef.current.volume = newVol;
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  // Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => {
        setProgress(audio.currentTime);
        setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
        // Auto-play next song when current ends
        if (currentIndex < queue.length - 1) {
            nextTrack(); 
        } else {
            setIsPlaying(false);
        }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('ended', handleEnded); // <--- Auto Next

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, queue]); // Re-bind if index changes to ensure 'next' works

  const value = {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    playTrack,
    togglePlay,
    seek,
    nextTrack,
    prevTrack,
    changeVolume
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => useContext(PlayerContext);