import React, { useRef, useEffect } from 'react';

const Canvas = ({
  tool,
  color,
  brushSize,
  history,
  setHistory,
  historyIndex,
  setHistoryIndex,
  canvasRef
}) => {
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef(null);

  // Expose the global helper for test verification
  useEffect(() => {
    window.getCanvasDataURL = () => {
      if (canvasRef.current) {
        return canvasRef.current.toDataURL('image/png');
      }
      return '';
    };
    return () => {
      delete window.getCanvasDataURL;
    };
  }, [canvasRef]);

  // Set up high-DPI scaling and handle canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set canvas dimensions with scaling
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const context = canvas.getContext('2d');
    context.scale(dpr, dpr);

    // Initial canvas style properties
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';

    // Record initial blank state in history
    const initialDataUrl = canvas.toDataURL();
    setHistory([initialDataUrl]);
    setHistoryIndex(0);

    // Resize handler
    const handleResize = () => {
      const currentRect = parent.getBoundingClientRect();
      if (currentRect.width === 0 || currentRect.height === 0) return;

      const tempImage = new Image();
      const currentData = canvas.toDataURL();
      tempImage.src = currentData;

      tempImage.onload = () => {
        canvas.width = currentRect.width * dpr;
        canvas.height = currentRect.height * dpr;
        canvas.style.width = `${currentRect.width}px`;
        canvas.style.height = `${currentRect.height}px`;

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        ctx.drawImage(tempImage, 0, 0, currentRect.width, currentRect.height);

        // Re-apply style parameters
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
      };
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update stroke styles when tools or configurations change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
  }, [color, brushSize, tool]);

  // Reactive Effect to handle Undo/Redo state restoration
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || historyIndex < 0 || !history[historyIndex]) return;

    const context = canvas.getContext('2d');
    const img = new Image();
    img.src = history[historyIndex];
    img.onload = () => {
      context.save();
      // Reset transform temporarily to draw raw image data perfectly onto the full buffer size
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      context.restore();
    };
  }, [historyIndex]);

  // Extract mouse or touch coordinates relative to the canvas
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Drawing Event Handlers
  const startDrawing = (e) => {
    // Prevent default touch gestures (scrolling) while drawing
    if (e.cancelable) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const pos = getCoordinates(e);

    isDrawingRef.current = true;
    startPosRef.current = pos;

    // Take snapshot of current canvas state for shape previews
    snapshotRef.current = context.getImageData(0, 0, canvas.width, canvas.height);

    // Configure context for this path
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';

    if (tool === 'pen' || tool === 'eraser') {
      context.beginPath();
      context.moveTo(pos.x, pos.y);
      context.lineTo(pos.x, pos.y);
      context.stroke();
    }
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;

    // Prevent scrolling on touch devices
    if (e.cancelable) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const pos = getCoordinates(e);

    if (tool === 'pen' || tool === 'eraser') {
      context.lineTo(pos.x, pos.y);
      context.stroke();
    } else if (tool === 'line') {
      context.putImageData(snapshotRef.current, 0, 0);
      context.beginPath();
      context.moveTo(startPosRef.current.x, startPosRef.current.y);
      context.lineTo(pos.x, pos.y);
      context.stroke();
    } else if (tool === 'rectangle') {
      context.putImageData(snapshotRef.current, 0, 0);
      context.beginPath();
      const w = pos.x - startPosRef.current.x;
      const h = pos.y - startPosRef.current.y;
      context.strokeRect(startPosRef.current.x, startPosRef.current.y, w, h);
    } else if (tool === 'circle') {
      context.putImageData(snapshotRef.current, 0, 0);
      context.beginPath();
      const r = Math.sqrt(
        Math.pow(pos.x - startPosRef.current.x, 2) +
        Math.pow(pos.y - startPosRef.current.y, 2)
      );
      context.arc(startPosRef.current.x, startPosRef.current.y, r, 0, 2 * Math.PI);
      context.stroke();
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Save final state of this drawing action into history
    const dataUrl = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, dataUrl]);
    setHistoryIndex(newHistory.length);
  };

  return (
    <div className="w-full h-full relative bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl premium-canvas-container backdrop-blur-md">
      {/* Dynamic Grid Background Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #6366f1 1px, transparent 1px),
            linear-gradient(to bottom, #6366f1 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />
      
      <canvas
        ref={canvasRef}
        data-testid="drawing-canvas"
        className="w-full h-full block cursor-crosshair touch-none relative z-10"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
};

export default Canvas;
