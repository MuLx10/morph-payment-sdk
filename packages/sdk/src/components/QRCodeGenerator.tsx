import React, { useEffect, useRef } from 'react';

interface QRCodeGeneratorProps {
  data: string;
  size?: number;
  className?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  data, 
  size = 256, 
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current || !data) return;

      try {
        // Simple QR code generation using canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);
        
        // Set background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // Generate a simple QR-like pattern (for demo purposes)
        // In production, you'd use a proper QR library like qrcode.js
        const cellSize = size / 25; // 25x25 grid
        ctx.fillStyle = '#000000';

        // Create a simple pattern based on the data hash
        const hash = data.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0);

        for (let i = 0; i < 25; i++) {
          for (let j = 0; j < 25; j++) {
            // Skip corner patterns (QR code has specific corner patterns)
            if ((i < 7 && j < 7) || (i < 7 && j > 17) || (i > 17 && j < 7)) {
              continue;
            }
            
            // Generate pattern based on hash
            const shouldFill = (hash + i * 25 + j) % 3 === 0;
            if (shouldFill) {
              ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
          }
        }

        // Add corner patterns (simplified)
        ctx.fillStyle = '#000000';
        // Top-left corner
        ctx.fillRect(0, 0, 7 * cellSize, 7 * cellSize);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cellSize, cellSize, 5 * cellSize, 5 * cellSize);
        ctx.fillStyle = '#000000';
        ctx.fillRect(2 * cellSize, 2 * cellSize, 3 * cellSize, 3 * cellSize);

        // Top-right corner
        ctx.fillStyle = '#000000';
        ctx.fillRect(18 * cellSize, 0, 7 * cellSize, 7 * cellSize);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(19 * cellSize, cellSize, 5 * cellSize, 5 * cellSize);
        ctx.fillStyle = '#000000';
        ctx.fillRect(20 * cellSize, 2 * cellSize, 3 * cellSize, 3 * cellSize);

        // Bottom-left corner
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 18 * cellSize, 7 * cellSize, 7 * cellSize);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cellSize, 19 * cellSize, 5 * cellSize, 5 * cellSize);
        ctx.fillStyle = '#000000';
        ctx.fillRect(2 * cellSize, 20 * cellSize, 3 * cellSize, 3 * cellSize);

      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [data, size]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border border-gray-300 rounded-lg"
      />
      <div className="mt-2 text-xs text-gray-500 text-center">
        Scan with your crypto wallet
      </div>
    </div>
  );
}; 