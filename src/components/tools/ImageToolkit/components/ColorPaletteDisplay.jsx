import React from 'react';

export function ColorPaletteDisplay({ colors, darkMode }) {
  if (!colors || colors.length === 0) return null;

  const rgbToHex = (r, g, b) => {
    const toHex = (n) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Dominant Colors
      </h3>
      <div className="flex flex-wrap gap-4">
        {colors.map((color, index) => {
          const hexColor = rgbToHex(color.r, color.g, color.b);
          return (
            <div
              key={index}
              className="flex flex-col items-center space-y-2"
            >
              <div
                className="w-16 h-16 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: hexColor }}
                onClick={() => navigator.clipboard.writeText(hexColor)}
                title="Click to copy hex code"
              />
              <span className={`text-sm font-mono ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {hexColor}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 