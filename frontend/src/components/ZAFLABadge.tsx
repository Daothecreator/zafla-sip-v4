import React from 'react';
import { Shield } from 'lucide-react';

interface ZAFLABadgeProps {
  variant?: 'compact' | 'default' | 'large';
}

function ZAFLABadge({ variant = 'default' }: ZAFLABadgeProps) {
  const sizeClass = {
    compact: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  return (
    <div className={`${sizeClass[variant]} flex items-center justify-center bg-[#1a2332] border border-[#c9a84c] rounded-full`}>
      <Shield className="text-[#c9a84c]" size={variant === 'large' ? 32 : 20} />
    </div>
  );
}

export default ZAFLABadge;
