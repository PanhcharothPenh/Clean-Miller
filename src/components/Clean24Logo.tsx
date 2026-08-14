/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface Clean24LogoProps {
  className?: string;
  showText?: boolean;
  lightMode?: boolean;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Clean24Logo({
  className = "h-12",
  showText = true,
  lightMode = true,
  iconSize = 'md'
}: Clean24LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <img 
        src="/logo.png" 
        alt="P2B Laundry System" 
        className="h-full w-auto object-contain rounded-xl max-h-16 shrink-0 drop-shadow-xs"
      />
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span className={`font-extrabold tracking-tight text-base sm:text-lg font-sans ${lightMode ? 'text-[#003D9B]' : 'text-white'}`}>
            P2B <span className="text-[#0052CC]">LAUNDRY</span>
          </span>
          <span className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mt-1 ${lightMode ? 'text-[#4B5563]' : 'text-slate-300'}`}>
            SYSTEM
          </span>
        </div>
      )}
    </div>
  );
}
