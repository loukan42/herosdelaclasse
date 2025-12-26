import React from 'react';
import { AVATARS } from '@/data/avatars';

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatarId: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarSelector({ selectedAvatar, onSelect, size = 'md' }: AvatarSelectorProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  return (
    <div className="grid grid-cols-5 gap-3">
      {AVATARS.map((avatar) => (
        <button
          key={avatar.id}
          type="button"
          onClick={() => onSelect(avatar.id)}
          className={`
            ${sizeClasses[size]} rounded-xl overflow-hidden
            transition-all duration-200 border-3
            ${selectedAvatar === avatar.id 
              ? 'border-golden ring-2 ring-golden/50 scale-110 shadow-lg shadow-golden/30' 
              : 'border-white/30 hover:border-golden/50 hover:scale-105'}
          `}
          title={avatar.name}
        >
          <img 
            src={avatar.image} 
            alt={avatar.name}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );
}
