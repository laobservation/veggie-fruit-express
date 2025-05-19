
import React from 'react';
import { Button } from "@/components/ui/button";
import { Instagram } from 'lucide-react';

interface EmptyInstagramStateProps {
  onAddClick: () => void;
}

const EmptyInstagramState: React.FC<EmptyInstagramStateProps> = ({ onAddClick }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-lg bg-gray-50">
      <Instagram size={48} className="text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-1">No Instagram Posts Yet</h3>
      <p className="text-gray-500 text-center mb-4">Add your first Instagram post to display on your homepage</p>
      <Button onClick={onAddClick}>Add Your First Post</Button>
    </div>
  );
};

export default EmptyInstagramState;
