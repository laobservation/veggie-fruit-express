import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LockKeyhole } from 'lucide-react';
const CORRECT_PIN = '199419';
const MAX_ATTEMPTS = 2;
const AdminAuthPage = () => {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  // Check if user already has a valid admin session
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      navigate('/admin');
    }
  }, [navigate]);
  const handlePinSubmit = () => {
    setIsSubmitting(true);

    // Simulate a short delay for security reasons (prevents brute force)
    setTimeout(() => {
      if (pin === CORRECT_PIN) {
        // Set admin authentication in session storage
        sessionStorage.setItem('adminAuth', 'true');
        toast({
          title: "Accès autorisé",
          description: "Bienvenue dans l'interface d'administration"
        });
        navigate('/admin');
      } else {
        // Handle incorrect PIN
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          toast({
            title: "Accès refusé",
            description: "Nombre maximum de tentatives dépassé",
            variant: "destructive"
          });
          // Redirect to not found page after max attempts
          setTimeout(() => navigate('/not-found'), 1500);
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
  return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <LockKeyhole className="h-8 w-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Accès Administrateur</h1>
        <p className="text-gray-600 mb-6">Veuillez entrer le code PIN à 6 chiffres pour accéder aux paramètres d'administration</p>
        
        <div className="mb-6 px-[76px]">
          <InputOTP maxLength={6} value={pin} onChange={setPin} placeholder="•" className="my-0">
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
          <Button onClick={handlePinSubmit} disabled={pin.length !== 6 || isSubmitting} className="w-full">
            {isSubmitting ? "Vérification..." : "Accéder"}
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/')} className="w-full">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>;
};
export default AdminAuthPage;