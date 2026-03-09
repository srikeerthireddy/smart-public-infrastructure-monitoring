'use client';

import { Eye, EyeOff } from 'lucide-react';

interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: () => void;
}

export default function PasswordToggle({ showPassword, onToggle }: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute inset-y-0 right-0 pr-3 flex items-center"
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5 text-gray-400" />
      ) : (
        <Eye className="h-5 w-5 text-gray-400" />
      )}
    </button>
  );
}