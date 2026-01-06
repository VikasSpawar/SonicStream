import React, { useState, useEffect } from 'react';
import { Home, Search, Library, Plus, Heart, ListMusic, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createPlaylist, getUserPlaylists } from '../services/api';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);

  // 1. Fetch Playlists when user logs in
  useEffect(() => {
    if (user) {
      getUserPlaylists(user.id)
        .then(({ data }) => {
            if(data && data.data) setPlaylists(data.data);
        })
        .catch(err => console.error("Failed to fetch playlists", err));
    } else {
        setPlaylists([]);
    }
  }, [user]);

  // 2. Handle Create Playlist
  const handleCreate = async () => {
    if (!user) return navigate('/login');
    
    const name = prompt("Enter Playlist Name:");
    if (!name) return;

    try {
      const { data } = await createPlaylist(user.id, name);
      if (data && data.data) {
          setPlaylists([data.data, ...playlists]); // Add new playlist to top of list
      }
    } catch (err) {
      alert("Error creating playlist. Make sure backend is running.");
      console.error(err);
    }
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
        ${isActive 
            ? 'bg-bg-card text-white border border-border-subtle' 
            : 'text-text-muted hover:text-white hover:bg-bg-hover'}`}
      >
        <Icon size={18} className={isActive ? "text-primary" : "text-text-muted"} />
        {label}
      </Link>
    );
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Logo area */}
      <div className="flex items-center gap-2 px-2 py-4 mb-6">
        <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
        </div>
        <span className="font-bold tracking-tight text-lg">SonicStream</span>
      </div>

      {/* Main Navigation */}
      <div className="space-y-1">
        <NavItem to="/" icon={Home} label="Home" />
        <NavItem to="/search" icon={Search} label="Search" />
        <NavItem to="/library" icon={Library} label="Library" />
      </div>

      {/* Your Music Section */}
      <div className="mt-8">
        <p className="px-3 text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Your Music</p>
        <div className="space-y-1">
            <NavItem to="/liked" icon={Heart} label="Liked Songs" />
            <NavItem to="/playlists" icon={ListMusic} label="Playlists" />
        </div>
      </div>
      
      {/* Playlist Creation & List (Takes up remaining space) */}
      <div className="mt-6 pt-4 border-t border-border-subtle flex-1 flex flex-col min-h-0">
        <button 
            onClick={handleCreate}
            className="flex items-center gap-2 text-xs font-medium text-text-muted hover:text-white transition-colors w-full px-2 mb-4 group"
        >
            <div className="bg-bg-card p-1 rounded-sm border border-border-subtle group-hover:border-white transition-colors">
                <Plus size={14} />
            </div>
            Create New Playlist
        </button>

        {/* Scrollable List */}
        <div className="overflow-y-auto custom-scrollbar space-y-1 pr-2">
            {playlists.map((pl) => (
                <Link 
                    key={pl.id} 
                    to={`/playlist/${pl.id}`}
                    className="block px-2 py-1.5 text-sm text-text-muted hover:text-white truncate rounded-md hover:bg-bg-card/50 transition-colors"
                >
                    {pl.name}
                </Link>
            ))}
            {playlists.length === 0 && user && (
                <p className="text-xs text-text-muted px-2 italic">No playlists yet.</p>
            )}
        </div>
      </div>

      {/* User Profile (Fixed at Bottom) */}
      <div className="mt-auto pt-4 border-t border-border-subtle">
        {user ? (
            <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                        {user.email ? user.email[0].toUpperCase() : 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                        <p className="text-xs text-text-muted">Free Plan</p>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    className="flex items-center gap-3 px-2 text-sm text-text-muted hover:text-white w-full transition-colors"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        ) : (
            <Link to="/login">
                <button className="w-full bg-white text-black font-bold py-2 rounded-md hover:bg-gray-200 transition-colors">
                    Log In
                </button>
            </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;