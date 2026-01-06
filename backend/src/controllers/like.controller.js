const supabase = require('../config/supabase');

exports.toggleLike = async (req, res) => {
  try {
    const { userId, trackId } = req.body;

    console.log(`Toggling like for User: ${userId}, Track: ${trackId}`);

    // 1. Check if already liked using maybeSingle() (Prevents crash if not found)
    const { data: existing, error: fetchError } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq('track_id', trackId)
      .maybeSingle(); // <--- CHANGED FROM .single() to .maybeSingle()

    if (fetchError) {
        console.error("Error checking like:", fetchError);
        throw fetchError;
    }

    if (existing) {
      // 2. UNLIKE (Delete)
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('track_id', trackId);
        
      if (deleteError) throw deleteError;
      
      console.log("Unliked successfully");
      return res.status(200).json({ success: true, status: 'unliked' });
      
    } else {
      // 3. LIKE (Insert)
      const { error: insertError } = await supabase
        .from('likes')
        .insert({ user_id: userId, track_id: trackId });
        
      if (insertError) {
          console.error("Insert Error:", insertError);
          throw insertError;
      }

      console.log("Liked successfully");
      return res.status(200).json({ success: true, status: 'liked' });
    }
  } catch (error) {
    console.error("Toggle Like Failed:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Liked Songs for User
exports.getLikedSongs = async (req, res) => {
  try {
    const { userId } = req.query;

    const { data, error } = await supabase
      .from('likes')
      .select(`
        created_at,
        track:tracks(*) 
      `) // Join with tracks table
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Flatten structure (Supabase returns { track: {...} })
    const tracks = data.map(item => item.track);

    res.status(200).json({ success: true, data: tracks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};