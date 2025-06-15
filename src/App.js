import React, { useState } from 'react';
import ParticleAnimation from './components/ParticleAnimation';
import Editor from './components/Editor';
import './index.css';

const App = () => {
  const [style, setStyle] = useState({ 
    brushSize: 5, 
    color: '#000', 
    backgroundColor: '#0000ff' 
  });

  const handleExport = () => {
    const canvas = document.querySelector('#editor-canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png', { alpha: true });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'sandscript.png';
      link.click();
    }
  };

  const handleColorChange = (e) => {
    setStyle({ ...style, color: e.target.value });
  };

  const handleBackgroundChange = (e) => {
    setStyle({ ...style, backgroundColor: e.target.value });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center">Sandscript</h1>
      <div className="mt-4">
        <ParticleAnimation 
          color={style.color} 
          backgroundColor={style.backgroundColor} 
        />
        <Editor style={style} />
      </div>
      <div className="mt-4 flex space-x-4">
        <input
          type="color"
          value={style.color}
          onChange={handleColorChange}
          className="w-10 h-10"
        />
        <input
          type="color"
          value={style.backgroundColor}
          onChange={handleBackgroundChange}
          className="w-10 h-10"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={handleExport}
        >
          Export PNG
        </button>
      </div>
    </div>
  );
};

export default App;