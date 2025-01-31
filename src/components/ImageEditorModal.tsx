import React, { useState, useRef } from 'react';
import { Button } from '@/registry/new-york/ui/button';

interface ImageEditorModalProps {
  image: string;
  initialAdjustments: { offsetX: number; offsetY: number; zoom: number };
  onSave: (adjustments: { offsetX: number; offsetY: number; zoom: number }) => void;
  onClose: () => void;
}

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ image, initialAdjustments, onSave, onClose }) => {
  const [offsetX, setOffsetX] = useState(initialAdjustments.offsetX || 0);
  const [offsetY, setOffsetY] = useState(initialAdjustments.offsetY || 0);
  const [zoom, setZoom] = useState(initialAdjustments.zoom || 1);

  const isDragging = useRef(false);
  const startCoords = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startCoords.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - startCoords.current.x;
    const deltaY = e.clientY - startCoords.current.y;

    setOffsetX((prev) => prev + deltaX);
    setOffsetY((prev) => prev + deltaY);

    startCoords.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleSave = () => {
    onSave({ offsetX, offsetY, zoom });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="bg-card dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">Edit Profile Picture</h3>
        <div
          className="relative w-64 h-64 mx-auto overflow-hidden rounded-full border-4 border-primary"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={image}
            alt="Edit"
            className="absolute"
            style={{
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
              transition: isDragging.current ? 'none' : 'transform 0.3s ease-in-out',
            }}
            draggable={false}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="zoom" className="text-sm text-muted-foreground">Zoom:</label>
          <input
            id="zoom"
            type="range"
            min="1"
            max="2"
            step="0.01"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button className="bg-secondary" onClick={onClose}>Cancel</Button>
          <Button className="bg-primary" onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;
