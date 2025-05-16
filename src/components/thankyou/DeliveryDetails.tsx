
import React from 'react';

interface DeliveryDetailsProps {
  name: string;
  address: string;
  phone: string;
  preferredTime?: string;
  deliveryDay?: string;
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({ 
  name, 
  address, 
  phone, 
  preferredTime,
  deliveryDay
}) => {
  return (
    <div className="border-t border-b py-4 mb-6">
      <h2 className="font-semibold mb-3">Détails de livraison :</h2>
      <p><span className="font-medium">Nom :</span> {name}</p>
      <p><span className="font-medium">Adresse :</span> {address}</p>
      <p><span className="font-medium">Téléphone :</span> {phone}</p>
      {deliveryDay && (
        <p><span className="font-medium">Jour de livraison :</span> {deliveryDay}</p>
      )}
      {preferredTime && (
        <p><span className="font-medium">Heure de livraison préférée :</span> {preferredTime}</p>
      )}
    </div>
  );
};

export default DeliveryDetails;
