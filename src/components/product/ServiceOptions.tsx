
import React from 'react';
import { ServiceOption } from '@/types/product';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ServiceOptionsProps {
  serviceOptions: ServiceOption[];
  selectedService: string | null;
  setSelectedService: (value: string | null) => void;
}

const ServiceOptions: React.FC<ServiceOptionsProps> = ({ 
  serviceOptions, 
  selectedService, 
  setSelectedService 
}) => {
  return (
    <div className="mb-3">
      <h2 className="font-semibold text-md mb-2">Services additionnels</h2>
      <RadioGroup 
        value={selectedService || ""}
        onValueChange={setSelectedService}
        className="gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="" id="no-service" />
          <Label htmlFor="no-service">Aucun service supplémentaire</Label>
        </div>
        {serviceOptions.map((service) => (
          <div key={service.id} className="flex items-start space-x-2">
            <RadioGroupItem value={service.id} id={service.id} />
            <div className="grid gap-1 leading-none">
              <Label
                htmlFor={service.id}
                className="text-sm font-medium leading-none"
              >
                {service.name}
              </Label>
              <p className="text-xs text-gray-500 rtl:text-right">
                {service.nameAr}
              </p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ServiceOptions;
