import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import Playlist from './pages/Playlist';
import AdminUpload from './pages/AdminUploads';
import Library from './pages/Library';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminUpload />} />
          <Route path="/playlists" element={<Library />} />
          <Route path="/liked" element={<Library />} />
          <Route path="/playlist/:id" element={<Playlist />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;