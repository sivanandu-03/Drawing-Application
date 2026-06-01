import React from 'react';

const Gallery = ({ drawings, onSelect, onDelete }) => {
  return (
    <div className="w-full lg:w-80 flex flex-col gap-4 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-xl shrink-0 h-full overflow-y-auto max-h-[85vh] lg:max-h-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Saved Gallery
        </h2>
        <span className="text-xs font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 font-semibold">
          {drawings.length} Saved
        </span>
      </div>

      {drawings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-800 rounded-xl">
          <svg className="w-12 h-12 text-slate-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm font-medium text-slate-400">No drawings found</p>
          <p className="text-xs text-slate-500 mt-1">Click "Save" above to persist your masterpiece in this gallery!</p>
        </div>
      ) : (
        <div 
          data-testid="gallery-container"
          className="grid grid-cols-2 lg:grid-cols-1 gap-3.5"
        >
          {drawings.map((drawing, index) => (
            <div
              key={drawing.id}
              data-testid={`gallery-item-${index}`}
              onClick={() => onSelect(drawing.dataUrl)}
              className="group relative bg-slate-950/40 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-indigo-500/5 flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full bg-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden">
                <img
                  src={drawing.dataUrl}
                  alt={drawing.name}
                  className="w-full h-full object-contain p-1 transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Micro-Interaction Hover Overlay */}
                <div className="absolute inset-0 bg-indigo-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    Load Canvas
                  </span>
                </div>
              </div>

              {/* Title & Metadata Card footer */}
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-slate-200 truncate group-hover:text-indigo-300 transition-colors">
                    {drawing.name}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {drawing.createdAt ? new Date(drawing.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Recently'}
                  </span>
                </div>
                
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent loading drawing
                    onDelete(drawing.id);
                  }}
                  title="Delete Drawing"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
