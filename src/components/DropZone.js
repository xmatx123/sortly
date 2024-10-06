// src/components/DropZone.js

import React from 'react';
import './DropZone.css';

function DropZone({ onDrop }) {
  return (
    <div className="drop-zone" onClick={onDrop}>
      {/* Optional: Add styling or visual indicators */}
    </div>
  );
}

export default DropZone;
