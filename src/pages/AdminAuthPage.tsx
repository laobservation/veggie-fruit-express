
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import AuthHeader from '@/components/admin/auth/AuthHeader';
import PinInput from '@/components/admin/auth/PinInput';
import LockoutStatus from '@/components/admin/auth/LockoutStatus';

const AdminAuthPage = () => {
  const navigate = useNavigate();
  const {
    pin,
    setPin,
    attempts,
    isSubmitting,
    isLocked,
    lockoutEnd,
    handlePinSubmit,
    maxAttempts
  } = useAdminAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <AuthHeader />
        
        <LockoutStatus 
          isLocked={isLocked}
          lockoutEnd={lockoutEnd}
          attempts={attempts}
          maxAttempts={maxAttempts}
        />
        
        <PinInput 
          pin={pin}
          onChange={setPin}
          disabled={isLocked}
        />
        
        <div className="flex flex-col gap-3">
          <Button 
            onClick={handlePinSubmit} 
            disabled={pin.length !== 6 || isSubmitting || isLocked} 
            className="w-full"
          >
            {isSubmitting ? "Vérification..." : "Accéder"}
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/')} className="w-full">
            Retour à l'accueil
          </Button>
        </div>
        
        {attempts > 0 && !isLocked && (
          <p className="text-sm text-orange-600 mt-4">
            Tentatives restantes: {maxAttempts - attempts}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminAuthPage;
