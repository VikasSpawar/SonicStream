const supabase = require('../config/supabase');

// 1. Create a New Playlist
exports.createPlaylist = async (req, res) => {
  try {
    const { userId, name, description } = req.body;

    const { data, error } = await supabase
      .from('playlists')
      .insert([{ user_id: userId, name, description }])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get All Playlists for a User
exports.getUserPlaylists = async (req, res) => {
  try {
    const { userId } = req.query; // ?userId=123

    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Add a Track to a Playlist
exports.addTrackToPlaylist = async (req, res) => {
  try {
    const { playlistId, trackId } = req.body;

    const { data, error } = await supabase
      .from('playlist_tracks')
      .insert([{ playlist_id: playlistId, track_id: trackId }])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, message: "Track added!" });
  } catch (error) {
    // Check for duplicate key error (song already in playlist)
    if (error.code === '23505') {
        return res.status(400).json({ success: false, message: "Song already in playlist" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Get Playlist Details (with Tracks)
exports.getPlaylistDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // First get playlist info
    const { data: playlist, error: plError } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', id)
      .single();

    if (plError) throw plError;

    // Then get the actual tracks
    // This is a complex join, simplifying by fetching the junction table + tracks
    const { data: tracks, error: tError } = await supabase
      .from('playlist_tracks')
      .select(`
        track_id,
        tracks ( * )
      `)
      .eq('playlist_id', id);

    if (tError) throw tError;

    // Clean up the structure
    const cleanedTracks = tracks.map(item => item.tracks);

    res.status(200).json({ success: true, data: { ...playlist, tracks: cleanedTracks } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};