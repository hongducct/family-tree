import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { User } from '../types/family';

interface AuthTabsProps {
  onLogin: (userId: string) => void;
  onRegister: (user: User) => void;
}

export function AuthTabs({ onLogin, onRegister }: AuthTabsProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const handleRegisterSuccess = (user: User) => {
    onRegister(user);
  };

  const handleSwitchToLogin = () => {
    setActiveTab('login');
  };

  const handleSwitchToRegister = () => {
    setActiveTab('register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {activeTab === 'login' ? (
        <LoginForm onLogin={onLogin} onSwitchToRegister={handleSwitchToRegister} />
      ) : (
        <RegisterForm onRegister={handleRegisterSuccess} onSwitchToLogin={handleSwitchToLogin} />
      )}
    </div>
  );
}