import React, { useState } from 'react';

function ImageEditor({ profileImage, onSave }: { profileImage: string; onSave: (data: { offsetX: number; offsetY: number; zoom: number }) => void }) {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [zoom, setZoom] = useState(1);

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOffsetX(offsetX + e.movementX);
    setOffsetY(offsetY + e.movementY);
  };

  const handleSave = () => {
    onSave({ offsetX, offsetY, zoom });
  };

  return (
    <div className="relative w-64 h-64 rounded-full overflow-hidden border border-gray-300 dark:border-zinc-700">
      <div
        className="absolute inset-0 cursor-move"
        style={{
          backgroundImage: `url(${profileImage})`,
          backgroundSize: `${zoom * 100}%`,
          backgroundPosition: `${offsetX}px ${offsetY}px`,
          backgroundRepeat: 'no-repeat',
        }}
        onMouseDown={(e) => {
          e.currentTarget.addEventListener('mousemove', (event) => handleDrag(event as unknown as React.MouseEvent<HTMLDivElement>));
          e.currentTarget.addEventListener('mouseup', () => {
            e.currentTarget.removeEventListener('mousemove', handleDrag as unknown as EventListener);
          });
        }}
      />
      <div className="mt-4 flex flex-col items-center">
        <input
          type="range"
          min="1"
          max="3"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="w-48"
        />
        <button onClick={handleSave} className="mt-2 bg-primary text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default ImageEditor;
