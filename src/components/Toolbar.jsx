import React from 'react';

const Toolbar = ({
  tool,
  setTool,
  color,
  setColor,
  brushSize,
  setBrushSize,
  onClear,
  onUndo,
  onSave,
  onExport,
  canUndo
}) => {
  // Collection of tools with premium icons
  const tools = [
    {
      id: 'pen',
      label: 'Pen',
      testId: 'tool-pen',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    {
      id: 'eraser',
      label: 'Eraser',
      testId: 'tool-eraser',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )
    },
    {
      id: 'line',
      label: 'Line',
      testId: 'tool-line',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 20L20 4" />
        </svg>
      )
    },
    {
      id: 'rectangle',
      label: 'Rectangle',
      testId: 'tool-rectangle',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x={4} y={4} width={16} height={16} rx={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 'circle',
      label: 'Circle',
      testId: 'tool-circle',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx={12} cy={12} r={8} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 justify-between items-center p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-xl z-20">
      {/* BRAND & HEADER SECTION */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
          <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
            PARTNR<span className="text-indigo-400 font-medium text-sm px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">Canvas</span>
          </h1>
          <p className="text-xs text-slate-400">High Performance Vector & Pixel Board</p>
        </div>
      </div>

      {/* CORE TOOL SELECTION */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 border border-slate-800/80 rounded-xl">
        {tools.map((t) => {
          const isActive = tool === t.id;
          return (
            <button
              key={t.id}
              data-testid={t.testId}
              onClick={() => setTool(t.id)}
              title={t.label}
              className={`p-2.5 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.05]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t.icon}
            </button>
          );
        })}
      </div>

      {/* STROKE CONFIGURATION (COLOR & SIZE) */}
      <div className="flex items-center gap-6 px-4 py-2 bg-slate-950/30 border border-slate-800/40 rounded-xl w-full lg:w-auto justify-around">
        {/* Color Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Color</label>
          <div className="relative group flex items-center justify-center w-8 h-8 rounded-full border border-slate-700 overflow-hidden cursor-pointer" style={{ backgroundColor: color }}>
            <input
              type="color"
              data-testid="color-picker"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            {/* Soft inner glow overlay */}
            <div className="absolute inset-0 pointer-events-none border border-black/10 rounded-full" />
          </div>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* Brush Size Slider */}
        <div className="flex items-center gap-3 flex-grow lg:flex-grow-0 sm:w-48">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-8">Size</label>
          <input
            type="range"
            data-testid="brush-size-slider"
            min="1"
            max="40"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="flex-grow h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
          />
          <span className="text-xs font-mono text-indigo-400 w-6 text-right font-medium">{brushSize}px</span>
        </div>
      </div>

      {/* DRAWING SYSTEM UTILITIES */}
      <div className="flex items-center gap-2">
        {/* Undo Action */}
        <button
          data-testid="undo-button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo Action"
          className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-200 ${
            canUndo
              ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/80 hover:border-slate-600 active:scale-[0.98]'
              : 'border-slate-800/40 text-slate-600 cursor-not-allowed opacity-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>

        {/* Clear Workspace */}
        <button
          data-testid="clear-canvas-button"
          onClick={onClear}
          title="Clear Workspace"
          className="p-2.5 rounded-xl border border-rose-900/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 active:scale-[0.98] transition-all duration-200 flex items-center justify-center cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        {/* Separator */}
        <div className="h-8 w-px bg-slate-800" />

        {/* Cloud/Local Save */}
        <button
          data-testid="save-storage-button"
          onClick={onSave}
          title="Save to Local Storage"
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-medium text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save
        </button>

        {/* Disk Export */}
        <button
          data-testid="export-png-button"
          onClick={onExport}
          title="Export Canvas to PNG"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
