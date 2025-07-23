import React from 'react';
import Header from './Header';
import Footer from './Footer';
import RoleDebugger from '../Auth/RoleDebugger';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {/* Debugger de rôles - utile en développement */}
      {process.env.NODE_ENV === 'development' && <RoleDebugger />}
    </div>
  );
};

export default Layout;