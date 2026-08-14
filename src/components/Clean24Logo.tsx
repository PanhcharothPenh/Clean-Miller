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
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <img 
        src="/logo.png" 
        alt="P2B Laundry System" 
        className="h-full w-auto object-contain max-h-32 shrink-0 transition-transform hover:scale-102"
      />
    </div>
  );
}
