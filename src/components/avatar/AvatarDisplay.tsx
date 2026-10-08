import React from 'react';
import { EquippedAccessories } from '../../types';

interface AvatarDisplayProps {
  avatar: string;
  equipped?: EquippedAccessories;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showAura?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatar,
  equipped,
  size = 'md',
  showAura = true,
  className = '',
  onClick,
}) => {
  // Size mapping
  const sizeConfig = {
    sm: {
      container: 'w-10 h-10',
      avatarText: 'text-2xl',
      hat: 'text-base -top-2.5 -right-1.5',
      glasses: 'text-xs top-2',
      badge: 'text-xs -bottom-1 -left-1',
      aura: 'scale-110',
    },
    md: {
      container: 'w-14 h-14',
      avatarText: 'text-3xl',
      hat: 'text-xl -top-3.5 -right-2',
      glasses: 'text-sm top-3',
      badge: 'text-sm -bottom-1 -left-1.5',
      aura: 'scale-120',
    },
    lg: {
      container: 'w-20 h-20',
      avatarText: 'text-5xl',
      hat: 'text-3xl -top-4 -right-2.5',
      glasses: 'text-xl top-4',
      badge: 'text-xl -bottom-1.5 -left-2',
      aura: 'scale-125',
    },
    xl: {
      container: 'w-28 h-28',
      avatarText: 'text-6xl',
      hat: 'text-4xl -top-5 -right-3',
      glasses: 'text-2xl top-5',
      badge: 'text-2xl -bottom-2 -left-2.5',
      aura: 'scale-130',
    },
    '2xl': {
      container: 'w-36 h-36',
      avatarText: 'text-7xl',
      hat: 'text-5xl -top-6 -right-4',
      glasses: 'text-3xl top-7',
      badge: 'text-3xl -bottom-2.5 -left-3',
      aura: 'scale-135',
    },
  }[size];

  const hasAura = Boolean(showAura && equipped?.aura);

  return (
    <div
      onClick={onClick}
      className={`relative select-none flex items-center justify-center ${sizeConfig.container} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''
      } ${className}`}
    >
      {/* Background Aura glow/particles */}
      {hasAura && (
        <div className={`absolute inset-0 rounded-full pointer-events-none animate-pulse ${sizeConfig.aura}`}>
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-yellow-300/40 via-pink-400/30 to-purple-400/40 blur-md"></div>
          <span className="absolute -top-1 -left-1 text-sm animate-ping opacity-60">
            {equipped?.aura}
          </span>
        </div>
      )}

      {/* Base Avatar Emoji */}
      <span className={`relative z-10 ${sizeConfig.avatarText} transition-all drop-shadow-sm`}>
        {avatar}
      </span>

      {/* Layer 1: Hat / Mahkota */}
      {equipped?.hat && (
        <span
          className={`absolute z-20 ${sizeConfig.hat} transform rotate-12 drop-shadow-md animate-bounce-short pointer-events-none`}
          style={{ animationDuration: '3s' }}
        >
          {equipped.hat}
        </span>
      )}

      {/* Layer 2: Glasses / Mask */}
      {equipped?.glasses && (
        <span className={`absolute z-30 ${sizeConfig.glasses} left-1/2 -translate-x-1/2 drop-shadow-md pointer-events-none`}>
          {equipped.glasses}
        </span>
      )}

      {/* Layer 3: Badge / Wings / Medal */}
      {equipped?.badge && (
        <span className={`absolute z-20 ${sizeConfig.badge} drop-shadow-md pointer-events-none`}>
          {equipped.badge}
        </span>
      )}
    </div>
  );
};
