
import React from 'react';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HEX {
  hex: string;
}

interface ColorPickerProps {
  color: RGB | HEX;
  onChange: (color: RGB | HEX) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const hexValue = 'hex' in color ? color.hex : rgbToHex(color);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    if (newHex.match(/^#([A-Fa-f0-9]{6})$/)) {
      if ('hex' in color) {
        onChange({ hex: newHex });
      } else {
        onChange(hexToRgb(newHex));
      }
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div 
        className="w-8 h-8 rounded-md border"
        style={{ backgroundColor: hexValue }}
      ></div>
      <input
        type="text"
        value={hexValue}
        onChange={handleChange}
        className="px-2 py-1 border rounded text-sm"
        maxLength={7}
      />
    </div>
  );
};

// Helper functions
const rgbToHex = (rgb: RGB): string => {
  return '#' + [rgb.r, rgb.g, rgb.b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
};

const hexToRgb = (hex: string): RGB => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : { r: 0, g: 0, b: 0 };
};
