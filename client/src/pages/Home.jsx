import React, { useEffect, useState } from "react";
import { addTrackToPlaylist, fetchTracks, getUserPlaylists } from "../services/api";
import { Play , Plus} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMusic = async () => {
      try {
        setLoading(true);
        const { data } = await fetchTracks(); // Hitting Node.js Backend
        console.log("API Response:", data);

        // Safety check: ensure data.data exists before setting
        if (data && data.data) {
          setTracks(data.data);
        } else {
          setError("Invalid data format received");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load music. Is the backend running?");
      } finally {
        setLoading(false); // <--- CRITICAL FIX: Stop loading whether success or fail
      }
    };

    loadMusic();
  }, []);

  const handleAddToPlaylist = async (e, trackId) => {
    e.stopPropagation(); // Stop the card click (don't play music)

    if (!user) return alert("Please login first");

    // 1. Get User's Playlists
    // (In a real app, show a modal. For MVP, we use a simple prompt logic)
    try {
      const { data } = await getUserPlaylists(user.id);
      const playlists = data.data;

      if (playlists.length === 0) return alert("Create a playlist first!");

      // Simple prompt for MVP
      const playlistName = prompt(
        `Type the name of the playlist to add this song to:\n\n${playlists
          .map((p) => "- " + p.name)
          .join("\n")}`
      );

      const selectedPlaylist = playlists.find(
        (p) => p.name.toLowerCase() === playlistName?.toLowerCase()
      );

      if (selectedPlaylist) {
        await addTrackToPlaylist(selectedPlaylist.id, trackId);
        alert("Added to playlist!");
      } else if (playlistName) {
        alert("Playlist not found.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add to playlist");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-text-muted animate-pulse">
        Loading your mix...
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-red-500 bg-red-500/10 rounded-lg border border-red-500/20 m-4">
        Error: {error}
      </div>
    );

  return (
    <div className="space-y-10 pb-24">
      {" "}
      {/* Added padding bottom for player space */}
      {/* Featured Banner */}
      <div className="relative h-[300px] w-full rounded-xl bg-gradient-to-br from-bg-card to-bg-subtle border border-border-subtle p-8 flex flex-col justify-end overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Play size={200} fill="white" stroke="none" />
        </div>
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            Featured Track
          </span>
          <h1 className="text-5xl font-bold mb-4 tracking-tighter">
            Cyber City
          </h1>
          <p className="text-text-muted max-w-lg text-lg mb-6">
            Experience the future of sound.
          </p>
        </div>
      </div>
      {/* Real Data Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 border-b border-border-subtle pb-4">
          <h2 className="text-2xl font-bold tracking-tight">Trending Now</h2>
        </div>

        {tracks.length === 0 ? (
          <div className="text-text-muted italic">
            No tracks found. Did you run the seed script?
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {tracks.map((track) => (
              <div
                key={track.id}
              onClick={() => playTrack(track, tracks)}
                className="group cursor-pointer"
              >
                <div className="aspect-square bg-bg-card rounded-md border border-border-subtle mb-3 overflow-hidden group-hover:border-border-highlight transition-colors relative">
                  <img
                    src={track.cover_url || "https://placehold.co/400"}
                    alt={track.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />

                  {/* Play Overlay */}
         
                  <div className="absolute bottom-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                    onClick={(e) => handleAddToPlaylist(e, track.id)}
                    className="w-10 my-1 h-10 bg-zinc-800/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-zinc-700 hover:scale-110 transition-all text-white"
                    title="Add to Playlist"
                  >
                    <Plus size={18} />
                  </button> <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Play
                        size={20}
                        fill="white"
                        className="ml-1 text-white"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-white truncate text-sm">
                  {track.title}
                </h3>
                <p className="text-xs text-text-muted mt-1">{track.artist}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
