import React from 'react';

interface HalftoneBackgroundProps {
  angle?: number; // Rotation angle of the halftone pattern
  pixelsPerDot?: number; // Pixels per dot (dot size)
  pixelsBetweenDots?: number; // Pixels between dots (dot spacing)
  color?: string; // Color of the dots
  opacity?: number; // Opacity of the dots
  className?: string; // Additional className for the SVG
}

const HalftoneBackground: React.FC<HalftoneBackgroundProps> = ({
  angle = 45,
  pixelsPerDot = 5, // Default to 5 pixels per dot
  pixelsBetweenDots = 5, // Default to 5 pixels between dots
  color = '#ffffff',
  opacity = 0.1,
  className = '',
}) => {
  // Calculate total pattern size and dot position
  const patternSize = pixelsPerDot + pixelsBetweenDots;

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'center',
      }}
    >
      <defs>
        <pattern
          id='halftone-pattern'
          width={patternSize}
          height={patternSize}
          patternUnits='userSpaceOnUse'
        >
          <circle
            cx={patternSize / 2}
            cy={patternSize / 2}
            r={pixelsPerDot / 2}
            fill={color}
            fillOpacity={opacity}
          />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#halftone-pattern)' />
    </svg>
  );
};

export default HalftoneBackground;
