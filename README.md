Here is a professional, portfolio-ready `README.md` file for your **SonicStream** project.

It is structured to impress recruiters by highlighting the Architecture, Tech Stack, and Features.

**Instructions:**

1. Create a file named `README.md` in your **root folder**.
2. Paste the code below.
3. (Optional) Take a screenshot of your Home page and save it as `screenshot.png` in the root to replace the placeholder image.

---

```markdown
# 🎵 SonicStream

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech Stack](https://img.shields.io/badge/stack-PERN-orange.svg)

**SonicStream** is a full-stack music streaming web application built with the PERN-adjacent stack (Postgres via Supabase, Express, React, Node.js). It features real-time audio streaming, dynamic playlists, authentication, and a modern "Glassmorphism" UI.

![SonicStream Screenshot](https://via.placeholder.com/1200x600?text=SonicStream+Dashboard+Preview)
*(Replace this link with a real screenshot of your app)*

---

## 🚀 Features

### 🎧 Core Experience
* **Global Music Player:** Persistent audio playback across pages with Play/Pause, Seek, Volume, and Skip controls.
* **Real-time Search:** Debounced search functionality to find tracks and artists instantly.
* **Queue System:** Manage upcoming tracks seamlessly.

### 👤 User Features
* **Authentication:** Secure Sign Up and Login via Supabase Auth.
* **Your Library:** Create, edit, and manage custom **Playlists**.
* **Likes System:** "Heart" your favorite tracks to save them to your collection.

### 🛡️ Admin & Content
* **Admin Portal:** Secure drag-and-drop interface to upload MP3s and Cover Art directly to Cloud Storage.
* **Cloud Storage:** Media assets hosted on Supabase Storage Buckets.

---

## 🛠️ Tech Stack

### Frontend
* **React (Vite):** Fast, component-based UI.
* **Tailwind CSS:** Modern, responsive styling with a dark-mode first approach.
* **Context API:** State management for Authentication and Audio Player.
* **Lucide React:** Beautiful, lightweight icons.

### Backend
* **Node.js & Express:** RESTful API architecture.
* **Supabase Client:** Direct interaction with PostgreSQL and Auth services.
* **Multer (Optional):** Handling file streams before upload.

### Database & Cloud
* **Supabase (PostgreSQL):** Relational database with Row Level Security (RLS).
* **Supabase Auth:** Secure user management.
* **Supabase Storage:** Hosting for Audio (`.mp3`) and Images (`.jpg/png`).

---

## 📂 Project Structure

```bash
SonicStream/
├── backend/            # Express Server API
│   ├── src/
│   │   ├── controllers/ # Logic for Music, Auth, Playlists
│   │   ├── routes/      # API Endpoint Definitions
│   │   └── config/      # Supabase & Env Config
├── client/             # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI (PlayerBar, Sidebar)
│   │   ├── context/     # Global State (Auth, Player)
│   │   ├── pages/       # Views (Home, Library, Search)
│   │   └── services/    # API Axios Calls

```

---

## ⚡ Getting Started

Follow these steps to run the project locally.

### Prerequisites

* Node.js (v16+)
* NPM
* A free [Supabase](https://supabase.com) account

### 1. Clone the Repository

```bash
git clone [https://github.com/yourusername/sonicstream.git](https://github.com/yourusername/sonicstream.git)
cd sonicstream

```

### 2. Setup Backend

```bash
cd backend
npm install

# Create a .env file
touch .env

```

**Add the following to `backend/.env`:**

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

```

**Start the Server:**

```bash
npm run dev

```

### 3. Setup Frontend

Open a new terminal.

```bash
cd client
npm install

# Create a .env file
touch .env

```

**Add the following to `client/.env`:**

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

```

**Start the Client:**

```bash
npm run dev

```

---

## 🗄️ Database Schema

Run the following SQL in your Supabase SQL Editor to set up the tables:

```sql
-- 1. Tracks Table
create table tracks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  artist text not null,
  cover_url text,
  audio_url text not null,
  duration int,
  created_at timestamp with time zone default now()
);

-- 2. Playlists & Likes
-- (Refer to project documentation for full RLS policies)

```

---

## 🛣️ API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/music` | Fetch all tracks |
| `GET` | `/api/music/search?query=xyz` | Search tracks |
| `POST` | `/api/playlists` | Create a new playlist |
| `POST` | `/api/likes/toggle` | Like/Unlike a song |

---

## 🔮 Future Improvements

* [ ] Mobile-responsive Bottom Navigation.
* [ ] "Recently Played" history tracking.
* [ ] Drag-and-drop playlist reordering.
* [ ] Public user profiles.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

Made with ❤️ by Vikas Pawar

```

```