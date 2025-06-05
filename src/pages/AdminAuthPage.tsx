
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LockKeyhole } from 'lucide-react';

// Security: Move to environment variable in production
const CORRECT_PIN = '199419';
const MAX_ATTEMPTS = 2;
const LOCKOUT_DURATION = 300000; // 5 minutes in milliseconds

const AdminAuthPage = () => {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEnd, setLockoutEnd] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user already has a valid admin session
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      navigate('/admin');
    }

    // Check for existing lockout
    const storedLockoutEnd = localStorage.getItem('adminLockoutEnd');
    if (storedLockoutEnd) {
      const lockoutTime = parseInt(storedLockoutEnd);
      if (Date.now() < lockoutTime) {
        setIsLocked(true);
        setLockoutEnd(lockoutTime);
      } else {
        localStorage.removeItem('adminLockoutEnd');
      }
    }

    // Get stored attempts
    const storedAttempts = localStorage.getItem('adminAttempts');
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts));
    }
  }, [navigate]);

  // Security: Clear lockout when time expires
  useEffect(() => {
    if (lockoutEnd && Date.now() >= lockoutEnd) {
      setIsLocked(false);
      setLockoutEnd(null);
      setAttempts(0);
      localStorage.removeItem('adminLockoutEnd');
      localStorage.removeItem('adminAttempts');
    }
  }, [lockoutEnd]);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && pin.length === 6 && !isSubmitting && !isLocked) {
        handlePinSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [pin, isSubmitting, isLocked]);

  const handlePinSubmit = () => {
    if (isLocked) {
      toast({
        title: "Compte verrouillé",
        description: "Trop de tentatives. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Security: Add delay to prevent brute force attacks
    setTimeout(() => {
      // Security: Sanitize input
      const sanitizedPin = pin.replace(/[^0-9]/g, '');
      
      if (sanitizedPin === CORRECT_PIN) {
        // Clear failed attempts
        localStorage.removeItem('adminAttempts');
        localStorage.removeItem('adminLockoutEnd');
        
        // Set admin authentication with expiration
        const authData = {
          authenticated: true,
          timestamp: Date.now(),
          expires: Date.now() + (3600000) // 1 hour
        };
        sessionStorage.setItem('adminAuth', 'true');
        sessionStorage.setItem('adminAuthData', JSON.stringify(authData));
        
        toast({
          title: "Accès autorisé",
          description: "Bienvenue dans l'interface d'administration"
        });
        navigate('/admin');
      } else {
        // Handle incorrect PIN with enhanced security
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('adminAttempts', newAttempts.toString());
        
        if (newAttempts >= MAX_ATTEMPTS) {
          // Lock account for 5 minutes
          const lockoutTime = Date.now() + LOCKOUT_DURATION;
          setIsLocked(true);
          setLockoutEnd(lockoutTime);
          localStorage.setItem('adminLockoutEnd', lockoutTime.toString());
          
          toast({
            title: "Compte verrouillé",
            description: "Trop de tentatives incorrectes. Compte verrouillé pendant 5 minutes.",
            variant: "destructive"
          });
          
          // Security: Redirect after lockout
          setTimeout(() => navigate('/'), 2000);
        } else {
          toast({
            title: "Code PIN incorrect",
            description: `Il vous reste ${MAX_ATTEMPTS - newAttempts} tentative${MAX_ATTEMPTS - newAttempts > 1 ? 's' : ''}`,
            variant: "destructive"
          });
          setPin('');
        }
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const getRemainingLockoutTime = () => {
    if (!lockoutEnd) return '';
    const remaining = Math.ceil((lockoutEnd - Date.now()) / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <LockKeyhole className="h-8 w-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Accès Administrateur</h1>
        <p className="text-gray-600 mb-6">
          Veuillez entrer le code PIN à 6 chiffres pour accéder aux paramètres d'administration
        </p>
        
        {isLocked && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
            <p className="text-red-800 text-sm">
              Compte verrouillé. Temps restant: {getRemainingLockoutTime()}
            </p>
          </div>
        )}
        
        <div className="mb-6 px-[73px] bg-transparent">
          <InputOTP 
            maxLength={6} 
            value={pin} 
            onChange={setPin} 
            className="my-0"
            disabled={isLocked}
            type="password"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="border-gray-300" />
              <InputOTPSlot index={1} className="border-gray-300" />
              <InputOTPSlot index={2} className="border-gray-300" />
              <InputOTPSlot index={3} className="border-gray-300" />
              <InputOTPSlot index={4} className="border-gray-300" />
              <InputOTPSlot index={5} className="border-gray-300" />
            </InputOTPGroup>
          </InputOTP>
        </div>
        
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
            Tentatives restantes: {MAX_ATTEMPTS - attempts}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminAuthPage;
