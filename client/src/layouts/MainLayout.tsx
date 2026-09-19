import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import UserProfileBar from '../components/UserProfileBar';
import ChatbotWidget from '../components/ChatbotWidget';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <UserProfileBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <ChatbotWidget />
      <footer className="bg-slate-950 text-slate-400 py-12 text-center mt-auto border-t border-slate-800 text-xs">
        <p>&copy; {new Date().getFullYear()} Rentify Platform. All rights reserved.</p>
        <p className="text-slate-500 mt-1">Phase 2 Live Property Discovery & User Bar</p>
      </footer>
    </div>
  );
};

export default MainLayout;
