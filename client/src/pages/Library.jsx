import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { getUserPlaylists, getLikedSongs } from '../services/api';
import { Play, Music, Heart, ListMusic } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Library = () => {
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const location = useLocation(); // <--- 1. Get current URL
  
  // 2. Determine initial tab based on URL
  const getInitialTab = () => {
    if (location.pathname === '/liked') return 'liked';
    return 'playlists'; // Default for '/library' and '/playlists'
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 3. Update tab if URL changes (e.g. clicking Sidebar links)
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);

  // Fetch data whenever Tab or User changes
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'playlists') {
          const res = await getUserPlaylists(user.id);
          // Safety check for data structure
          setData(res.data?.data || []);
        } else {
          const res = await getLikedSongs(user.id);
          setData(res.data?.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, activeTab]);

  const TabBtn = ({ name, value, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
        activeTab === value
          ? 'bg-white text-black'
          : 'bg-bg-card text-text-muted hover:bg-bg-hover hover:text-white'
      }`}
    >
      <Icon size={18} /> {name}
    </button>
  );

  return (
    <div className="pb-32 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Your Library</h1>
        
        {/* Tabs */}
        <div className="flex items-center gap-4">
          <TabBtn name="Playlists" value="playlists" icon={ListMusic} />
          <TabBtn name="Liked Songs" value="liked" icon={Heart} />
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-text-muted animate-pulse">Loading library...</div>
      ) : data.length === 0 ? (
        <div className="p-10 text-center text-text-muted bg-bg-card rounded-xl border border-border-subtle">
          <p>Nothing here yet.</p>
          {activeTab === 'playlists' && <p className="text-xs mt-2">Create one from the sidebar!</p>}
          {activeTab === 'liked' && <p className="text-xs mt-2">Go hit the heart on some songs!</p>}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          
          {/* RENDER PLAYLISTS */}
          {activeTab === 'playlists' && data.map((playlist) => (
            <Link to={`/playlist/${playlist.id}`} key={playlist.id} className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-black rounded-lg border border-border-subtle mb-3 flex items-center justify-center group-hover:border-white transition-colors shadow-lg">
                <Music size={40} className="text-text-muted group-hover:text-white" />
              </div>
              <h3 className="font-bold truncate text-white">{playlist.name}</h3>
              <p className="text-sm text-text-muted">By You</p>
            </Link>
          ))}

          {/* RENDER LIKED SONGS */}
          {activeTab === 'liked' && data.map((track) => (
             <div 
                key={track.id} 
                onClick={() => playTrack(track, data)} // Pass full liked list as queue
                className="group cursor-pointer"
             >
                <div className="aspect-square bg-bg-card rounded-md border border-border-subtle mb-3 overflow-hidden relative shadow-lg">
                    <img src={track.cover_url || "https://placehold.co/400"} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                            <Play size={20} fill="black" className="ml-1 text-black" />
                        </div>
                    </div>
                </div>
                <h3 className="font-bold truncate text-white">{track.title}</h3>
                <p className="text-sm text-text-muted">{track.artist}</p>
             </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Library;