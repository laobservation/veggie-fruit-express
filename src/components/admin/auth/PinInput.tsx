
import React from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface PinInputProps {
  pin: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const PinInput = ({ pin, onChange, disabled }: PinInputProps) => {
  return (
    <div className="mb-6 px-[73px] bg-transparent">
      <InputOTP 
        maxLength={6} 
        value={pin} 
        onChange={onChange} 
        className="my-0"
        disabled={disabled}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} className="border-gray-300">
            {pin[0] ? '•' : ''}
          </InputOTPSlot>
          <InputOTPSlot index={1} className="border-gray-300">
            {pin[1] ? '•' : ''}
          </InputOTPSlot>
          <InputOTPSlot index={2} className="border-gray-300">
            {pin[2] ? '•' : ''}
          </InputOTPSlot>
          <InputOTPSlot index={3} className="border-gray-300">
            {pin[3] ? '•' : ''}
          </InputOTPSlot>
          <InputOTPSlot index={4} className="border-gray-300">
            {pin[4] ? '•' : ''}
          </InputOTPSlot>
          <InputOTPSlot index={5} className="border-gray-300">
            {pin[5] ? '•' : ''}
          </InputOTPSlot>
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};

export default PinInput;
