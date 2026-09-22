import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import UserProfileBar from '../components/UserProfileBar';
import ChatbotWidget from '../components/ChatbotWidget';
import Footer from '../components/Footer';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <UserProfileBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <ChatbotWidget />
      <Footer />
    </div>
  );
};

export default MainLayout;
