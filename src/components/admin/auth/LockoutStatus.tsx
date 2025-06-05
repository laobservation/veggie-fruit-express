
import React from 'react';

interface LockoutStatusProps {
  isLocked: boolean;
  lockoutEnd: number | null;
  attempts: number;
  maxAttempts: number;
}

const LockoutStatus = ({ isLocked, lockoutEnd, attempts, maxAttempts }: LockoutStatusProps) => {
  const getRemainingLockoutTime = () => {
    if (!lockoutEnd) return '';
    const remaining = Math.ceil((lockoutEnd - Date.now()) / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLocked) {
    return (
      <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
        <p className="text-red-800 text-sm">
          Compte verrouillé. Temps restant: {getRemainingLockoutTime()}
        </p>
      </div>
    );
  }

  if (attempts > 0) {
    return (
      <p className="text-sm text-orange-600 mt-4">
        Tentatives restantes: {maxAttempts - attempts}
      </p>
    );
  }

  return null;
};

export default LockoutStatus;
