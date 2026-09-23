import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';
import { Navbar } from '../Navbar/Navbar';
import { ToastContainer } from '../Common/Toast/Toast';

export const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar onMobileMenuToggle={() => setIsMobileSidebarOpen(true)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* Global Dynamic Toast Alerts */}
      <ToastContainer />
    </div>
  );
};
