
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Check } from 'lucide-react';

interface ActionButtonsProps {
  onGeneratePDF: () => void;
  pdfGenerated?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onGeneratePDF, pdfGenerated = false }) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Button 
          className={`w-full ${pdfGenerated ? 'bg-green-500 hover:bg-green-600' : 'bg-veggie-primary hover:bg-veggie-dark'} flex items-center justify-center`}
          onClick={onGeneratePDF}
        >
          {pdfGenerated ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Récapitulatif téléchargé
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Télécharger le récapitulatif
            </>
          )}
        </Button>
      </div>
      
      <Button asChild className="w-full bg-gray-500 hover:bg-gray-600 text-white">
        <Link to="/">
          Continuer vos achats
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </>
  );
};

export default ActionButtons;
