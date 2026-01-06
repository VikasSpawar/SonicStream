import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import PlayerBar from './player/PlayerBar';

const Layout = () => {
  return (
    <div className="flex h-screen w-full bg-bg-base text-white font-sans selection:bg-primary selection:text-white">
      
      {/* 1. Fixed Sidebar (Border Right) */}
      <aside className="w-64 border-r border-border-subtle bg-bg-base flex-shrink-0 z-20 hidden md:block">
        <Sidebar />
      </aside>

      {/* 2. Main Content (Scrollable Area) */}
      <main className="flex-1 relative flex flex-col min-w-0 bg-bg-base">
        {/* Top Header Placeholder (Sticky) */}
        <header className="h-16 border-b border-border-subtle flex items-center px-8 justify-between sticky top-0 bg-bg-base/95 z-10">
            <div className="text-sm font-medium text-text-muted">Good Afternoon, User</div>
            <div className="w-8 h-8 rounded-full bg-border-highlight"></div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar pb-32">
           <Outlet />
        </div>
        
        {/* 3. The "Island" Player (Floating Bottom Center) */}
        {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl h-20 bg-bg-card border border-border-subtle rounded-2xl shadow-2xl flex items-center px-6 justify-between z-50 transition-all hover:border-border-highlight">
          <div className="text-sm font-medium text-text-muted">🎵 High Performance Player</div>
        </div> */}

        <PlayerBar />
      </main>
      
    </div>
  );
};

export default Layout;