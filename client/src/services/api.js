import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Pointing to your Node Server
});

export const fetchTracks = () => API.get('/music');
export const fetchTrending = () => API.get('/music/trending');
export const searchMusic = (query) => API.get(`/music/search?query=${query}`);

export const createPlaylist = (userId, name) => API.post('/playlists', { userId, name });
export const getUserPlaylists = (userId) => API.get(`/playlists?userId=${userId}`);
export const getPlaylistDetails = (id) => API.get(`/playlists/${id}`);
export const addTrackToPlaylist = (playlistId, trackId) => API.post('/playlists/add-track', { playlistId, trackId });

export const toggleLike = (userId, trackId) => API.post('/likes/toggle', { userId, trackId });
export const getLikedSongs = (userId) => API.get(`/likes?userId=${userId}`);


export default API;