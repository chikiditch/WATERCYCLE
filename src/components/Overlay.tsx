import { motion, AnimatePresence } from 'motion/react';
import { HOTSPOTS, useAppStore } from '../store';
import { X } from 'lucide-react';

export const Overlay = () => {
  const { activeHotspot, setActiveHotspot } = useAppStore();
  const activeData = HOTSPOTS.find(h => h.id === activeHotspot);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      {/* Header */}
      <header className="pointer-events-auto w-full max-w-lg mb-4">
        <h1 className="text-4xl font-sans font-bold tracking-tight text-white drop-shadow-md">
          The Water Cycle
        </h1>
        <p className="text-white/90 text-sm mt-2 max-w-sm drop-shadow-sm font-medium">
          Explore the natural water cycle, the sources of "dirty water", and how they interact. Click the interactive markers to learn more.
        </p>
      </header>

      {/* Legend */}
      <div className="pointer-events-auto flex flex-wrap gap-2 text-xs font-medium text-white/80 self-start bg-black/20 p-3 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Natural Cycle</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div> Biological</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Chemical</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-lime-500"></div> Physical</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-violet-500"></div> Interaction</div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {activeData && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="pointer-events-auto absolute top-6 right-6 w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
          >
            <div className="h-2 w-full" style={{ backgroundColor: activeData.color }}></div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {activeData.category}
                </span>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="text-gray-400 hover:text-gray-800 transition-colors p-1"
                >
                  <X size={18} />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{activeData.title}</h2>
              <div className="text-gray-600 text-sm leading-relaxed space-y-2">
                {Array.isArray(activeData.description) ? (
                  activeData.description.map((para, i) => <p key={i}>{para}</p>)
                ) : (
                  <p>{activeData.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
