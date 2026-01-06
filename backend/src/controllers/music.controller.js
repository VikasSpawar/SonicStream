const supabase = require('../config/supabase');

exports.getAllTracks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*, categories(name)')
      .limit(20);

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getTrending = async (req, res) => {
    // Logic for trending (e.g., random sort for now)
    try {
        const { data, error } = await supabase.from('tracks').select('*').limit(5);
        if (error) throw error;
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.searchTracks = async (req, res) => {
  try {
    const { query } = req.query; // Get 'query' from URL (?query=cyber)
    
    if (!query) {
        return res.status(400).json({ success: false, message: "Query parameter required" });
    }

    // Supabase Text Search (ilike = case insensitive)
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .ilike('title', `%${query}%`) // Search Title
      // .or(`artist.ilike.%${query}%`) // Optional: Search Artist too
      .limit(10);

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};