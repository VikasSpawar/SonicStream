import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Upload, Music, Image as ImageIcon, CheckCircle } from 'lucide-react';

const AdminUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    category: 'Pop', // Default
  });

  const [files, setFiles] = useState({
    audio: null,
    image: null
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.audio || !files.image) return alert("Please select both files");

    setUploading(true);
    try {
        // 1. Upload Audio
        const audioName = `${Date.now()}-${files.audio.name}`;
        const { data: audioData, error: audioError } = await supabase.storage
            .from('music-files')
            .upload(audioName, files.audio);
        
        if (audioError) throw audioError;

        // 2. Upload Image
        const imageName = `${Date.now()}-${files.image.name}`;
        const { data: imageData, error: imageError } = await supabase.storage
            .from('covers')
            .upload(imageName, files.image);

        if (imageError) throw imageError;

        // 3. Get Public URLs
        const audioUrl = supabase.storage.from('music-files').getPublicUrl(audioName).data.publicUrl;
        const coverUrl = supabase.storage.from('covers').getPublicUrl(imageName).data.publicUrl;

        // 4. Save to Database (Using Supabase Client directly for speed)
        const { error: dbError } = await supabase
            .from('tracks')
            .insert({
                title: formData.title,
                artist: formData.artist,
                audio_url: audioUrl,
                cover_url: coverUrl,
                duration: 180, // Dummy duration, or calculate it with JS
            });

        if (dbError) throw dbError;

        setSuccess(true);
        setFormData({ title: '', artist: '', category: 'Pop' });
        setFiles({ audio: null, image: null });

    } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed: " + error.message);
    } finally {
        setUploading(false);
    }
  };

  if (success) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in zoom-in">
        <CheckCircle size={64} className="text-primary" />
        <h2 className="text-3xl font-bold">Upload Complete!</h2>
        <p className="text-text-muted">Your track is now live.</p>
        <button 
            onClick={() => setSuccess(false)}
            className="text-white underline"
        >
            Upload Another
        </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pb-32">
        <h1 className="text-3xl font-bold mb-8">Upload New Track</h1>

        <form onSubmit={handleUpload} className="space-y-6">
            {/* Metadata Fields */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Track Title</label>
                    <input 
                        type="text" 
                        required
                        className="w-full bg-bg-card border border-border-subtle rounded-md p-3 focus:border-primary focus:outline-none text-white"
                        placeholder="e.g. Midnight City"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Artist Name</label>
                    <input 
                        type="text" 
                        required
                        className="w-full bg-bg-card border border-border-subtle rounded-md p-3 focus:border-primary focus:outline-none text-white"
                        placeholder="e.g. M83"
                        value={formData.artist}
                        onChange={e => setFormData({...formData, artist: e.target.value})}
                    />
                </div>
            </div>

            {/* Audio File Input */}
            <div className="border-2 border-dashed border-border-subtle rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer relative group">
                <input 
                    type="file" 
                    accept="audio/*"
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={e => setFiles({...files, audio: e.target.files[0]})}
                />
                <div className="flex flex-col items-center gap-2">
                    <div className="p-4 bg-bg-hover rounded-full group-hover:bg-primary/20 transition-colors">
                        <Music size={32} className="text-primary" />
                    </div>
                    {files.audio ? (
                        <p className="font-bold text-white">{files.audio.name}</p>
                    ) : (
                        <>
                            <p className="font-medium text-white">Drop your MP3 here</p>
                            <p className="text-sm text-text-muted">or click to browse</p>
                        </>
                    )}
                </div>
            </div>

            {/* Image File Input */}
            <div className="border-2 border-dashed border-border-subtle rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer relative group">
                <input 
                    type="file" 
                    accept="image/*"
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={e => setFiles({...files, image: e.target.files[0]})}
                />
                <div className="flex flex-col items-center gap-2">
                    <div className="p-4 bg-bg-hover rounded-full group-hover:bg-primary/20 transition-colors">
                        <ImageIcon size={32} className="text-primary" />
                    </div>
                    {files.image ? (
                        <p className="font-bold text-white">{files.image.name}</p>
                    ) : (
                        <>
                            <p className="font-medium text-white">Upload Cover Art</p>
                            <p className="text-sm text-text-muted">Square images work best</p>
                        </>
                    )}
                </div>
            </div>

            <button 
                type="submit" 
                disabled={uploading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
                {uploading ? (
                    <span>Uploading... please wait</span>
                ) : (
                    <>
                        <Upload size={20} /> Publish Track
                    </>
                )}
            </button>
        </form>
    </div>
  );
};

export default AdminUpload;