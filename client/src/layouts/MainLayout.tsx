import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AdminNavbar from '../components/AdminNavbar';
import UserProfileBar from '../components/UserProfileBar';
import ChatbotWidget from '../components/ChatbotWidget';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { role } = useAuth();

  const isAdminPage = location.pathname.includes('/admin') || role === 'ADMIN';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {isAdminPage ? <AdminNavbar /> : <Navbar />}
      {!isAdminPage && <UserProfileBar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <ChatbotWidget />
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default MainLayout;
