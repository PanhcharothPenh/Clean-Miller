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
  className = "h-14",
  showText = true,
  lightMode = true,
  iconSize = 'md'
}: Clean24LogoProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      <img 
        src="/logo.png" 
        alt="P2B Laundry System" 
        className="h-full w-auto object-contain max-h-32 shrink-0 transition-transform hover:scale-102"
      />
      {showText && (
        <div className="flex flex-col items-center text-center leading-none mt-1">
          <span className={`font-black tracking-tight text-xs sm:text-sm font-sans uppercase ${lightMode ? 'text-[#003D9B]' : 'text-white'}`}>
            P2B <span className="text-[#0052CC]">LAUNDRY</span>
          </span>
          <span className={`text-[8.5px] font-extrabold tracking-widest uppercase mt-0.5 ${lightMode ? 'text-[#4B5563]' : 'text-slate-300'}`}>
            SYSTEM
          </span>
        </div>
      )}
    </div>
  );
}
