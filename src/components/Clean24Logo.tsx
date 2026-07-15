/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface Clean24LogoProps {
  className?: string;
  showText?: boolean;
  lightMode?: boolean; // If true, "LEAN" is black/slate-800. If false, "LEAN" is white.
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Clean24Logo({
  className = "h-9",
  showText = true,
  lightMode = true,
  iconSize = 'md'
}: Clean24LogoProps) {
  // Vibrant brand turquoise/teal
  const tealColor = "#00B2B2";
  const leanColor = lightMode ? "#0F172A" : "#FFFFFF"; // Slate-900 or White

  if (!showText) {
    // Return only the icon (Washing Machine + clock + 24)
    return (
      <svg
        viewBox="200 10 150 80"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        {/* Horizontal Speed lines (Left) */}
        <line x1="201" y1="28" x2="228" y2="28" stroke={tealColor} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="196" y1="35" x2="218" y2="35" stroke={tealColor} strokeWidth="3.5" strokeLinecap="round" />

        {/* Washing machine group */}
        <g transform="translate(225, 20) skewX(-12)">
          {/* Machine Body */}
          <rect x="0" y="0" width="48" height="60" rx="8" stroke={leanColor} strokeWidth="5.5" fill="none" />
          {/* Top Panel Divider */}
          <line x1="0" y1="16" x2="48" y2="16" stroke={leanColor} strokeWidth="4.5" />
          {/* Soap Drawer */}
          <rect x="6" y="5" width="10" height="6" rx="1.5" stroke={leanColor} strokeWidth="2.5" />
          {/* Control Dial Knobs */}
          <circle cx="38" cy="8" r="3" fill={leanColor} />
          <circle cx="28" cy="8" r="2" fill={leanColor} />

          {/* Transparent Glass Drum / Chamber */}
          <circle cx="24" cy="38" r="14.5" stroke={tealColor} strokeWidth="4.5" fill="#FFFFFF" />
          
          {/* Internal clock hands */}
          <line x1="24" y1="38" x2="24" y2="28" stroke={tealColor} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="24" y1="38" x2="31" y2="42" stroke={tealColor} strokeWidth="2.5" strokeLinecap="round" />
          {/* 12, 3, 6, 9 Dot indications */}
          <circle cx="24" cy="27" r="1.2" fill={tealColor} />
          <circle cx="35" cy="38" r="1.2" fill={tealColor} />
          <circle cx="24" cy="49" r="1.2" fill={tealColor} />
          <circle cx="13" cy="38" r="1.2" fill={tealColor} />
        </g>

        {/* "24" styled italic group */}
        <g transform="translate(278, 20) skewX(-12)">
          {/* Number 2 */}
          <path
            d="M 6 42 Q 6 30 18 30 C 26 30, 26 40, 18 48 L 6 56 L 28 56"
            stroke={tealColor}
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Number 4 */}
          <path
            d="M 44 48 L 44 26 L 31 42 L 50 42"
            stroke={tealColor}
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Horizontal Speed lines (Right) */}
        <line x1="335" y1="42" x2="350" y2="42" stroke={tealColor} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="331" y1="49" x2="346" y2="49" stroke={tealColor} strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Horizontal full wordmark with emblem logo
  return (
    <svg
      viewBox="0 5 350 82"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* C - Circular open arc in Teal */}
      <path
        d="M 46 38 A 18 18 0 1 0 46 62"
        stroke={tealColor}
        strokeWidth="8.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* L - Sharp Slate/White */}
      <path
        d="M 68 28 L 68 68 L 88 68"
        stroke={leanColor}
        strokeWidth="8.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* E - Sharp Slate/White */}
      <path
        d="M 124 28 L 102 28 L 102 68 L 124 68 M 102 48 L 120 48"
        stroke={leanColor}
        strokeWidth="8.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* A - Custom Apex styled Slate/White */}
      <path
        d="M 134 68 L 148 28 L 162 68 M 139 52 L 157 52"
        stroke={leanColor}
        strokeWidth="8.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* N - Connected styled Slate/White */}
      <path
        d="M 176 68 L 176 28 L 202 68 L 202 28"
        stroke={leanColor}
        strokeWidth="8.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Horizontal Speed lines (Left) */}
      <line x1="202" y1="28" x2="228" y2="28" stroke={tealColor} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="197" y1="35" x2="218" y2="35" stroke={tealColor} strokeWidth="3.5" strokeLinecap="round" />

      {/* Washing machine group */}
      <g transform="translate(225, 20) skewX(-12)">
        {/* Machine Body */}
        <rect x="0" y="0" width="48" height="60" rx="8" stroke={leanColor} strokeWidth="5.5" fill="none" />
        {/* Top Panel Divider */}
        <line x1="0" y1="16" x2="48" y2="16" stroke={leanColor} strokeWidth="4.5" />
        {/* Soap Drawer */}
        <rect x="6" y="5" width="10" height="6" rx="1.5" stroke={leanColor} strokeWidth="2.5" />
        {/* Control Dial Knobs */}
        <circle cx="38" cy="8" r="3" fill={leanColor} />
        <circle cx="28" cy="8" r="2" fill={leanColor} />

        {/* Transparent Glass Drum / Chamber */}
        <circle cx="24" cy="38" r="14.5" stroke={tealColor} strokeWidth="4.5" fill="#FFFFFF" />
        
        {/* Internal clock hands */}
        <line x1="24" y1="38" x2="24" y2="28" stroke={tealColor} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="38" x2="31" y2="42" stroke={tealColor} strokeWidth="2.5" strokeLinecap="round" />
        {/* 12, 3, 6, 9 Dot indications */}
        <circle cx="24" cy="27" r="1.2" fill={tealColor} />
        <circle cx="35" cy="38" r="1.2" fill={tealColor} />
        <circle cx="24" cy="49" r="1.2" fill={tealColor} />
        <circle cx="13" cy="38" r="1.2" fill={tealColor} />
      </g>

      {/* "24" styled italic group */}
      <g transform="translate(278, 20) skewX(-12)">
        {/* Number 2 */}
        <path
          d="M 6 42 Q 6 30 18 30 C 26 30, 26 40, 18 48 L 6 56 L 28 56"
          stroke={tealColor}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Number 4 */}
        <path
          d="M 44 48 L 44 26 L 31 42 L 50 42"
          stroke={tealColor}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Horizontal Speed lines (Right) */}
      <line x1="334" y1="42" x2="349" y2="42" stroke={tealColor} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="330" y1="49" x2="345" y2="49" stroke={tealColor} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
