'use client';

// PublicOS 2.0 - Main Application Page

import dynamic from 'next/dynamic';

// Dynamically import Map components to avoid SSR issues with Mapbox
const MapContainer = dynamic(
  () => import('@/components/Map/MapContainer').then((mod) => mod.MapContainer),
  { ssr: false }
);

const ControlPanel = dynamic(
  () => import('@/components/Map/ControlPanel').then((mod) => mod.ControlPanel),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gray-900">
      {/* Main Map */}
      <MapContainer className="w-full h-full" />

      {/* Control Panel */}
      <ControlPanel />

      {/* Top Bar - Logo and Status */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
        {/* Connection Status */}
        <div className="bg-gray-900/90 px-3 py-2 rounded-lg flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs text-gray-300 font-mono">Connected</span>
        </div>
      </div>

      {/* Help / Keyboard Shortcuts Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-gray-900/80 px-4 py-2 rounded-lg text-xs text-gray-400 flex items-center gap-4">
          <span><kbd className="bg-gray-700 px-1 rounded">Drag</kbd> 移動</span>
          <span><kbd className="bg-gray-700 px-1 rounded">Scroll</kbd> ズーム</span>
          <span><kbd className="bg-gray-700 px-1 rounded">Right-drag</kbd> 回転</span>
          <span><kbd className="bg-gray-700 px-1 rounded">Ctrl+drag</kbd> ピッチ</span>
        </div>
      </div>
    </main>
  );
}
