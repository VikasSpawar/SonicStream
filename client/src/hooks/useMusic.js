import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const useMusic = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const { data, error } = await supabase
          .from('tracks')
          .select('*')
          .limit(20);

        if (error) throw error;
        setTracks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  return { tracks, loading, error };
};