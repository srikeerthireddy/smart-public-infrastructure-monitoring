'use client';

import { LogOut } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export default function LogoutButton() {
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <button 
      onClick={handleLogout}
      className="p-3 text-gray-600 hover:text-red-600 transition-all duration-200 rounded-xl hover:bg-red-50 hover:shadow-md"
      title="Logout"
    >
      <LogOut className="h-6 w-6" />
    </button>
  );
}