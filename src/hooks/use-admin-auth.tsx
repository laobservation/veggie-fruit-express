
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Security: Move to environment variable in production
const CORRECT_PIN = '199419';
const MAX_ATTEMPTS = 2;
const LOCKOUT_DURATION = 300000; // 5 minutes in milliseconds

export const useAdminAuth = () => {
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

  return {
    pin,
    setPin,
    attempts,
    isSubmitting,
    isLocked,
    lockoutEnd,
    handlePinSubmit,
    maxAttempts: MAX_ATTEMPTS
  };
};
