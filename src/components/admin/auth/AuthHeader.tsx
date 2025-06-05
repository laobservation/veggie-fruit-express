
import React from 'react';
import { LockKeyhole } from 'lucide-react';

const AuthHeader = () => {
  return (
    <>
      <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <LockKeyhole className="h-8 w-8 text-green-600" />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Accès Administrateur</h1>
      <p className="text-gray-600 mb-6">
        Veuillez entrer le code PIN à 6 chiffres pour accéder aux paramètres d'administration
      </p>
    </>
  );
};

export default AuthHeader;
