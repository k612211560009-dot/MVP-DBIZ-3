import { useState } from 'react';
import { Home } from './components/pages/Home';
import { Login } from './components/pages/Login';
import { Dashboard } from './components/pages/Dashboard';
import { Registration } from './components/pages/Registration';
import { Toaster } from './components/ui/sonner';

type Page = 'home' | 'login' | 'signup' | 'dashboard' | 'registration';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'recipient' | 'admin';
  donorId?: string;
  points?: number;
  referralCode?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    navigateTo('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigateTo} />;
      case 'login':
      case 'signup':
        return <Login mode={currentPage} onLogin={handleLogin} onNavigate={navigateTo} />;
      case 'dashboard':
        return <Dashboard user={user} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'registration':
        return <Registration user={user} onNavigate={navigateTo} />;
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <>
      {renderPage()}
      <Toaster />
    </>
  );
}
