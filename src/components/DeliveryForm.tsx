
import React from 'react';
import { DeliveryForm as DeliveryFormContainer } from './delivery';

interface DeliveryFormProps {
  onClose: () => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ onClose }) => {
  return <DeliveryFormContainer onClose={onClose} />;
};

export default DeliveryForm;
