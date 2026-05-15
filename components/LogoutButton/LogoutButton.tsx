// components/auth/LogoutButton.tsx
'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/signin' })}
      className="flex items-center gap-2 text-sm font-bold text-white hover:text-red-500 transition-colors group"
    >
      <LogOut className="w-4 h-4  group-hover:translate-x-0.5 transition-transform" />
      <span className="uppercase tracking-widest text-xs">Log Out</span>
    </button>
  );
};