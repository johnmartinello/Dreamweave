import { useState, useEffect } from 'react';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (dateString: string): string => {
  // Validate input
  if (!dateString || typeof dateString !== 'string') {
    return 'Invalid Date';
  }
  
  // Handle date strings safely by ensuring they're treated as local dates
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    return 'Invalid Date';
  }
  
  const [year, month, day] = parts.map(Number);
  
  // Validate date components
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return 'Invalid Date';
  }
  
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return 'Invalid Date';
  }
  
  const date = new Date(year, month - 1, day); // month is 0-indexed
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateForInput = (dateString: string): string => {
  // Validate input
  if (!dateString || typeof dateString !== 'string') {
    return getCurrentDateString();
  }
  
  // Handle date strings safely by ensuring they're treated as local dates
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    return getCurrentDateString();
  }
  
  const [year, month, day] = parts.map(Number);
  
  // Validate date components
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return getCurrentDateString();
  }
  
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return getCurrentDateString();
  }
  
  const date = new Date(year, month - 1, day); // month is 0-indexed
  
  // Check if the date is valid before calling toISOString
  if (isNaN(date.getTime())) {
    return getCurrentDateString();
  }
  
  try {
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return getCurrentDateString();
  }
};

export const getCurrentDateString = (): string => {
  // Get current date in local timezone as YYYY-MM-DD
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayFormatted = (): string => {
  // Get today's date in "Day [date]" format
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const compareDates = (dateA: string, dateB: string): number => {
  // Safe date comparison that treats dates as local dates
  try {
    const [yearA, monthA, dayA] = dateA.split('-').map(Number);
    const [yearB, monthB, dayB] = dateB.split('-').map(Number);
    
    // Validate dates
    if (isNaN(yearA) || isNaN(monthA) || isNaN(dayA) || 
        isNaN(yearB) || isNaN(monthB) || isNaN(dayB)) {
      return 0;
    }
    
    const timeA = new Date(yearA, monthA - 1, dayA).getTime();
    const timeB = new Date(yearB, monthB - 1, dayB).getTime();
    
    // Check if dates are valid
    if (isNaN(timeA) || isNaN(timeB)) {
      return 0;
    }
    
    return timeB - timeA; // Descending order (newest first)
  } catch (error) {
    console.error('Error comparing dates:', error);
    return 0;
  }
};

export const cn = (...classes: (string | undefined | null | false | Record<string, boolean>)[]): string => {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return cls;
    })
    .filter(Boolean)
    .join(' ');
};

// Custom hook for window size tracking
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};
