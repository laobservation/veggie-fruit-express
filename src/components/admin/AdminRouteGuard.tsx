
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateAdminSession } from '@/utils/security';
import { Loader2 } from 'lucide-react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      // Check if admin session is valid
      const hasValidSession = validateAdminSession();
      const adminAuth = sessionStorage.getItem('adminAuth');
      
      if (!hasValidSession || adminAuth !== 'true') {
        // Clear invalid session data
        sessionStorage.removeItem('adminAuth');
        sessionStorage.removeItem('adminAuthData');
        
        // Redirect to auth page
        navigate('/admin-auth');
        return;
      }
      
      setIsAuthorized(true);
      setIsValidating(false);
    };

    checkAuth();

    // Set up session validation interval
    const interval = setInterval(checkAuth, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [navigate]);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Vérification des permissions...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default AdminRouteGuard;
