
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleAuthSuccess = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
        
        <AuthForm onSuccess={handleAuthSuccess} />
        
        <div className="text-center text-sm text-gray-600">
          <p>
            Pour accéder aux fonctionnalités d'administration, vous devez être connecté
            avec un compte autorisé.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
