import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

const Editor = ({ style }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas('editor-canvas', {
      width: 2388,
      height: 1668,
      backgroundColor: style.backgroundColor || 'rgba(0, 0, 255, 0)',
    });

    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = style.brushSize || 5;
    canvas.freeDrawingBrush.color = style.color || '#000';

    canvas.upperCanvasEl.ontouchstart = (e) => handleStart(e, canvas);
    canvas.upperCanvasEl.ontouchmove = (e) => handleMove(e, canvas);
    canvas.upperCanvasEl.ontouchend = (e) => handleEnd(e, canvas);

    function handleStart(e) {
      const touch = e.touches[0];
      const pressure = touch.force || 1;
      const tilt = touch.tiltX || 0;
      canvas.freeDrawingBrush.width = (pressure * 10) + (Math.abs(tilt) * 2);
      canvas.isDrawingMode = true;
    }

    function handleMove(e) {
      const touch = e.touches[0];
      const pressure = touch.force || 1;
      const tilt = touch.tiltX || 0;
      canvas.freeDrawingBrush.width = (pressure * 10) + (Math.abs(tilt) * 2);
    }

    function handleEnd(e) {
      canvas.isDrawingMode = false;
    }

    return () => canvas.dispose();
  }, [style]);

  return (
    <div className="p-4">
      <canvas id="editor-canvas" className="border w-full h-full" />
    </div>
  );
};

export default Editor;
