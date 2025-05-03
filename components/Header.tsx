'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: 'ADX Setup', href: '/' },
    { name: 'Agency', href: '/agency' },
    { name: 'Courses', href: '/courses' },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
              LECTURER
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex space-x-2 sm:space-x-4 lg:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-2 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
} 